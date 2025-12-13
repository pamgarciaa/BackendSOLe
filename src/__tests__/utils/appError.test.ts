import AppError from '../../utils/appError.util';

describe('AppError Util', () => {
    it('should create an error with status "fail" for 4xx codes', () => {
        const error = new AppError('Test error', 404);

        expect(error.message).toBe('Test error');
        expect(error.statusCode).toBe(404);
        expect(error.status).toBe('fail');
    });

    it('should create an error with status "error" for 5xx codes', () => {
        const error = new AppError('Server error', 500);

        expect(error.status).toBe('error');
    });
});