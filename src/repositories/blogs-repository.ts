import {BlogType} from "../types/blogs/output";
import {db} from "../db/db";
import {CreateBlogDto, UpdateBlogDto} from "../types/blogs/input";
import {createNewId} from "../utils/comon";

export class BlogsRepository {

    // return all blogs from database
    static getAllBlogs(): BlogType[] {
        return db.blogs;
    };

    // return one blog with given id
    static getBlogById(id: string) {
        const blog = db.blogs.find(blog => blog.id === id);

        if (!blog) {
            return null;
        }
        return blog;
    }

    // create new blog
    static createBlog(data: CreateBlogDto) {
        const createdAt = new Date();
        const newBlog: BlogType = {
            ...data,
            id: createNewId("b"),
            createdAt: createdAt.toISOString(),
            isMembership: false
        }
        db.blogs.push(newBlog);
        return newBlog.id;
    }

    // update existing blog
    static updateBlog(id: string, data: UpdateBlogDto) {
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
    static deleteBlog(id: string) {
        const blogIndex = db.blogs.findIndex(blog => blog.id === id)
        if (blogIndex >= 0) {
            db.blogs.splice(blogIndex, 1);
            return true;
        } else {
            return false;

        }
    }
}

