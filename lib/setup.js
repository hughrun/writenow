// require nodejs modules
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
// require npm packages
const chalk = require('chalk');
const expandTilde = require('expand-tilde');

// pull environment variables from ~writenow/writenow.env
require('dotenv').config({path: `${path.resolve(__dirname, '..', 'writenow.env')}`});

// function to check 

const questions = [
  {
    name: 'AUTHOR',
    message: 'Default Author',
    default: () => {
      if (process.env.AUTHOR) {
        return process.env.AUTHOR
      } else {
        return null
        }
      } 
  },
  {
    name: 'TAG',
    message: 'Default tag',
    default: () => {
      if (process.env.TAG) {
      return process.env.TAG
    } else {
      return null
      }
    }     
  },    
  {
    name: 'CLIENT_ID',
    message: 'Unsplash API Access Key',
    default: () => {
      if (process.env.CLIENT_ID) {
      return process.env.CLIENT_ID
    } else {
      return null
      }
    }    
  },
  {
    name: 'INPUT_DIR',
    message: 'Where do you want your drafts to be saved?',
    default: () => {
      if (process.env.INPUT_DIR) {
      return process.env.INPUT_DIR
    } else {
      return '~/eleventy/'
      }
    },
    validate: function( value ) {
      if (value.length) {
        return true;
      } else {
        return 'Input Directory is required';
      }
    }       
  },      
  {
    name: 'OUTPUT_DIR',
    message: 'Output path:',
    default: () => {
      if (process.env.OUTPUT_DIR) {
      return process.env.OUTPUT_DIR
    } else {
      return '~/eleventy/_site/'
      }
    },
    validate: function( value ) {
      if (value.length) {
        return true;
      } else {
        return 'Output Directory is required';
      }
    }     
  },
  {
    name: 'REMOTE_SERVER',
    message: 'Remote server address or name',
    default: () => {
      if (process.env.REMOTE_SERVER) {
      return process.env.REMOTE_SERVER
    } else {
      return 'blog'
      }
    }
  },           
  {
    name: 'REMOTE_DIR',
    message: 'Remote path:',
    default: () => {
      if (process.env.REMOTE_DIR) {
      return process.env.REMOTE_DIR
    } else {
      return '/var/www/html'
      }
    }
  }   
]

function checkRsync(answers) {
  // 'answers' comes in here ok

  return new Promise( (resolve, reject) => {
    // check for rsync
    let rsyncCheck = exec(`which rsync`, (err, stdout, stderr) => {
      if (stdout) {
        console.log('rsync installed ✅')
      } else {
        console.log('rsync not installed ❌')
        console.log(`${chalk.bgBlack.red('rsync must be installed if you want to use')} ${chalk.bgBlack.white.underline('writenow ')}${chalk.bgBlack.cyan.underline('publish')}.`)
      }
    });
    rsyncCheck.on('close', () => {
      resolve(answers)
    })
  })
}

function checkSSH(answers) {
  return new Promise( (resolve, reject) => {
    // check for ssh
    let sshCheck = exec(`which ssh`, (err, stdout, stderr) => {
      if (stdout) {
        console.log('ssh installed ✅')
      } else {
        console.log('ssh not installed ❌')
        console.log(`${chalk.bgBlack.red('ssh must be installed if you want to use')} ${chalk.bgBlack.white.underline('writenow ')}${chalk.bgBlack.cyan.underline('publish')}.`)
      }
      // check user has an ssh key
      let rsa = expandTilde('~/.ssh/id_rsa');
      fs.access(rsa, fs.constants.F_OK, (err) => {
        if (err) {
          console.log('ssh ID not set up ❌')
          console.log(`${chalk.bgBlack.red('ssh must be set up if you want to use')} ${chalk.bgBlack.white.underline('writenow ')}${chalk.bgBlack.cyan.underline('publish')}.`)
          console.log(`${chalk.bgBlack.red(`run ${chalk.bgBlack.cyan("man ssh-keygen")} for help setting up an ssh key`)}`)
        } else {
          console.log('~/.ssh/id_rsa exists ✅')
        }
      })
      //return answers
    });
    sshCheck.on('close', () => {
      resolve(answers)
    })
  })
}

function saveConfig(answers) {
  // add a trailing slash if there isn't one in LOCAL file paths, otherwise bad things happen
  answers.INPUT_DIR = answers.INPUT_DIR.endsWith('/') ? answers.INPUT_DIR : answers.INPUT_DIR + '/';
  answers.OUTPUT_DIR = answers.OUTPUT_DIR.endsWith('/') ? answers.OUTPUT_DIR : answers.OUTPUT_DIR + '/';
  // remove trailing slash if there is one in REMOTE path
  // this is because rsync will create a subdirectory if it ends in a slash
  answers.REMOTE_DIR = answers.REMOTE_DIR.endsWith('/') ? answers.REMOTE_DIR.slice(0, -1) : answers.REMOTE_DIR;      
  let env = '';
  for (key in answers) {
    env += (`${key}=${answers[key]}\n`)
  }
  // write the env to directory above __path
  return fs.writeFile(`${path.resolve(__dirname, '..', 'writenow.env')}`, env, (err) => {
    if (err) throw err;
    console.log(`Parameters saved - you're ready to write! Use ${chalk.white("writenow")} ${chalk.cyan("write")} to get started.`)
  })
}

module.exports = {
  questions: questions,
  checkRsync: checkRsync,
  checkSSH: checkSSH,
  saveConfig: saveConfig
}