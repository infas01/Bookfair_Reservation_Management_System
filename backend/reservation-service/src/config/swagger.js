const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
	definition: {
		openapi: '3.0.3',
		info: {
			title: 'BookFair Reservation Service API',
			version: '1.0.0',
			description: 'Reservation microservice API documentation',
		},
		servers: [
			{
				url: 'http://localhost:3000/api/v1',
				description: 'Local development server',
			},
		],
		tags: [
			{ name: 'Health', description: 'Service status endpoints' },
			{ name: 'Auth', description: 'Authentication endpoints' },
			{ name: 'Reservations', description: 'Reservation endpoints' },
			{ name: 'Stalls', description: 'Stall endpoints' },
			{ name: 'Genres', description: 'Genre endpoints' },
		],
	},
	apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	app.get('/api-docs.json', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerSpec);
	});
};

module.exports = {
	setupSwagger,
};
