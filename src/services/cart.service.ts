import Cart from "../models/cart.model";
import Order from "../models/order.model";
import AppError from "../utils/appError.util";
import { sendEmail } from "../utils/email.util";

// ADD TO CART
const addToCart = async (userId: string, productId: string, quantity: number) => {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
    } else {
        cart.items.push({ product: productId, quantity: Number(quantity) } as any);
    }

    await cart.save();
    return cart
        .populate("items.product")
        .then((c) => c.populate("user", "username"));
};

// GET CART
const getCart = async (userId: string) => {
    return await Cart.findOne({ user: userId })
        .populate("items.product")
        .populate("user", "username");
};

// CHECKOUT 
const checkout = async (userId: string, shippingAddress: string) => {
    const cart = await Cart.findOne({ user: userId })
        .populate("items.product")
        .populate("user", "email name username");

    if (!cart || cart.items.length === 0) {
        throw new AppError("Cart is empty or not found", 400);
    }

    const user: any = cart.user;
    let totalAmount = 0;
    const orderItems = [];

    let emailContent = "<h3>Resumen de tu compra:</h3><ul>";

    for (const item of cart.items) {
        const product: any = item.product;

        if (!product) {
            throw new AppError(`Product not found for item ${item._id}`, 404);
        }

        const price = product.price;
        const quantity = item.quantity;
        const itemTotal = price * quantity;

        totalAmount += itemTotal;

        orderItems.push({
            product: product._id,
            quantity: quantity,
            priceAtPurchase: price,
        });

        emailContent += `<li><strong>${product.name}</strong> (x${quantity}) - €${itemTotal}</li>`;
    }

    emailContent += `</ul><h3>Total Pagado: €${totalAmount}</h3>`;
    emailContent += `<p>Dirección de envío: ${shippingAddress}</p>`;
    emailContent += `<p>¡Gracias por tu compra, ${user.name || user.username}!</p>`;

    const order = await Order.create({
        user: userId,
        items: orderItems,
        totalAmount,
        shippingAddress,
        status: "pending",
    });

    cart.items = [];
    await cart.save();

    sendEmail(
        user.email,
        `Confirmación de Orden #${order._id}`,
        `Gracias por tu compra. Total: €${totalAmount}`,
        emailContent
    );

    return order;
};

// REMOVE ITEM FROM CART
const removeItemFromCart = async (userId: string, productId: string) => {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) throw new AppError("Cart not found", 404);

    const itemExists = cart.items.some(
        (item) => item.product.toString() === productId
    );

    if (!itemExists) {
        throw new AppError("Product not found in cart", 404);
    }

    const updatedCart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { product: productId } } },
        { new: true }
    )
        .populate("items.product")
        .populate("user", "username");

    return updatedCart;
};

export default { addToCart, getCart, checkout, removeItemFromCart };