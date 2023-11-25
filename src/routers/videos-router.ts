import {Router,Request, Response} from "express";
import {ErrorType, Params, RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {AvailableResolutions, VideoType} from "../types/videos/output";
import {CreateVideoDto, UpdateVideoDto} from "../types/videos/input";

import {db} from "../db/memory-db";


export const videosRouter = Router()

videosRouter.get("/", (req:Request, res:Response):void=>{
    res.send(db.videos);
})

videosRouter.get("/:id", (req:RequestWithParams<Params> ,res:Response):void=>{
    const id: number = +req.params.id;
    const video:VideoType|undefined = db.videos.find((el)=> el.id === id);
    if (!video) {
        res.sendStatus(404)
    }else{
        res.status(200).send(video)
    }
})

videosRouter.post("/", (req:RequestWithBody<CreateVideoDto>,res:Response):void=>{
    let errors:ErrorType = {
        errorsMessages:[]
    }

    let {title,author,availableResolutions} = req.body;

    if (!title || title.trim().length<1 || title.trim().length>40){
        errors.errorsMessages.push({message:"Invalid title", field:"title"});
    }

    if (!author || author.trim().length<1 || author.trim().length>20){
        errors.errorsMessages.push({message:"Invalid author", field:"author"});
    }

    if (Array.isArray(availableResolutions)){
        availableResolutions.map((r)=>{
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({message:"Invalid availableResolutions", field:"availableResolutions"});
        })
    }else{
        availableResolutions=[]
    }

    if (errors.errorsMessages.length){
        res.status(400).send(errors)
        return
    }

    const createdAt= new Date();
    const publicationDate = new Date();

    publicationDate.setDate(createdAt.getDate()+1);

    const newVideo: VideoType = {
        id : +(new Date()),
        title :   title  ,
        author :  author  ,
        canBeDownloaded : false,
        minAgeRestriction : null,
        createdAt :   createdAt.toISOString()  ,
        publicationDate :   publicationDate.toISOString()  ,
        availableResolutions : availableResolutions
    }

    db.videos.push(newVideo);
    res.status(201).send(newVideo);
})

videosRouter.put("/:id", (req: RequestWithBodyAndParams<Params, UpdateVideoDto>, res:Response):void=> {
    const id: number = +req.params.id;
    const videoIndex = db.videos.findIndex((v) => v.id === id);
    const video  = db.videos.find((v) => v.id == id);

    let errors: ErrorType = {
        errorsMessages: []
    }

    let {title, author,availableResolutions,canBeDownloaded, minAgeRestriction,publicationDate} = req.body;


    if (!title || title.trim().length<1 || title.trim().length>40) {
        errors.errorsMessages.push({message:"Invalid title", field:"title"});
    }

    if (!author || author.trim().length<1 || author.trim().length>20) {
        errors.errorsMessages.push({message:"Invalid author", field:"author"});
    }

    if (Array.isArray(availableResolutions)){
        availableResolutions.map((r)=>{
            if (!AvailableResolutions.includes(r)) {
                errors.errorsMessages.push({message:"Invalid availableResolutions", field:"availableResolutions"})
            }
        })
    }else if(!Array.isArray(availableResolutions)){
        errors.errorsMessages.push({message:"Invalid availableResolutions", field:"availableResolutions"})
    }

    if (typeof canBeDownloaded!== "boolean"){
        errors.errorsMessages.push({message:"Invalid canBeDownloaded", field:"canBeDownloaded"})
    }

    if (typeof minAgeRestriction === "number") {
        if (minAgeRestriction<1 || minAgeRestriction>18) {
            errors.errorsMessages.push({
                message: "Invalid minAgeRestriction",
                field: "minAgeRestriction"
            });
        }
    }else if( minAgeRestriction !== null && typeof minAgeRestriction !== "number"){
        errors.errorsMessages.push({
            message: "Invalid minAgeRestriction",
            field: "minAgeRestriction"
        });
    }

    const dateTest = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z")
    if (!dateTest.test(publicationDate) && video){
        publicationDate = video.publicationDate;
    }


    if (errors.errorsMessages.length>0){
        res.status(400).send(errors);
        return
    }

    if(!video) {
        res.sendStatus(404)
    }
    else{
        const updateItem: VideoType = {
            id: video.id,
            title: title,
            author: author,
            canBeDownloaded: canBeDownloaded,
            minAgeRestriction: minAgeRestriction,
            createdAt: video.createdAt,
            publicationDate: publicationDate,
            availableResolutions: availableResolutions
        };

        db.videos.splice(videoIndex,1,updateItem);
        res.sendStatus(204);
    }
})

videosRouter.delete("/:id", (req:RequestWithParams<Params>,res:Response):void=>{
    const id: number = +req.params.id;
    const videoIndex = db.videos.findIndex((v) => v.id === id);
    if (videoIndex<0){
        res.sendStatus(404);
        return;
    }
    db.videos.splice(videoIndex,1)
    res.sendStatus(204)
})

