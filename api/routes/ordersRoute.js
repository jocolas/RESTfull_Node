const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orderModel');
const Product = require('../models/productModel');

//Handle incoming GET requests to /orders
router.get('/', (req, res, next) => {
	Order.find().select('_id product qty ').populate('product', 'name').exec().then(docs => {
		//console.log(docs);
		const response = {
			count: docs.length,
			orders: docs.map(doc => {
				return {
					_id: doc._id,
					product: doc.product,
					qty: doc.qty,
					request:{
						type: 'GET',
						url: 'http://localhost:3000/orders/' + doc._id
					}
				}
			})
		}
		res.status(200).json(response);
	}).catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});


router.post('/', (req, res, next) => {
	Product.findById(req.body.productId).then(product => {
		if (!product) {
			return res.status(404).json({
				message: 'Product not found'
			});
		}
		const order = new Order({
			_id: mongoose.Types.ObjectId(),
			product: req.body.productId, 
			qty: req.body.qty, 
		});
		return order.save();
	}).then(result => {
		res.status(201).json({
			message: 'Order stored successfully!',
			createdOrder: {
				_id: result._id,
				product: result.product,
				qty: result.qty
			},
			request:{
				type: 'GET',
				url: 'http://localhost:3000/orders/' + result._id
			}
		});
	}).catch(err =>{
		res.status(500).json({
			message: 'Product not found',
			error: err
		});
	});
	
});

router.get('/:orderId', (req, res, next) => {
	Order.findById(req.params.orderId).populate('product').select('_id product qty').exec().then(order => {
		if (!order) {
			return res.status(404).json({
				message: 'Order not found'
			});
		}
		res.status(200).json({
			order: order,
			request:{
				type: 'GET',
				url: 'http://localhost:3000/orders/' + order._id
			}
		});
	}).catch(err =>{
		res.status(500).json({
			error: err
		});
	});
});

router.delete('/:orderId', (req, res, next) => {
	Order.deleteOne({_id: req.params.orderId }).exec().then(result => {
		res.status(200).json({
			message: 'Order deleted!',
			request: {
				type: 'POST',
				url: 'http://localhost:3000/orders/',
				body: { productId: 'ID', qty: 'Number' }
			}
		});
	}).catch(err => {
		res.status(500).json({
			error: err
		});
	});
});

module.exports = router;