import express from "express";
import { InjectionTokens, rootContainer } from "@proto/e-serv";

export const route = express.Router();
route.get("/",
    (req, res, _next) => {
        const context = req.context;
        const body = rootContainer.get(InjectionTokens.BODY, context);
        console.log(body);
        res.json(body);
    });
