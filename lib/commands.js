/* #####################################################################
    writenow
    Version 1.1.0
    A CLI app to make your static-site publishing life easier 

    Copyright (c) 2018, 2020 Hugh Rundle

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    You can contact Hugh on Twitter @hughrundle
    or email hugh [at] hughrundle [dot] net
 ##################################################################### */

// require npm packages
const chalk = require('chalk');
const inquirer = require('inquirer');
// require local files
const helptext = require('./help');
const checkConfig = require('./checkConfig')
const local = require('./local');
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

// help page (man, but ...not)
// TODO: use these functions so you can do `help THING` e.g. `writenow help publish`
function help(commands) {
  helptext.start(commands)
  .then(helptext.intro)
  .then(helptext.newline)
  .then(helptext.commands)
  .then(helptext.help)
  .then(helptext.config)
  .then(helptext.write)
  .then(helptext.backup)
  .then(helptext.publish)
  .then(helptext.flags)
  .then(helptext.flagBackup)
  .then(helptext.flagNoImage)
  .then(helptext.flagNoDelete)
  .then(helptext.flagOutput)
  .catch(err => helptext.err(err))
}

// let user know how to get help if they type a non-existent command
function hint(command) {
  console.log(`\nwritenow ${chalk.white.bgRed(command)} is not a valid command.\n\nTry ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('help')} for valid options.\n`)
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
  publish: publish,
  test: test,
  write: write
}