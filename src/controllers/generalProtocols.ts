export interface HttpResponse<T>{
    statusCode:number;
    body:T | string;
}

export interface HttpRequest<B>{
    params?:any;
    body?:B;
    headers?:any;
}

