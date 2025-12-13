import authService from '../../services/auth.service';
import User from '../../models/user.model';
import AppError from '../../utils/appError.util';

jest.mock('../../models/user.model');

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('loginUser', () => {
        it('should return the user if credentials are valid', async () => {

            const mockUser = {
                _id: 'user123',
                email: 'test@test.com',
                password: 'hashedPassword',
                comparePassword: jest.fn().mockResolvedValue(true),
            };

            (User.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await authService.loginUser({
                email: 'test@test.com',
                password: 'password123',
            });

            expect(result).toEqual(mockUser);
            expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
        });

        it('should throw an error if the user does not exist', async () => {
            (User.findOne as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await expect(
                authService.loginUser({ email: 'wrong@test.com', password: '123' })
            ).rejects.toThrow(AppError);
        });
    });
});