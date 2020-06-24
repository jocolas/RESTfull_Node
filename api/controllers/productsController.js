const mongoose = require('mongoose');

const Product = require('../models/productModel');

exports.get_all_products = (req, res, next) => {
	Product.find().select('_id name price productImage').exec().then(docs => {
		const response = {
			count: docs.length,
			products: docs.map(doc => {
				return {
					_id: doc._id,
					name: doc.name,
					price: doc.price,
					productImage: doc.productImage,
					request:{
						type: 'GET',
						url: 'http://localhost:3000/products/' + doc._id
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
}

exports.products_create_product = (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage:req.file.path
	});
	product.save().then(result => {
		console.log(result);
		res.status(201).json({
			message: 'Product created successfully!',
			createdProduct: {
				_id: result._id,
				name: result.name,
				price: result.price,
				productImage: result.productImage,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/' +result._id
				}
			}
		});
	}).catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}

exports.products_get_product = (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id).select('_id name price productImage').exec().then(doc => {
		console.log("From database", doc);
		if (doc) {
			res.status(200).json({
				product: doc,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/' + doc._id
				}
			});
		}else{
			res.status(404).json({message: 'No valid entry found for provided ID'});
		}
	}).catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
}

exports.products_update_product = (req, res, next) => {
	const id = req.params.productId;
	const updateOps = {};
	for (const ops of req.body){
		updateOps[ops.propName] = ops.value;
	}
	Product.update({ _id: id}, {$set: updateOps}).exec().then(result => {
		//console.log(result);
		res.status(200).json({
			message: 'Product updated',
			request: {
				type: 'GET',
				url:  'http://localhost:3000/products/' + id
			}
		});
	}).catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	})
}

exports.products_delete_product = (req, res, next) => {
	const id = req.params.productId;
	Product.deleteOne({ _id: id}).exec().then(result => {
		res.status(200).json({
			message: 'Product deleted!',
			request:{
				type: 'GET',
				url: 'http://localhost:3000/products/',
				body: { name: 'String', price: 'Number'}
			}
		});
	}).catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	})
}