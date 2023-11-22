import {Router,Request, Response} from "express";
import {db} from "../db/db";

export const testingRouter = Router()

testingRouter.delete("/all-data", (req:Request, res:Response):void=>{
     db.videos = [];
    res.sendStatus(204);
})