// const mongoose = require('mongoose');
// const { productSchema } = require('./product.model');
// const config = require("../config/config");

// // Define the cart schema
// const cartSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   items: [{
//     product: {
//       type: productSchema,
//       required: true
//     },
//     quantity: {
//       type: Number,
//       default: 1
//     }
//   }],
//   paymentOption: {
//     type: String,
//     default: config.default_payment_option
//   }
// }, {
//   timestamps: true
// });

// // Define the Cart model
// const Cart = mongoose.model('Cart', cartSchema);

// module.exports = Cart;


const mongoose = require('mongoose');
const { productSchema } = require('./product.model');
const config = require("../config/config")

// TODO: CRIO_TASK_MODULE_CART - Complete cartSchema, a Mongoose schema for "carts" collection
const cartSchema = mongoose.Schema(
  {
    email:{
      type:String,
      required:true,
      unique:true
    },
    cartItems:[{
      product: productSchema,
      quantity:Number
    }],
    paymentOption:{
      type:String,
      default:config.default_payment_option
    }
  },
  {
    timestamps: false,
  }
);


/**
 * @typedef Cart
 */
const Cart = mongoose.model('Cart', cartSchema);

module.exports.Cart = Cart;