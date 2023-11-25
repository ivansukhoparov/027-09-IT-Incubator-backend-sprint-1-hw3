import {client} from "./db";
import {BlogType} from "../types/blogs/output";
import {PostType} from "../types/posts/output";
import {VideoType} from "../types/videos/output";


const db = client.db("node-blogs");

export const blogCollection = db.collection<BlogType>("blogs");
export const postCollection = db.collection<PostType>("post");
export const videosCollection = db.collection<VideoType>("videos");
