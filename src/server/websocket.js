import { WebSocketServer } from "ws";

const wsServ = new WebSocketServer({ port: 4000 });

export const wsChannels = {};

wsServ.on("connection", (ws) => {
  if (ws.protocol && !wsChannels[ws.protocol]) {
    wsChannels[ws.protocol] = [];
  }
  if (ws.protocol) {
    console.log("Client connected", ws.protocol);
    wsChannels[ws.protocol].push(ws);
    ws.on("message", (data) => {
      let msg = data.toString();
      msg = JSON.parse(msg);
      if (msg.id) {
        if (msg.content) {
          broadcast(ws.protocol, msg);
        }
        // wsChannels[msg.id] = ws;
        console.log("observa el array", wsChannels[ws.protocol].length);
      }
    });

    ws.on("close", (data) => {
      console.log('desconectado :(', data)
      if (ws.protocol) {
        wsChannels[ws.protocol].splice(wsChannels[ws.protocol].indexOf(ws), 1);
        console.log("observa el array despues de disconnect", wsChannels[ws.protocol].length);
      }
    })

  }
});

export function broadcast(id, data) {
  if (wsChannels[id]) {
    for (let socket of wsChannels[id]) {
      socket.send(JSON.stringify(data));
    }
  }
}

export default wsServ;
