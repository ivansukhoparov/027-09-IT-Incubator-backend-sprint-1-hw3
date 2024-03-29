import {createNewId} from "../utils/comon";
import {PostOutputType, PostType} from "../types/posts/output";
import {CreatePostDto, UpdatePostDto} from "../types/posts/input";
import {postCollection} from "../db/db-collections";
import {postMapper} from "../types/posts/mapper";
import {BlogsRepository} from "./blogs-repository";
import {ObjectId, WithId} from "mongodb";
import {BlogType} from "../types/blogs/output";


export class PostsRepository {

    // return all posts from database
    static async getAllPosts(): Promise<PostOutputType[]> {
        const posts: WithId<PostType>[] = await postCollection.find({}).toArray();
        return posts.map(postMapper);
    };

    // return one post with given id
    static async getPostById(id: string): Promise<PostOutputType | null> {
        try {
            const post: WithId<PostType> | null = await postCollection.findOne({_id: new ObjectId(id)});
            if (!post) {
                return null;
            }
            return postMapper(post);
        } catch (err) {
            return null;
        }


    }

    // create new post
    static async createPost(data: CreatePostDto) {
        const createdAt = new Date();
        const blog = await BlogsRepository.getBlogById(data.blogId)

        if (blog) {
            const newPost: PostType = {
                ...data,
                blogName: blog.name,
                createdAt: createdAt.toISOString()
            }
            const result = await postCollection.insertOne(newPost)
            return result.insertedId.toString();
        } else {
            return null
        }
    }

    static async createPostToBlog(blogId: string, createData: CreatePostDto) {
        const createdAt = new Date();
        const blog = await BlogsRepository.getBlogById(blogId)

        if (blog) {
            const newPost: PostType = {
                title: createData.title,
                shortDescription: createData.shortDescription,
                content: createData.content,
                blogId: blogId,
                blogName: blog.name,
                createdAt: createdAt.toISOString()
            }
            const result = await postCollection.insertOne(newPost);
            return result.insertedId.toString();
        } else {
            return null
        }
    }


    // update existing post
    static async updatePost(id: string, data: UpdatePostDto) {
        const blog = await BlogsRepository.getBlogById(data.blogId)

        const result = await postCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId,
                blogName: blog!.name
            }
        });
        return result.matchedCount === 1;

    }

    //delete post
    static async deletePost(id: string) {
        try {
            const result = await postCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (err) {
            return false
        }

    }
}

