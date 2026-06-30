import { Module } from '@nestjs/common';

import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/movie-analytics-db',
    ),

    MoviesModule,
    UsersModule,
  ],
})
export class AppModule {}