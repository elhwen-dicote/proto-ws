import http from "http";
import { app } from "./app";

const server = http.createServer(app);

const port = process.env.PORT ?? 3000;
server
    .addListener("listening",
        function onListening() {
            console.log(`server listening on port ${port}`);
        })
    .addListener("error",
        function onError(error) {
            console.log(`server error: ${error.message ?? error.name ?? error}`);
            process.exit(1);
        })
    .addListener("close",
        function onClose() {
            console.log("server closing...");
        });

server.listen(port);
