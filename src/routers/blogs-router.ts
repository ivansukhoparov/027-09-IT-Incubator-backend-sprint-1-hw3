import {Router, Request, Response} from "express";
import {BlogsRepository} from "../repositories/blogs-repository";
import {
    Params,
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithSearchTerms, SortBlogRepositoryType, QueryBlogRequestType, SearchBlogRepositoryType
} from "../types/common";
import {CreateBlogDto, UpdateBlogDto} from "../types/blogs/input";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {validationBlogsChains} from "../middlewares/validators/blogs-validators";
import {basicAuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {HTTP_STATUSES} from "../utils/comon";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";
import {validationPostsChains, validationPostsChainsNoBlogId} from "../middlewares/validators/posts-validators";
import {CreatePostDto} from "../types/posts/input";


export const blogsRouter = Router();

blogsRouter.get("/", async (req: RequestWithSearchTerms<QueryBlogRequestType>, res: Response) => {

    const query: QueryBlogRequestType = req.query

    const sortData: SortBlogRepositoryType = {
        sortBy: query.sortBy || "createdAt",
        sortDirection: query.sortDirection || "desc",
        pageNumber: query.pageNumber || 1,
        pageSize: query.pageSize || 10
    }
    const searchData: SearchBlogRepositoryType = {
        searchNameTerm: query.searchNameTerm || null
    }

    const blogs = await BlogsQueryRepository.getAllBlogs(sortData, searchData);
    res.status(HTTP_STATUSES.OK_200).json(blogs);
})

blogsRouter.get("/:id", async (req: RequestWithParams<Params>, res: Response) => {
    const blog = await BlogsRepository.getBlogById(req.params.id);
    if (blog) {
        res.status(HTTP_STATUSES.OK_200).json(blog);
        return
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})

blogsRouter.post('/',
    basicAuthorizationMiddleware,
    validationBlogsChains(),
    inputValidationMiddleware,
    async (req: RequestWithBody<CreateBlogDto>, res: Response) => {
        const creatData = req.body;
        const blogID = await BlogsRepository.createBlog(creatData);
        const newBlog = await BlogsRepository.getBlogById(blogID);
        if (newBlog) {
            res.status(HTTP_STATUSES.CREATED_201).json(newBlog);
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })

blogsRouter.post("/:id/post"),
    basicAuthorizationMiddleware,
    validationPostsChainsNoBlogId(),
    inputValidationMiddleware,
    async (req: RequestWithBodyAndParams<Params, CreatePostDto>, res: Response) => {
        const blogId = req.params.id;
        const createData = req.body;
        const createdPost = await BlogsRepository.createPostToBlog(blogId,createData);
        if (!createdPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.status(HTTP_STATUSES.CREATED_201).json(createdPost)
    }

blogsRouter.put("/:id",
    basicAuthorizationMiddleware,
    validationBlogsChains(),
    inputValidationMiddleware,
    async (req: RequestWithBodyAndParams<Params, UpdateBlogDto>, res: Response) => {
        const updateData = req.body;
        const isUpdated = await BlogsRepository.updateBlog(req.params.id, updateData);
        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    })

blogsRouter.delete("/:id",
    basicAuthorizationMiddleware,
    async (req: RequestWithParams<Params>, res: Response) => {
        const isDeleted = await BlogsRepository.deleteBlog(req.params.id);
        if (isDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    })
