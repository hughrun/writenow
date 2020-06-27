// require nodejs components
const { execSync } = require('child_process');
// require local files
const hasFlag = require('./flags')

// runs rsync in archive and compressed mode, deleting any remote files with no local match.
function sync(commands) {
  return new Promise( (resolve, reject) => {
    console.log('publishing...')
    // check for flag to retain old files on server
    let rsyncCommands = hasFlag(commands).keep ? '-az' : '-az --del';
    resolve(execSync(`rsync ${rsyncCommands} ${process.env.OUTPUT_DIR} ${process.env.REMOTE_SERVER}:${process.env.REMOTE_DIR}`, {stdio: 'inherit'}))
  })
}

function complete (val) {
  if (val) {
    console.log('val is ' + val)
  }
  console.log(`\n🎉 Your files have been published!\n`)
}

module.exports = {
  sync: sync,
  complete: complete
}