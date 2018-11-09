// require nodejs components
const { exec } = require('child_process');
// require npm packages
const chalk = require('chalk');
const connect = require('connect');
const expandTilde = require('expand-tilde');
const serveStatic = require('serve-static');

function startServer() {
    connect().use(serveStatic(expandTilde(process.env.OUTPUT_DIR))).listen(8080, function(){
        console.log(`Test server running on 8080 - press ${chalk.cyan('Ctrl + C')} to cancel.`);
        exec(`open http://localhost:8080`)
    });  
}

module.exports = {
    startServer: startServer
}