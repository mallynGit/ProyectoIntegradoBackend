export const wsChannels = {};



export function broadcast(id, data) {
  if (wsChannels[id]) {
    for (let socket of wsChannels[id]) {
      socket.send(JSON.stringify(data));
    }
  }
}


// import { WebSocketServer } from "ws";

// const wsServ = new WebSocketServer({ noServer: true });
// export default wsServ;

// wsServ.on("connection", (ws, request) => {
//   ws.on("error", console.error);

//   ws.on("message", (data) => {
//     console.log("received: %s", data, "from");
//   });
// });
