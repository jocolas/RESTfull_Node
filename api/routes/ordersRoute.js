const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check_auth');

const OrdersController = require('../controllers/ordersController');

//Handle incoming GET requests to /orders
router.get('/', checkAuth, OrdersController.get_all_orders);

router.post('/', checkAuth, OrdersController.orders_create_order);

router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;
 