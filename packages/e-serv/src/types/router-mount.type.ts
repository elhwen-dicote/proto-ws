import express from "express";

export interface Router {
    [idx: string | symbol]: Function;
}

export interface RouterMount {
    path?: string;
    router: express.Router;
}