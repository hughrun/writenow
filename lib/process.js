// process 
// process markdown files prior to publishing to server

const { execSync } = require('child_process');

// local files
const hasFlag = require('./flags')

function process(commands) {
  return new Promise( (resolve, reject) => {
    try {
      resolve(execSync(`cd ${process.env.INPUT_DIR} && ${process.env.PROCESS_COMMAND}`))
    } catch(e) {
      reject(e)
    }
  })
}