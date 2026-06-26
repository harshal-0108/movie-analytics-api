import { Server } from 'socket.io';
export declare class MoviesGateway {
    server: Server;
    notifyMovieAdded(movie: any): void;
}
