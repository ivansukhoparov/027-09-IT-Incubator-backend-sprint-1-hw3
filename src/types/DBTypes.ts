import {VideoType} from "../types/videos/output";
import {OutputBlogType} from "./blogs/output";
import {PostType} from "./posts/output";

export type DBType = {
    videos: VideoType[],
    blogs: OutputBlogType[],
    posts: PostType[]
}
