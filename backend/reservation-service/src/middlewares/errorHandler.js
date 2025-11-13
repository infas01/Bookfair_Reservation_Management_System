const logger = require('../config/logger');

const notFoundHandler = (req, res) => {
	res.status(404).json({
		error: 'Not Found',
		message: `Route ${req.method} ${req.originalUrl} does not exist`,
	});
};

const errorHandler = (err, req, res, next) => {
	logger.error(err);

	const statusCode = err.statusCode || err.status || 500;
	const message = err.message || 'Internal Server Error';

	res.status(statusCode).json({
		error: statusCode >= 500 ? 'Internal Server Error' : 'Request Error',
		message,
	});
};

const asyncHandler = (handler) => (req, res, next) =>
	Promise.resolve(handler(req, res, next)).catch(next);

module.exports = {
	notFoundHandler,
	errorHandler,
	asyncHandler,
};
