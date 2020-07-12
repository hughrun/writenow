// require nodejs modules
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function backup(commands) {
  // require flag file
  const flags = require('./flags')(commands)

  // we check if a backup is needed before publishing so this needs to be a Promise
  return new Promise( (resolve, reject) => {
    // Check if a backups directory exists in the directory where writenow is installed.
    fs.access(`${path.resolve(__dirname, '..')}/backups`, fs.constants.F_OK, (err) => {
      // if it doesn't exist, make a subdirectory for backups
      if (err) {
        console.log('creating backups directory...')
        execSync(`mkdir -p ${path.resolve(__dirname, '..')}/backups`)
        resolve(commands)
      } else {
        resolve(commands)
      }
    })
  })
  .then( (commands) => {
    if (!process.env.OUTPUT_DIR) {
      reject({
        name: 'No Output Directory',
        code: 'BADOUTPUTDIR'
      })
    }
    if (commands[2] === 'backup' || flags.backup == true) {
      // make filename from date and time
      let now = new Date();
      // default is to back up the INPUT directory
      let filename = `${now.getUTCFullYear()}${now.getUTCDate()}${now.getUTCMonth()}${now.getUTCHours()}${now.getUTCMinutes()}${now.getUTCSeconds()}`
      // save gzipped tarball to the backups directory
      let command = flags.output ? `tar -czf ${path.resolve(__dirname, '..')}/backups/${filename}-output.tar.gz -C ${process.env.OUTPUT_DIR} .`
      : `tar -czf ${path.resolve(__dirname, '..')}/backups/${filename}-input.tar.gz -C ${process.env.INPUT_DIR} .`
      
      execSync(command)
      console.log(`backup written to ${path.resolve(__dirname, '..')}/backups`)
  }
  return commands
})
.catch(err => {
  console.error('There was an error when backing up your site.')
  console.error(`===========`)
  console.error(err)
})
}

// only export one function
module.exports = backup;