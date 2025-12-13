import cartService from '../../services/cart.service';
import Cart from '../../models/cart.model';

jest.mock('../../models/cart.model');

describe('Cart Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addToCart', () => {
        it('should create a new cart if the user does not have one', async () => {
            const userId = 'user1';
            const productId = 'prod1';
            const quantity = 2;

            const mockPopulatePromise = {
                then: jest.fn().mockResolvedValue('populatedCart')
            };

            const mockCart = {
                items: [] as any[],
                save: jest.fn(),
                populate: jest.fn().mockReturnValue(mockPopulatePromise)
            };

            (Cart.findOne as jest.Mock).mockResolvedValue(null);
            (Cart.create as jest.Mock).mockResolvedValue(mockCart);

            await cartService.addToCart(userId, productId, quantity);

            expect(Cart.create).toHaveBeenCalled();
            expect(mockCart.items).toHaveLength(1);
            expect(mockCart.items[0]).toMatchObject({ product: productId, quantity: 2 });
            expect(mockCart.populate).toHaveBeenCalled();
        });

        it('should increase quantity if the product already exists in the cart', async () => {
            const userId = 'user1';
            const productId = 'prod1';
            const quantity = 3;

            const mockPopulatePromise = {
                then: jest.fn().mockResolvedValue('updatedCart')
            };

            const mockCart = {
                user: userId,
                items: [{ product: 'prod1', quantity: 1 }],
                save: jest.fn(),
                populate: jest.fn().mockReturnValue(mockPopulatePromise)
            };

            (Cart.findOne as jest.Mock).mockResolvedValue(mockCart);

            await cartService.addToCart(userId, productId, quantity);

            expect(mockCart.items[0].quantity).toBe(4);
            expect(mockCart.save).toHaveBeenCalled();
        });
    });
});