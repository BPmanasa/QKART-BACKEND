const httpStatus = require("http-status");
const { Cart, Product, User } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

// TODO: CRIO_TASK_MODULE_CART - Implement the Cart service methods

/**
 * Fetches cart for a user
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
  // const cart = await Cart.findOne({user : user._id}).populate("cartItems.product");

  // if(!cart){
  //  throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  // }

  // return cart;
  const cart = await Cart.findOne({email:user.email})
  if(!cart){
    throw new ApiError(httpStatus.NOT_FOUND,"User does not have a cart")
  }
  return cart;
};

/**
 * Adds a new product to cart
 * - Get user's cart object using "Cart" model's findOne() method
 * --- If it doesn't exist, create one
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code
 *
 * - If product to add already in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - Otherwise, add product to user's cart
 *
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
// const addProductToCart = async (user, productId, quantity) => {
//   let cart = await Cart.findOne({email:user.email});
//   if(!cart){
//     try{
//       cart = await Cart.create({
//         email:user.email,
//         cartItems: [],
//         paymentOption:config.default_payment_option,
//       });

//     }
//     catch(error){
//       throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User cart creation failed because user already have a cart");
     
//     }
//   }
  
//   if(cart == null){
//     throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User does not have a cart");
//   }


//   let productIndex = -1;
//   for(let i=0;i<cart.cartItems.length;i++){
//     if(productId === cart.cartItems[i].product._id){
//       productIndex = i;
//     }
//   }

//   if(productIndex==-1){
//     let product = await Product.findOne({_id:productId});
//     if(product ===null){
//       throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in database")
//     }
//     cart.cartItems.push({product:product, quantity:quantity})

//   }
//   else{
//     throw new ApiError(httpStatus.BAD_REQUEST, "Product already in cart. Use the cart sidebar to update or remove product from cart")
//   }
//   await cart.save();
//   return cart;
// };

const addProductToCart = async (user, productId, quantity) => {
  let cart = await Cart.findOne({email:user.email});

  if (!cart){
    try{
       cart = await Cart.create({
        email:user.email,
        cartItems:[],
        paymentOption:config.default_payment_option,
        });
        await cart.save();
    }catch(e){
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,"User cart creation failed");
    }
  }

if(cart.cartItems.some((item)=>item.product._id == productId))
{
  throw new ApiError(httpStatus.BAD_REQUEST,"Product already in cart. Use the cart sidebar to update or remove product from cart")
}

const product = await Product.findOne({_id:productId})
if(!product){
  throw new ApiError(httpStatus.BAD_REQUEST,"product doesn't exist in the database")
}

cart.cartItems.push({ product,quantity})
await cart.save();

return cart;

};

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided and return the cart object
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
// const updateProductInCart = async (user, productId, quantity) => {


  const updateProductInCart = async (user, productId, quantity) => {
  
    const cart = await Cart.findOne({email:user.email});
  
    if (!cart){
    
        throw new ApiError(httpStatus.BAD_REQUEST,"User does not have a cart. Use POST to create cart and add a product");
      
    }
  
  
  //[ {P:{id},Q} , {P:{id},Q} , {P:{id},Q} , {P:{id},Q} ]
  
  const product = await Product.findOne({_id: productId});
  
  if(!product){
    throw new ApiError(httpStatus.BAD_REQUEST,"Product doesn't exist in database");
  }
  
  const productIndex = cart.cartItems.findIndex(item => item.product._id == productId);
  
   if(productIndex ===-1){
    throw new ApiError(httpStatus.BAD_REQUEST,"Product not in cart")
   }
  
   cart.cartItems[productIndex].quantity = quantity;
  
   await cart.save();
   return cart;
  }
//  let cart = await Cart.findOne({email:user.email});

//  if(cart==null){
//   throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart. Use POST to create and add a product");
//  }

//  let product = await Product.findOne({_id:productId});

//  if(product==null){
//   throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in database");
//  }

//  let productIndex = -1;
//  for(let i=0;i<cartItems.length;i++){
//   if(productId == cart.cartItems[i].product._id){
//     productIndex = i;
//   }
//  }

//  if(productIndex == -1){
//   throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart")
//  }
//  else{
//   cart.cartItems[productIndex].quantity = quantity;
//  }

//  await cart.save();
//  return cart;


// };

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
// const deleteProductFromCart = async (user, productId) => {
// // Find the cart associated with the user
// const cart = await Cart.findOne({ user: user._id });

// // If the cart doesn't exist, throw an error
// if (!cart) {
//   throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart");
// }

// // Find the index of the product in the cart items array
// const index = cart.cartItems.findIndex(item => item.product.toString() === productId);

// // If the product is not in the cart, throw an error
// if (index === -1) {
//   throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
// }

// // Remove the product from the cart
// cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== productId);

// // Save the updated cart
// await cart.save();
// };

const deleteProductFromCart = async (user, productId) => {
  
  const cart = await Cart.findOne({email:user.email});
  if(!cart){
   throw new ApiError(httpStatus.BAD_REQUEST,"User does not have a cart")
  }
  const productIndex = cart.cartItems.findIndex(item => item.product._id == productId);
 
  if(productIndex ===-1){
   throw new ApiError(httpStatus.BAD_REQUEST,"Product not in cart")
  }
 
  cart.cartItems.splice(productIndex,1)
  await cart.save();
 
 };


module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
};
