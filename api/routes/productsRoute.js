const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check_auth');

const ProductsController = require('../controllers/productsController');

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './upload/');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString().replace(/:|\./g,'')  + ' - ' +  file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	//reject a file
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	}else{
		cb(null, false);
	}
};

const upload = multer({
	storage: storage, 
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});

router.get('/', ProductsController.get_all_products);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_product); 

router.patch('/:productId', checkAuth, ProductsController.products_update_product); 

router.delete('/:productId', checkAuth, ProductsController.products_delete_product); 

module.exports = router;