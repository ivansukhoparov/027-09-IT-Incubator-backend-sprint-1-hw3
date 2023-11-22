import {VideoType} from "../types/videos/output";
import {BlogType} from "./blogs/output";
import {PostType} from "./posts/output";

export type DBType = {
    videos: VideoType[],
    blogs: BlogType[],
    posts: PostType[]
}