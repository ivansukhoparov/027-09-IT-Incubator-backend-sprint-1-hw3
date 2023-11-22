import {Router, Request, Response} from "express";
import {Params, RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {basicAuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {HTTP_STATUSES} from "../utils/comon";
import {PostsRepository} from "../repositories/posts-repository";
import {CreatePostDto, UpdatePostDto} from "../types/posts/input";
import {validationPostsChains} from "../middlewares/validators/posts-validators";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";

export const postsRouter = Router();

postsRouter.get("/", (req: Request, res: Response) => {
    const posts = PostsRepository.getAllPosts();
    res.status(HTTP_STATUSES.OK_200).json(posts);
})

postsRouter.get("/:id", (req: RequestWithParams<Params>, res: Response) => {
    const post = PostsRepository.getPostById(req.params.id);
    if (post) {
        res.status(HTTP_STATUSES.OK_200).json(post);
        return
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})

postsRouter.post('/',basicAuthorizationMiddleware,validationPostsChains(),inputValidationMiddleware, (req: RequestWithBody<CreatePostDto>, res: Response) => {
    const creatData = req.body;
    const postID = PostsRepository.createPost(creatData);
    if (postID) {
        const newPost = PostsRepository.getPostById(postID);

        if (newPost) {
            res.status(HTTP_STATUSES.CREATED_201).json(newPost);
            return
        }
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

postsRouter.put("/:id",basicAuthorizationMiddleware,validationPostsChains(),inputValidationMiddleware, (req: RequestWithBodyAndParams<Params, UpdatePostDto>, res: Response) => {
    const updateData = req.body;
    const isUpdated = PostsRepository.updatePost(req.params.id, updateData);
    if (isUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
})

postsRouter.delete("/:id", basicAuthorizationMiddleware, (req: RequestWithParams<Params>, res: Response) => {
    const isDeleted = PostsRepository.deletePost(req.params.id);
    if (isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return;
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
})