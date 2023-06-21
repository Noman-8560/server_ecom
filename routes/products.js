const { Product, validateProduct } = require('../models/product');
const _ = require('lodash');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path')
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './storage/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    }
 });

router.post('/', [auth, admin], upload.single('image'), async (req, res) => {
    const {error} = validateProduct(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let product = new Product(_.pick(req.body, ['title', 'price', 'description']));
    product.image = req.file.path;
    await product.save();
    res.send(product);
});

router.get('/:id', validateObjectId, async(req, res) => {
    const product = await Product.findById(req.params.id);
    res.send(product);
});

router.get('/remove/:id', [auth, admin, validateObjectId], async (req, res) => {
    const product = await Product.findByIdAndRemove(req.params.id);
  
    if (!product) return res.status(404).send('The product with the given ID was not found.');
    const reqPath = path.join(__dirname, '../');
    fs.unlink(`${reqPath}/${product.image}`, (err) => {
        if (err){
            console.log("An error occured while deleting file.")
        } 
      });
  
    res.send(product);
});

router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const products = await Product.find().sort('price')
    .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.count();
    
    res.json({
    products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
});

module.exports = router;