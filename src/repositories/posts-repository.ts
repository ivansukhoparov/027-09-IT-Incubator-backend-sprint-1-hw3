import {db} from "../db/db";
import {createNewId} from "../utils/comon";
import {PostType} from "../types/posts/output";
import {CreatePostDto, UpdatePostDto} from "../types/posts/input";
import {BlogsRepository} from "./blogs-repository";

export class PostsRepository {

    // return all posts from database
    static getAllPosts(): PostType[] {
        return db.posts;
    };

    // return one post with given id
    static getPostById(id: string) {
        const post = db.posts.find(post => post.id === id);

        if (!post) {
            return null;
        }
        return post;
    }

    // create new post
    static createPost(data: CreatePostDto) {
        const createdAt = new Date();
        const blogName = BlogsRepository.getBlogById(data.blogId)
        if (blogName) {
            const newPost: PostType = {
                ...data,
                id: createNewId("b"),
                blogName: blogName.name,
                createdAt: createdAt.toISOString()
            }
            db.posts.push(newPost);
            return newPost.id;
        } else {
            return null
        }
    }

    // update existing post
    static updatePost(id: string, data: UpdatePostDto) {
        const blogName = BlogsRepository.getBlogById(data.blogId)
        const postIndex = db.posts.findIndex(post => post.id === id)
        const post = db.posts[postIndex];

        if (post && blogName) {
            const newPost = {
                ...post,
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId,
                blogName: blogName.name
            }
            db.posts.splice(postIndex, 1, newPost);
            return true;
        } else {
            return false;
        }
    }

    //delete post
    static deletePost(id: string) {
        const postIndex = db.posts.findIndex(post => post.id === id)
        if (postIndex >= 0) {
            db.posts.splice(postIndex, 1);
            return true;
        } else {
            return false;

        }
    }
}

