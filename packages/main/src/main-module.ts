import express from "express";
import { module } from "@proto/e-serv";
import { LoggerMiddleware } from "./logger-middleware";

@module({
    middlewares: [
        { requestHandler: express.json() },
        { requestHandler: express.urlencoded({ extended: false }) },
        { requestHandler: LoggerMiddleware },
    ]
})
export class MainModule {

}