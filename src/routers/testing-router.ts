import {Router,Request, Response} from "express";

import {db} from "../db/memory-db";

export const testingRouter = Router()

testingRouter.delete("/all-data", (req:Request, res:Response):void=>{
     db.videos = [];
    db.blogs = [];
    db.posts = [];
    res.sendStatus(204);
})
