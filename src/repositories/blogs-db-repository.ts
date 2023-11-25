import {BlogType, OutputBlogType} from "../types/blogs/output";
import {CreateBlogDto, UpdateBlogDto} from "../types/blogs/input";
import {db} from "../db/memory-db";
import {client} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {blogMapper} from "../types/blogs/mapper";

export class BlogsInMemoryRepository {

    // return all blogs from database
    static async getAllBlogs() {
        const blogs:WithId<BlogType> []= await client.db("node-blogs").collection("blogs").find({}).toArray();
        return blogs.map(blogMapper)
    };

    // return one blog with given id
    static async getBlogById(id: string): Promise<OutputBlogType | null> {
        const blog: WithId<BlogType> | null = await client.db("node-blogs").collection("blogs").findOne({_id: new ObjectId(id)});
        if (!blog) {
            return null;
        }
        return blogMapper(blog)
    }

    // create new blog
    static async createBlog(data: CreateBlogDto) {
        const createdAt = new Date();
        const newBlog: BlogType = {
            ...data,
            createdAt: createdAt.toISOString(),
            isMembership: false
        }
        await client.db("node-blogs").collection("blogs").insertOne(newBlog)
    }

    // update existing blog
    static async updateBlog(id: string, data: UpdateBlogDto) {
        const blogIndex = db.blogs.findIndex(blog => blog.id === id)
        const blog = db.blogs[blogIndex];
        if (blog) {
            const newBlog = {
                ...blog,
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            }
            db.blogs.splice(blogIndex, 1, newBlog);
            return true;
        } else {
            return false;
        }
    }

    //delete blog
    static async deleteBlog(id: string) {
        const blogIndex = db.blogs.findIndex(blog => blog.id === id)
        if (blogIndex >= 0) {
            db.blogs.splice(blogIndex, 1);
            return true;
        } else {
            return false;

        }
    }
}

