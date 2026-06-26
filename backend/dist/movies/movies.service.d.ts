import { Model } from 'mongoose';
import { Movie } from './schemas/movie.schema';
export declare class MoviesService {
    private movieModel;
    constructor(movieModel: Model<Movie>);
    create(movie: any): Promise<import("mongoose").Document<unknown, {}, Movie, {}, import("mongoose").DefaultSchemaOptions> & Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(query: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, Movie, {}, import("mongoose").DefaultSchemaOptions> & Movie & Required<{
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
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, Movie, {}, import("mongoose").DefaultSchemaOptions> & Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(id: string, movie: any): Promise<(import("mongoose").Document<unknown, {}, Movie, {}, import("mongoose").DefaultSchemaOptions> & Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, Movie, {}, import("mongoose").DefaultSchemaOptions> & Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getAnalytics(): Promise<{
        totalMovies: number;
        averageRating: number;
        highestRatedMovie: null;
        genreStats: any;
    }>;
}
