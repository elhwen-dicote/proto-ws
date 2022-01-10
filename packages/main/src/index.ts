import { Server } from "@proto/e-serv";
import { MainModule } from "./main-module";

const PORT = parseInt(process.env.PORT ?? "3000");

const server = Server.create(MainModule);
server.listen(PORT);

