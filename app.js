const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/productsRoute');
const orderRoutes = require('./api/routes/ordersRoute');
const userRoutes = require('./api/routes/userRoute');

mongoose.connect('mongodb://localhost/rest_api',{
	useNewUrlParser: true,
	useUnifiedTopology: true,
	//useCreateIndex: true
}).catch(error => console.log(error.reason));

mongoose.connection.on('connected', () => {
	console.log('Database connection is successful !!!');
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));

app.use('/upload', express.static('upload'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*'); //* for all website or https://weonmart.com for a particular or specific web
	res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
		return res.status(200).json({});
	}
	next();
});

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

//app.listen(5000, () => {console.log("server started at http://localhost:3000") });

module.exports = app;