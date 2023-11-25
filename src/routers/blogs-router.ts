import {Router, Request, Response} from "express";
import {BlogsRepository} from "../repositories/blogs-repository";
import {Params, RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {CreateBlogDto, UpdateBlogDto} from "../types/blogs/input";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {validationBlogsChains} from "../middlewares/validators/blogs-validators";
import {basicAuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {HTTP_STATUSES} from "../utils/comon";


export const blogsRouter = Router();

blogsRouter.get("/", async (req: Request, res: Response) => {
    const blogs = await BlogsRepository.getAllBlogs();
    res.status(HTTP_STATUSES.OK_200).json(blogs);
})

blogsRouter.get ("/:id", async (req: RequestWithParams<Params>, res: Response) => {
    const blog = await BlogsRepository.getBlogById(req.params.id);
    if (blog) {
        res.status(HTTP_STATUSES.OK_200).json(blog);
        return
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})

blogsRouter.post('/', basicAuthorizationMiddleware, validationBlogsChains(), inputValidationMiddleware, async (req: RequestWithBody<CreateBlogDto>, res: Response) => {
    const creatData = req.body;
    const blogID = await BlogsRepository.createBlog(creatData);
    const newBlog = await BlogsRepository.getBlogById(blogID);
    if (newBlog) {
        res.status(HTTP_STATUSES.CREATED_201).json(newBlog);
        return
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})

blogsRouter.put("/:id", basicAuthorizationMiddleware, validationBlogsChains(), inputValidationMiddleware, async (req: RequestWithBodyAndParams<Params, UpdateBlogDto>, res: Response) => {
    const updateData = req.body;
    const isUpdated = await BlogsRepository.updateBlog(req.params.id, updateData);
    if (isUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
})

blogsRouter.delete("/:id", basicAuthorizationMiddleware,async (req: RequestWithParams<Params>, res: Response) => {
    const isDeleted = await BlogsRepository.deleteBlog(req.params.id);
    if (isDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
})
