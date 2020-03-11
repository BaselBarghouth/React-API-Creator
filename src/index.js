import http from "http";
import app from "./server";
const port = 5001;

const server = http.createServer(app);

server.listen(port, console.log("The server is working..."));
