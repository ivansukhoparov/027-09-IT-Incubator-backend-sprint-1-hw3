export const createNewId = (descriptor:string) => {
    return (new Date())+descriptor;
}

export const mongoUri = "mongodb://localhost:27017"
export const port:80 = 80;

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
    UNAUTHORIZED_401: 401
}
