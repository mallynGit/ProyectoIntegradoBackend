import express from "express";
import dotenv from "dotenv";
import router from "./routes/main.js";
import db from "./db/db.js";
import fs from "fs";
import path from "path";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const __dirname = path.resolve() + "/src";

const app = express();
dotenv.config();

const server = http.createServer(
  // {
  //   key: fs.readFileSync("src/cert/key.pem"),
  //   cert: fs.readFileSync("src/cert/cert.pem"),
  // },
  app
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin"],
  },
});
export const wsChannels = {};

server.listen(process.env.APP_PORT, () =>
  console.log(`Listening on port ${process.env.APP_PORT}`)
);

try {
  console.log(
    process.env.TZ,
    "process.env.TZ",
    Date.parse(new Date().toLocaleString("sv-SE", "Europe/Madrid")),
    "hola?"
  );
  app.use(express.json());
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(router);

  // para sacar multimedia
  app.get("/uploads/:id", async (req, res) => {
    const { id } = req.params;
    const uploads = path.join(__dirname, "uploads");
    const files = fs.readdirSync(uploads);
    const found = files.find((file) => file.split(".")[0] == id);

    if (!found) {
      return res.status(404).send("Archivo no encontrado");
    }

    const filePath = path.join(uploads, found);

    // Obtiene la extensión del archivo para establecer el tipo de contenido
    const extension = path.extname(filePath);
    const contentType = `image/${extension.slice(1)}`;

    // Lee el contenido del archivo
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al leer el archivo");
      }

      // Establece el tipo de contenido y envía los datos de la imagen como respuesta
      res.setHeader("Content-Type", contentType);
      res.send(data);
    });
  });

  io.on("error", console.error);

  io.on("connection", (ws) => {
    let user = ws.handshake.auth.user;
    wsChannels[user] = ws;
    ws.on("error", console.error);
    console.log("conexion, clientcount:", io.engine.clientsCount);
    console.log("ws id auth", ws.handshake.auth.user);

    ws.on("disconnect", () => {
      console.log("disconnect, after dc:", io.engine.clientsCount);
      delete wsChannels[user];
    });

    ws.on("message", (data) => {
      let msg = data.toString();
      msg = JSON.parse(msg);
    });

    ws.on("join", (data) => {
      console.log("join:", data, user);

      ws.join(data);
    });

    ws.on("new msg", (data) => {
      console.log("new msg:", data, ws.id);
      console.log("rooms", ws.rooms);
    });

    // }
  });

   // app.listen(process.env.APP_PORT, () =>
  //   console.log(`Listening on port ${process.env.APP_PORT}`)
  // );
} catch (err) {
  console.log("Crash at " + new Date() + " with error: " + err);
}

export { server, io };
