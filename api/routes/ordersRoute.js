const express = require('express');

const router = express.Router();

//Handle incoming GET requests to /orders
router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Order was fetched'
	});
});

router.post('/', (req, res, next) => {
	const order = {
		productId: req.body.productId,
		qty: req.body.qty
	};
	res.status(201).json({
		message: 'Order was created',
		order: order
	});
});

router.get('/:orderId', (req, res, next) => {
	res.status(201).json({
		message: 'Order detailes',
		orderId: req.params.orderId
	});
});

router.delete('/:orderId', (req, res, next) => {
	res.status(201).json({
		message: 'Order deleted',
		orderId: req.params.orderId
	});
});

module.exports = router;