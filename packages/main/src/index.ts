import { Server } from "@proto/e-serv";
import { route } from "./route";

const PORT = parseInt(process.env.PORT ?? "3000");

const server = new Server();
server.expressApplication.use("/body", route);
server.listen(PORT);

