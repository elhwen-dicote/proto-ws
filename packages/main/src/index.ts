import { Server } from "@proto/e-serv";
import { MainModule } from "./main-module";
import { route } from "./route";

const PORT = parseInt(process.env.PORT ?? "3000");

const server = Server.create(MainModule);
server.expressApplication.use("/body", route);
server.listen(PORT);

