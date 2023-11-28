import {BlogType, BlogOutputType, BlogViewModelType} from "../types/blogs/output";
import {CreateBlogDto, UpdateBlogDto} from "../types/blogs/input";
import {client} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {blogMapper} from "../types/blogs/mapper";
import {blogCollection} from "../db/db-collections";

export class BlogsQueryRepository {

    static async getAllBlogs(pageSize:number, pageNumber:number):Promise<BlogViewModelType> {

        // for SearchNameTerm

        const documentsTotalCount = await blogCollection.countDocuments({});
        const pageCount = Math.ceil(documentsTotalCount/pageSize);
        const skipDocuments = (pageNumber-1)*pageSize;

        const blogs: WithId<BlogType>[] = await blogCollection.find({}).skip(skipDocuments).limit(pageSize).toArray()

        return {
            pagesCount : pageCount,
            page : pageNumber,
            pageSize : pageSize,
            totalCount : documentsTotalCount,
            items :blogs.map(blogMapper)
        }
    };
}

