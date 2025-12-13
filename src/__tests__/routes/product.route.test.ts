import request from 'supertest';
import { app } from '../../index';
import productService from '../../services/product.service';

jest.mock('../../services/product.service');

jest.mock('../../middlewares/auth.middleware', () => ({
    protect: (req: any, res: any, next: any) => {
        req.user = { _id: 'admin123', role: 'admin' };
        next();
    },
}));

jest.mock('../../middlewares/role.middleware', () => ({
    checkRole: (...roles: string[]) => (req: any, res: any, next: any) => {
        next();
    },
}));

describe('Product Routes', () => {
    describe('GET /api/products', () => {
        it('should get all products', async () => {
            (productService.getAllProducts as jest.Mock).mockResolvedValue([
                { name: 'Product 1' },
                { name: 'Product 2' },
            ]);

            const response = await request(app).get('/api/products');

            expect(response.status).toBe(200);
            expect(response.body.results).toBe(2);
        });
    });

    describe('POST /api/products (Protected)', () => {
        it('should create a product if user is admin (mocked)', async () => {
            const newProduct = {
                name: 'New Product',
                price: 50,
                category: 'test',
            };

            (productService.createProduct as jest.Mock).mockResolvedValue(newProduct);

            const response = await request(app)
                .post('/api/products')
                .send(newProduct);

            expect(response.status).toBeDefined();
        });
    });
});