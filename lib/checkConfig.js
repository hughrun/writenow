// require nodejs modules
const fs = require('fs');
const path = require('path');

function check (commands) {
  return new Promise( (resolve, reject) => {
    // TODO: change this path to /usr/local/writenow
    fs.access(`${path.resolve(__dirname, '..')}/writenow.env`, fs.constants.F_OK, (err) => {
      if (err) {
        reject({code: 'NO_CONFIG'})
      } else {
        resolve(commands)
      }
    })
  })
}

module.exports = check