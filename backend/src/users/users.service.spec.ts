import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const userModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('stores preference updates on the current user profile', async () => {
    userModel.findOne.mockResolvedValueOnce({
      _id: 'user-1',
      name: 'Harshal',
      email: 'harshal@example.com',
      password: 'hash',
      preferences: {},
      save: jest.fn().mockResolvedValue({}),
    });

    const result = await service.updatePreferences({ theme: 'dark' });

    expect(result.preferences.theme).toBe('dark');
  });
});
