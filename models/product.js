const Joi = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    },
    image: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        price: Joi.number().required(),
        description: Joi.string().min(5).max(1024).required()
    };
  
    return Joi.validate(product, schema);
  }

exports.Product = Product;
exports.validateProduct = validateProduct;