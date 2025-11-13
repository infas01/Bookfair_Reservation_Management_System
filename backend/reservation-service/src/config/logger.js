const { createLogger, format, transports } = require('winston');

const logger = createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: format.combine(
		format.timestamp(),
		format.errors({ stack: true }),
		format.printf(({ timestamp, level, message, stack }) => {
			const output = stack || message;
			return `${timestamp} [${level}] ${output}`;
		})
	),
	transports: [new transports.Console()],
});

module.exports = logger;
