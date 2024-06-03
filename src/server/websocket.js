import { WebSocketServer } from "ws";

const wsServ = new WebSocketServer({ port: 4000 });

const wsChannels = {};

wsServ.on("connection", (ws) => {
  if (ws.protocol && !wsChannels[ws.protocol]) {
    console.log("Client connected", ws.protocol);
    wsChannels[ws.protocol] = [];
  }

  if (ws.protocol) {

    wsChannels[ws.protocol].push(ws);
    ws.on("message", (data) => {
      let msg = data.toString();
      msg = JSON.parse(msg);
      if (msg.id) {
        if (msg.content) {
          wsChannels[msg.id].send(JSON.stringify(msg));
          console.log("VENGA VAAA");
        }
        wsChannels[msg.id] = ws;
        console.log("observa el array", wsChannels[ws.protocol]);
      }
    });
  }
});

export default wsServ;
