import {Request} from "express";

export type RequestWithParams<P> = Request<P,{},{},{}>
export type RequestWithBody<B> = Request<{},{},B,{}>
export type RequestWithBodyAndParams<P,B> =Request<P, {}, B, {}>
export type RequestWithSearchTerms<T> =Request<{}, {}, {}, T>

export type Params ={
    id: string
}
export type QueryDataRequestType = {
    searchNameTerm?:string|null
    sortBy?:string
    sortDirection?: "asc"|"desc"
    pageNumber?:number
    pageSize?:number
}
export type SortDataRepositoryType = {
    sortBy:string
    sortDirection: "asc"|"desc"
    pageNumber:number
    pageSize:number
}
export type SearchDataRepositoryType = {
    searchNameTerm:string|null
}



export type ErrorType = {
    errorsMessages:ErrorsMessageType[]
}
export type ErrorsMessageType = {
    field:string
    message:string
}

