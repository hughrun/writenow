const chalk = require('chalk');

// HELP

function showHelp() {
  return new Promise( (resolve, reject) => {
    resolve(console.log());
  })
}

function intro() {
  return console.log(`
    ${chalk.cyan('************')}
    ${chalk.cyan('* WRITENOW *')}
    ${chalk.cyan('************')}

    writenow is a utility to help you to create frontmatter for static site pages,
    test your posts locally, process, and deploy them to a remote server.

USAGE

    ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('COMMAND')} ${chalk.yellow('[--FLAG]')} ${chalk.yellow('[-flag]')}`
  )
}

function commands() {
  return console.log(`
For help on a command, use ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('help')} ${chalk.yellow('[command]')}:

    ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('help')} ${chalk.yellow('help')}

    ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('help')} ${chalk.yellow('backup')}
    ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('help')} ${chalk.yellow('config')}
    ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('help')} ${chalk.yellow('flags')}
    ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('help')} ${chalk.yellow('process')}
    ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('help')} ${chalk.yellow('publish')}
    ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('help')} ${chalk.yellow('setup')}
    ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('help')} ${chalk.yellow('test')}
    ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('help')} ${chalk.yellow('write')}

`)
}

function backup() {
  return console.log(
`   ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('backup')}

    Creates a ${chalk.bgBlack.whiteBright('gzip')} archive of your specified INPUT directory. If you use the ${chalk.bgBlack.yellow('-o')} flag it will 
    back up the OUTPUT directory instead.
`
    )  
}

function config() {
  return console.log(
`   ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('config')}
   ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('setup')} (alias)

    Guides you through setting up your writenow settings like tag and author defaults, 
    Unsplash API key, and remote server details. You can also use this command to update 
    your settings: simply hit [Enter] to leave an existing setting unchanged. The config
    is saved in your home path in a 'writenow' directory. e.g ${chalk.whiteBright.bgMagenta('/Users/erika/writenow/')}

    For file paths you must use the full path or use ~ to indicate the current user's path. 
    e.g. for user Erika publishing with Eleventy, the following paths are equivalent:

    ${chalk.whiteBright.bgMagenta('~/eleventy/_output/')}
    ${chalk.whiteBright.bgMagenta('/Users/erika/eleventy/_output/')}

    ${chalk.underline('You should not use relative paths')}. e.g. This will not work if you run writenow from a
    directory different to where you installed writenow: ${chalk.whiteBright.bgMagenta('_output/')}

    You should use a trailing slash for the local directories and ${chalk.underline('not')} use a trailing slash 
    for the remote directory - but writenow will correct this for you if you get it wrong.

    ${chalk.green('Unsplash API key')} - this is the 'Client ID' from your Unsplash account. If you don't have 
    one, leave it blank and writenow won't attempt to set an image for you.

    ${chalk.green('Where do you want your drafts to be saved?')} - this could be a drafts folder, or if you're 
    feeling lucky it could be the directory that is processed by your static site generator. 
    i.e. this is where your Markdown files are saved.

    ${chalk.green('Command to process files for publication')} - this is the command you use to process your markdown files into posts 
    and pages. e.g. ${chalk.whiteBright.bgMagenta('eleventy --quiet')} or ${chalk.whiteBright.bgMagenta('jekyll build')}

    ${chalk.green('Output path')} - this is the directory where your processed files go. i.e. there should be an
    ${chalk.whiteBright.bgBlackBright('index.html')} file in this directory that will be your homepage.

    ${chalk.green('Remote server address or name')} - this should be an IP address or a name from your ssh config file.

    ${chalk.green('Remote path')} - this is the path on your remote server that your webserver serves files 
    from. On Linux it will usually be /var/www/SOMETHING. Note that this should be the 
    directory where the ${chalk.underline('root')} of your website will be. e.g. if your site root is ${chalk.whiteBright.bgMagenta('/var/www/html')} 
    your output path should also be ${chalk.whiteBright.bgMagenta('/var/www/html')}. writenow will remove any trailing slashes.
`
    )  
}

function help() {
  return console.log(
`   ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('help')}

    Displays the help page.
`
    )
}

function process() {
  return console.log(
    `   ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('process')}

    Processes files in your INPUT_DIRECTORY using your SSG
    command (PROCESS_COMMAND). You can run 'writenow process'
    from any directory.
`
  )
}

function publish() {
  return console.log(
`   ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('publish')}

    Syncs your local output directory with your remote directory. i.e. this 'publishes' 
    any posts that you have generated on your local machine but not yet deployed to your 
    webserver, and updates/transfers any other files that have been changed or added like 
    images, RSS files or CSS.

    By default this will remove any files and directories from the remote server if they
    are no longer in the local output directory.
`
    )  
}

// test
function test() {
  return console.log(
`   ${chalk.bgBlack.whiteBright("writenow")} ${chalk.cyan("test")}

    Spins up a local webserver so you can see what your new post will look like 
    before you publish it. This will open ${chalk.bgBlackBright.whiteBright("index.html")} from your OUTPUT directory
    in your default browser. ${chalk.green("Press Ctrl + c")} to kill it when you've finished testing, 
    or you could just leave it running and open a new Terminal window to keep 
    using more commands.
`
  )
}
function write() {
  return console.log(
`   ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('write')}

    Launches the frontmatter creator. This will step you through each key/value for your
    frontmatter, then open it in the default application for markdown (.md) files.

    You can now write up your blog post, save it, and run ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('process')} followed by 
    ${chalk.bgBlack.whiteBright('writenow')} ${chalk.cyan('publish')} to publish your latest masterpiece.
`
    )  
}

function flags() {
  return console.log(
`
FLAGS
`
    )  
}

function flagBackup() {
  return console.log(
`   ${chalk.bgBlack.yellow('--backup | -b')}

    Using the ${chalk.bgBlack.yellow('--backup')} or ${chalk.bgBlack.yellow('-b')} flag after ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('publish')} will run a backup of your INPUT 
    directory before publishing.
`
    )  
}

function flagNoImage() {
  return console.log(
`   ${chalk.bgBlack.yellow('--no-image | -i')}

    Using the ${chalk.bgBlack.yellow('--no-image')} or ${chalk.bgBlack.yellow('-i')} flag after ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('write')} will skip image generation. You should 
    only need to use this flag if you have assigned an API key with ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('config')} but 
    do not want to use it for a particular post. If you have not set an API key (CLIENT_ID)
    the ${chalk.bgBlack.yellow('--no-image')} flag is assumed.
`
    )  
}

function flagNoDelete() {
  return console.log(
`   ${chalk.bgBlack.yellow('--no-delete | -k')}

    Using the ${chalk.bgBlack.yellow('--no-delete')} or ${chalk.bgBlack.yellow('-k')} flag after ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('publish')} will remove the rsync ${chalk.bgBlack.gray('--del')} flag. 
    This means any 'orphaned' directories and files that are on your remote server but not 
    your local output directory will be preserved on the server rather than deleted.
`
    )  
}

function flagOutput() {
  return console.log(
`   ${chalk.bgBlack.yellow('--output | -o')}

    Using the ${chalk.bgBlack.yellow('--output')} or ${chalk.bgBlack.yellow('-o')} flag after ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('backup')} or ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('publish')} ${chalk.bgBlack.yellow('--backup')} will back up the 
    OUTPUT directory instead of the INPUT directory.
`
    )  
}

// ERRORS

function err(error) {
  if (error) {
    let message = error.code == 'ENOENT' ? `
    There was an error saving your file. 😟 This probably means the input directory you set in 
    ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('config')} doesn't exist. Check ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('config')}, or if unsure, try ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('help')}
    `
    : error.code == 'UNSPLASH' ? `
    Unsplash error ☹️  ${chalk.whiteBright.bgRed('Is your Unsplash API key correct?')}
    Check ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('config')}, or if unsure, try ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('help')}
    `
    : error.code == 'BADHOST' ? `
     Whoops! 😲 It looks like your remote hostname is incorrect. Check ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('config')}, or if unsure, try ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('help')}
     `
    : error.code == "BADOUTPUTDIR" ? `
     😞 That command can't be run because you haven't set an Output Directory yet.
     Run ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('config')} to set it up.
     ` 
     : error.code == "NO_CONFIG" ? `
      😲 Looks like you haven't set up your config yet.
      ${chalk.bgBlack.white('writenow')} won't work properly without setting at least an 
      input directory and an output directory.
      Run ${chalk.bgBlack.white('writenow')} ${chalk.bgBlack.cyan('config')} to set it up.
     ` :
     `\n${error}\n`
    return console.error(message)
  } else {
    return console.error(error)
  }
}

module.exports = {
  start: showHelp,
  intro: intro,
  commands: commands,
  help: help,
  backup:backup,
  config: config,
  process: process,
  publish: publish,
  test: test,
  write: write,
  flags: flags,
  flagBackup: flagBackup,
  flagNoImage: flagNoImage,
  flagNoDelete: flagNoDelete,
  flagOutput: flagOutput,
  err: err
}