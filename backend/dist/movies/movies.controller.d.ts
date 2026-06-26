import { MoviesService } from './movies.service';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    create(body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/movie.schema").Movie, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/movie.schema").Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/movie.schema").Movie, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/movie.schema").Movie & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAnalytics(): Promise<{
        totalMovies: number;
        averageRating: number;
        highestRatedMovie: null;
        genreStats: any;
    }>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/movie.schema").Movie, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/movie.schema").Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(id: string, body: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/movie.schema").Movie, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/movie.schema").Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/movie.schema").Movie, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/movie.schema").Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
