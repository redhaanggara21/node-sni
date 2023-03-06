import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { routes } from "../routes";


export const createServer = () => {

    const app: Application = express();
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cors())
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', '*')
        res.setHeader('Access-Control-Allow-Headers', '*')
        next();
    })

    routes(app);

}

