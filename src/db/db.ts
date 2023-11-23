import {DBType} from "../types/DBTypes";
import {MongoClient} from "mongodb";
import {mongoUri} from "../utils/comon";

export const client = new MongoClient(mongoUri)

export const runDB = async () => {
    try {
        // Connect to server
        await client.connect();
        // Check connection
        await client.db("test").command({ping: 1});
        console.log("Mongo server connection successful");
    }catch  {
        console.log("Mongo server connection failed")
    }
}

export const db: DBType = {
    videos: [
        {
            id: 0,
            title: "string",
            author: "string",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2023-11-07T22:36:07.308Z",
            publicationDate: "2023-11-07T22:36:07.308Z",
            availableResolutions: [
                "P144"
            ]
        }],
    blogs: [{
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
