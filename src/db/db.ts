import {DBType} from "../types/DBTypes";

export const db:DBType = {
    videos: [
    {
        id : 0,
        title :   "string"  ,
        author :   "string"  ,
        canBeDownloaded : true,
        minAgeRestriction : null,
        createdAt :   "2023-11-07T22:36:07.308Z"  ,
        publicationDate :   "2023-11-07T22:36:07.308Z"  ,
        availableResolutions : [
            "P144"
        ]
    }],
    blogs:[{
        id: "string",
        name: "string",
        description: "string",
        websiteUrl: "string"
    }],
    posts: [{
        id: "string",
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId: "string",
        blogName: "string"
    }]
}