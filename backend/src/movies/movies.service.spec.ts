import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  const movieModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getModelToken('Movie'),
          useValue: movieModel,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('returns the highest and lowest rated movies from analytics data', async () => {
    movieModel.find.mockResolvedValueOnce([
      { title: 'Alpha', genre: 'Drama', rating: 4.1 },
      { title: 'Beta', genre: 'Sci-Fi', rating: 4.8 },
      { title: 'Gamma', genre: 'Comedy', rating: 3.2 },
    ]);

    const result = await service.getAnalytics();

    expect(result.totalMovies).toBe(3);
    expect(result.highestRatedMovie).toBe('Beta');
    expect(result.lowestRatedMovie).toBe('Gamma');
  });
});
