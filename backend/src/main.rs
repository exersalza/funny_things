use std::sync::Arc;

use tokio::net::TcpListener;

/// this gonna be a messy file, dw about it
use parking_lot::Mutex;

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    response::Response,
    routing::get,
    Router,
};
use futures_util::{
    sink::SinkExt,
    stream::{SplitSink, SplitStream, StreamExt},
};
use lazy_static::lazy_static;
use tokio::sync::broadcast;
use uuid::Uuid;

async fn root() -> &'static str {
    "hello"
}

#[derive(Clone)]
pub struct RouteStates {
    pub tx: Arc<Mutex<broadcast::Sender<String>>>,
}

impl RouteStates {
    pub fn new() -> Self {
        let (tx, _rx) = broadcast::channel(254);
        Self {
            tx: Arc::new(Mutex::new(tx)),
        }
    }
}

impl Default for RouteStates {
    fn default() -> Self {
        Self::new()
    }
}

async fn tick(state: RouteStates) {
    let mut tick = tokio::time::interval(tokio::time::Duration::from_secs(1));

    loop {
        {
            let tx = state.tx.lock();
            let _ = tx.send("tick".to_string());
        }

        tick.tick().await;
    }
}

async fn ws_stuff(ws: WebSocketUpgrade, State(state): State<RouteStates>) -> Response {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

async fn handle_socket(socket: WebSocket, state: RouteStates) {
    let (tx, rx) = socket.split();

    let id = Uuid::new_v4();

    tokio::spawn(write(tx, state.clone(), id));
    tokio::spawn(read(rx, state.clone(), id));
}

async fn read(mut rec: SplitStream<WebSocket>, state: RouteStates, id: Uuid) {
    while let Some(msg) = rec.next().await {
        match msg {
            Ok(Message::Text(text)) => {}
            Ok(Message::Close(_)) => {
                let tx = state.tx.lock();
                // make sure to only kill the sibling thread
                let _ = tx.send(format!("close: {id}"));
                break;
            }
            Err(e) => println!("{e:?}"),
            _ => (),
        }
    }
}

async fn write(mut sen: SplitSink<WebSocket, Message>, state: RouteStates, id: Uuid) {
    let mut rx = state.tx.lock().subscribe();

    if sen.send(Message::Ping(vec![1, 2, 3].into())).await.is_err() {
        return;
    }

    while let Ok(msg) = rx.recv().await {
        if msg == format!("close: {id}") {
            break;
        }

        if sen.send(Message::Text(msg.clone().into())).await.is_err() {
            break;
        }
    }
}

#[tokio::main]
async fn main() {
    let router = Router::new()
        .route("/", get(root))
        .route("/ws", get(ws_stuff))
        .with_state(RouteStates::default());

    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listener, router.into_make_service())
        .await
        .unwrap();
}
