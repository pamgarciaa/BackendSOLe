import Cart from "../models/cart.model";
import Order from "../models/order.model";
import AppError from "../utils/appError.util";
import { sendEmail } from "../utils/email.util";

// ADD TO CART
const addToCart = async (
  userId: string,
  productId: string,
  quantity: number,
  productModel: string
) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  console.log("Adding to cart:", { userId, productId, quantity, productModel });

  const itemIndex = cart.items.findIndex((item) => {
    const matchProduct = item.product.toString() === productId;
    const matchModel = item.productModel === productModel;
    console.log(
      `Checking item ${item._id}: ProductMatch=${matchProduct}, ModelMatch=${matchModel} (DB: ${item.productModel} vs Req: ${productModel})`
    );
    return matchProduct && matchModel;
  });

  if (itemIndex > -1) {
    console.log("Item found at index:", itemIndex, "Updating quantity.");
    cart.items[itemIndex].quantity += Number(quantity);
  } else {
    console.log("Item not found. Adding new item.");
    cart.items.push({
      product: productId,
      quantity: Number(quantity),
      productModel: productModel,
    } as any);
  }

  await cart.save();

  return cart
    .populate("items.product")
    .then((c) => c.populate("user", "username"));
};

// GET CART
const getCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId })
    .populate("items.product")
    .populate("user", "username");

  if (cart && cart.items) {
    const validItems = cart.items.filter((item) => item.product != null);

    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }
  }

  return cart;
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

  const validItems = cart.items.filter((item) => item.product != null);

  for (const item of validItems) {
    const product: any = item.product;

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
  emailContent += `<p>¡Gracias por tu compra, ${
    user.name || user.username
  }!</p>`;

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    status: "pending",
  });

  cart.items = [];
  await cart.save();

  try {
    sendEmail(
      user.email,
      `Confirmación de Orden #${order._id}`,
      `Gracias por tu compra. Total: €${totalAmount}`,
      emailContent
    );
  } catch (error) {
    console.error("Error sending email:", error);
  }

  return order;
};

// REMOVE ITEM FROM CART
const removeItemFromCart = async (userId: string, productId: string) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new AppError("Cart not found", 404);

  const updatedCart = await Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { product: productId } } },
    { new: true }
  )
    .populate("items.product")
    .populate("user", "username");

  if (!updatedCart) throw new AppError("Cart not found", 404);

  return updatedCart;
};

export default { addToCart, getCart, checkout, removeItemFromCart };
