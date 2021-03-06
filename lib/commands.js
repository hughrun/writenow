// require npm packages
const chalk = require('chalk');
const inquirer = require('inquirer');
// require local files
const helptext = require('./help');
const checkConfig = require('./checkConfig')
const local = require('./local');
const prepub = require('./process');
const pub = require('./publish');
const setup = require('./setup');
const wc = require('./write');
const gzip = require('./backup')

///////////////        
// COMMANDS //
/////////////          

function backup(commands) {
  checkConfig(commands)
  .then(gzip)
  .catch(err => helptext.err(err))
}

// set up environment variables and save to writenow.env
function config() {
  // let people know where to get help if unsure
  console.log(`
  ${chalk.cyan(`
  ++++++++++++
  + writenow +
  ++++++++++++
  `)}
  Welcome to ${chalk.bgBlack.white('writenow')}: a command line utility to make static-site publishing easier.
  You need to set some default values and file paths so writenow works correctly.
  If unsure, Ctrl + C and check ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('help')}
`)
  // question interface
  inquirer.prompt(setup.questions)
    .then(setup.checkRsync)
    .then(setup.checkSSH)
    .then(setup.saveConfig)
    .catch(err => helptext.err(err))   
}

function help(commands) {
  if (commands.length < 4) {
    helptext.start(commands)
    .then(helptext.intro)
    .then(helptext.commands)
    .catch(err => helptext.err(err))
  } else {
    helptext.start(commands)
    .then( () => {
        if ( commands.includes('backup') ) {
          helptext.start()
          .then(helptext.backup)
        }
        if ( commands.includes('config') || commands.includes('setup') ) {
          helptext.start()
          .then(helptext.config)
        }
        if ( commands.includes('flags') ) {
          helptext.start()
          .then(helptext.flags)
          .then(helptext.flagBackup)
          .then(helptext.flagNoImage)
          .then(helptext.flagNoDelete)
          .then(helptext.flagOutput)
        }
        if ( commands.includes('process') ) {
          helptext.start()
          .then(helptext.process)
        }
        if ( commands.includes('publish') ) {
          helptext.start()
          .then(helptext.publish)
        }
        if ( commands.includes('test') ) {
          helptext.start()
          .then(helptext.test)
        }
        if ( commands.includes('write') ) {
          helptext.start()
          .then(helptext.write)
        }
      })
      .catch(err => helptext.err(err))
    }
//  .then(helptext.help)
}

// let user know how to get help if they type a non-existent command
function hint(command) {
  console.log(`\nwritenow ${chalk.white.bgRed(command)} is not a valid command.\n\nTry ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('help')} for valid options.\n`)
}

function process(commands) {
  checkConfig(commands)
  .then(prepub)
  .catch(err => helptext.err(err))
}

// publish drafts by running rsync from output directory to remote server
function publish(commands) {
  checkConfig(commands)
  .then(gzip)
  .then(pub.sync)
  .then(pub.complete)
  .catch(err => helptext.err(err))
}

// stand up a temporary server to run your website on localhost to simulate what it will look like after publishing - essentially a 'preview' function.
function test(commands) {
  checkConfig(commands)
  .then(local.startServer)
  .catch(err => helptext.err(err))
}

// create a markdown file with post metadata in the front matter
function write(commands) {
  checkConfig(commands)
  .then( (commands) => inquirer.prompt(wc.questions))
  .then(answers => wc.prepareForImageCall(answers, commands) )
  .then(wc.getRandomImage)
  .then(wc.createFile)
  .then(wc.appendImage)
  .then(wc.openFile)
  .catch(err => helptext.err(err))
}

// exports
module.exports = {
  backup: backup,
  config: config,
  help: help,
  hint: hint,
  process: process,
  publish: publish,
  test: test,
  write: write
}