import { Document } from 'mongoose';
export declare class Movie extends Document {
    title: string;
    genre: string;
    rating: number;
}
export declare const MovieSchema: import("mongoose").Schema<Movie, import("mongoose").Model<Movie, any, any, any, any, any, Movie>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Movie, Document<unknown, {}, Movie, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    genre?: import("mongoose").SchemaDefinitionProperty<string, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rating?: import("mongoose").SchemaDefinitionProperty<number, Movie, Document<unknown, {}, Movie, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Movie & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Movie>;
