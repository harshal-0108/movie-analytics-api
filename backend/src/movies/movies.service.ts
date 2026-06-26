import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './schemas/movie.schema';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name)
    private movieModel: Model<Movie>,
  ) {}

  // CREATE
  async create(movie: any) {
    return this.movieModel.create(movie);
  }

  // GET ALL
 async findAll(query: any) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;

  const skip = (page - 1) * limit;

  // ----------------------------
  // 🔍 FILTERING
  // ----------------------------
  const filter: any = {};

  if (query.genre) {
    filter.genre = query.genre;
  }

  if (query.title) {
    filter.title = { $regex: query.title, $options: 'i' };
  }

  // ----------------------------
  // 📊 SORTING
  // ----------------------------
  let sort: any = {};

  if (query.sort) {
    const order = query.order === 'desc' ? -1 : 1;
    sort[query.sort] = order;
  }

  // ----------------------------
  // DB QUERY
  // ----------------------------
  const movies = await this.movieModel
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await this.movieModel.countDocuments(filter);

  return {
    data: movies,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

  // GET ONE
  async findOne(id: string) {
    return this.movieModel.findById(id);
  }

  // UPDATE
  async update(id: string, movie: any) {
    return this.movieModel.findByIdAndUpdate(id, movie, {
      new: true,
    });
  }

  // DELETE
  async remove(id: string) {
    return this.movieModel.findByIdAndDelete(id);
  }

  //ANALYTICS
  async getAnalytics() {
  const movies = await this.movieModel.find();

  const totalMovies = movies.length;

  // Average rating
  const averageRating =
    movies.reduce((sum, movie) => sum + movie.rating, 0) /
    (totalMovies || 1);

  // Highest rated movie
  let highestRatedMovie = null;
  let highestRating = 0;

  movies.forEach((movie) => {
    if (movie.rating > highestRating) {
      let highestRatedMovie = "N/A";
let highestRating = -1;

movies.forEach((movie) => {
  if (movie.rating > highestRating) {
    highestRating = movie.rating;
    highestRatedMovie = movie.title;
  }
});
    }
  });

  // Genre distribution
  const genreStats: any = {};

  movies.forEach((movie) => {
    if (genreStats[movie.genre]) {
      genreStats[movie.genre]++;
    } else {
      genreStats[movie.genre] = 1;
    }
  });

  return {
    totalMovies,
    averageRating: Number(averageRating.toFixed(2)),
    highestRatedMovie,
    genreStats,
  };
}
}