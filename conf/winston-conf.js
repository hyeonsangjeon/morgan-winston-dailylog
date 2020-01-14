const winston = require('winston');
const appRoot = require('app-root-path');    //project root
require('winston-daily-rotate-file');
require('date-utils');

//format을 사용자가 구성
const myformat = winston.format.printf(
    // info => `${new Date().toFormat('YYYY-MM-DD HH:MI:SS')} ${info.level.toUpperCase()}: ${info.message}`
    info => `${new Date().toISOString().replace('T',' ').replace('Z', ' ')} ${info.level.toUpperCase()}: ${info.message}`
)


// define the custom settings for each transport (file, console)
var options = {
    dailyRotateFile: {
        level: 'info',
        filename: `${appRoot}/logs/audit.log`,
        handleExceptions: true,
        json: true,
        // maxsize: 5242880, // 5MB
        format: myformat,
        // datePattern : 'YYYY-MM-DD',
        // maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',

        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

var logger = winston.createLogger({
    transports: [
        new winston.transports.DailyRotateFile(options.dailyRotateFile),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});
// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function(message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

module.exports = logger;
