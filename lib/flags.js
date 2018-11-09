function check (commands) {
  // commands is an array
  // there shouldn't be any flags in places 0, 1 or 2
  // but if there are, it will have thrown an error already
  
  // find everything in commands that starts with a dash
  // we could have one or more flags combined or not
  // e.g -abc or -a -b -c
  // so we can't just assign true or false because it will over-write
  // if there is a second flag

  var backup, image, keep, output;

  for (let command of commands) {
    if ( command.startsWith('-') ) {
      // check for all the flags
      if (command.includes('b')) {
        backup = true;
      }
      if (command.includes('i')) {
        image = true;
      }
      if (command.includes('k')) {
        keep = true;
      }
      if (command.includes('o')) {
        output = true;
      }
    } 
  }
  // return an object with the values
  return {
    backup: backup,
    image: image,
    keep: keep,
    output: output
  } 
}

module.exports = check;