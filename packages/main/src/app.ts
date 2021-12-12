import express from "express";
import { route } from "./route";
import { setupRequestDiMiddleware } from "@proto/e-serv";

export const app = express();

app.use(setupRequestDiMiddleware);
app.use(express.json());
app.use("/body", route);

