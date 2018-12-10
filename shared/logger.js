const { createLogger, format } = require('winston');
const { combine, timestamp } = format;

module.exports = createLogger({
    level: 'info',
    format: combine( timestamp(), format.json())
});
