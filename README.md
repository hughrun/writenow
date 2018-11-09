# writenow
A command line utility to make static-site publishing easier.

**writenow** is a utility to help you to create [frontmatter](https://jekyllrb.com/docs/front-matter/) for [static site pages](https://davidwalsh.name/introduction-static-site-generators), test your posts locally, and deploy them to a remote server. It currently runs on MacOS only, but will be updated to run on most Linux and Windows soon(ish).

## Installation

Open Terminal and install from npm with `npm i writenow -g`.
Then run `writenow setup`.

Now you can use writenow from any directory.

## Features
* Easy-to-use question-and-answer interface helps you to build a Markdown template
* Set default values for your frontmatter
* [Unsplash](https://unsplash.com/) integration: writenow will use a random word from the title of your post to retrieve an image from Unsplash (requires an Unsplash API key). If there are no results from this search, it will retrieve a completely random image
* automatically add 'post' or 'page' as a tag and layout

## Requirements

writenow is a nodejs script and npm package. The easiest way to install it is using [npm](https://www.npmjs.com). writenow assumes you have the following software installed:

* [MacOS](https://en.wikipedia.org/wiki/MacOS)
* [nodejs](https://nodejs.org/en/)
* [npm](https://docs.npmjs.com/)
* [rsync](https://rsync.samba.org/)
* [ssh](https://en.wikipedia.org/wiki/Secure_Shell)

Luckily, if you have the first two, it's almost certain that you have the rest, unless you deliberately deleted something. writenow checks for rsync and ssh when you run `writenow setup` and will let you know if they're not installed.

To use `writenow publish` you will not only need ssh installed but will also need to have set up ssh access to your server. Digital Ocean has [a good tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-1804) explaining how to do this. There is also a helpful SSH guide [by GitHub](https://help.github.com/articles/about-ssh/).

You can also just use writenow to create markdown templates, without pushing anything to a remote server. In that case, you won't need to worry about ssh - just don't `writenow publish`.

## Usage

  **writenow _command_ [ _-flag_ ]**

### COMMANDS

#### writenow backup

  Creates a [gzip](https://www.gnu.org/software/gzip/) archive of your specified INPUT directory in a `backup` subdirectory where you installed writenow. If you use the `-o` flag it will back up the OUTPUT directory instead.

#### writenow setup / writenow config

  Guides you through setting up your writenow settings like tag and author defaults,  Unsplash API key, and remote server details. You can also use this command to change   your settings later: simply hit `[Enter]` to leave an existing setting unchanged. The config is saved in the directory where you saved writenow, with the filename `writenow.env`

  For file paths you must use the full path or use `~` to indicate the current user's path. e.g. for user Erika publishing with Eleventy, the following paths are equivalent and both valid:

  `~/eleventy/_output`
  
  `/Users/erika/eleventy/_output/`

  **Do not use relative paths**. e.g. This will not work if you run a writenow command from a directory different to where you installed writenow: 
  
  `_output/`

  Local directories will automatically be given a trailing slash, and remote directories will automatically have any trailing slashes removed. This ensures that rsync behaviour is as expected when you run `writenow publish` and `writenow backup`.

  ##### Unsplash API key
  The 'Client ID' from your Unsplash account. If you don't have one, leave it blank and writenow won't attempt to set an image for you.

  ##### Where do you want your drafts to be saved? (INPUT)
  This could be a drafts folder, but generally will be the directory that is processed by your static site generator. i.e. this is where your Markdown files are saved.

  ##### Output path (OUTPUT)
  The directory where your processed files go. i.e. there should be an `index.html` file in this directory that is your homepage.

  ##### Remote path
  The path on your remote server that your webserver serves files from. On a Linux server it will usually be `/var/www/html`. writenow will remove any trailing slashes so that rsync doesn't do anything surprising.

#### writenow help

  Displays the help page.

#### writenow publish

  Syncs your local output directory with your remote directory. i.e. this 'publishes' any posts that you have generated on your local machine but not yet deployed to your server, and updates/transfers any other files that have been changed or added like images, RSS files or CSS.

  By default this will remove any files and directories from the remote server if they are no longer in the local output directory (using the rsync `--del` flag). You can use the `-k` flag to keep these files on the server instead.

#### writenow test

  Spins up a local webserver so you can see what your new post will look like - before you publish it. This will open `index.html` from your OUTPUT directory in your default browser. Press `Ctrl + c` to kill it when you've finished testing, or you could just leave it running and open a new Terminal window to keep using more commands.

#### writenow write

  Launches the frontmatter creator. This will step you through each key/value for your frontmatter, then open it in the default application for markdown (`.md`) files (probably your default text editor).

  At this stage you can only use the defaults (title, subtitle, author, tags, description) but in a future release you should be able to set up your own template.

### FLAGS

Flags change the default behavour of a command. You can use more than one at the same time.

  #### -b

  Using the *backup* `-b` flag after `writenow publish` will run a backup of your INPUT directory before publishing.

  #### -i

  Using the *image* `-i` flag after `writenow write` will skip image generation. You should only need to use this flag if you have assigned an API key with `writenow config` but do not want to use it for a particular post. If you have not set an API key (CLIENT_ID) the `-i` flag is assumed.

  #### -k

  Using the *keep* `-k` flag after `writenow publish` will retain any 'orphaned' directories and files that are on your remote server but not your local output directory, instead of deleting them.

  #### -o

  Using the *output* or `-o` flag after `writenow backup` or with `writenow publish -b` will back up the OUTPUT directory instead of the INPUT directory.

## Examples

_Create a new markdown template without an image_

`writenow write -i`

_Publish a new file but run a backup of the markdown files in the INPUT directory first_

`writenow publish -b`

You can combine flags:

_Publish a new file but run a backup of the html, css etc in the OUTPUT directory first_

`writenow publish -bo`

_Back up the OUTPUT directory, publish any changes, and retain all files on server_

`writenow publish -bko`

## Roadmap

The following features are planned, though there's no specific timeline:

* Linux compatability
* Windows compatability
* create your own frontmatter templates
* use git instead of rsync to push to remote, for GitHub/GitLab Pages

## TODOs

I'll try to track these in 'Issues'.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

**LICENSE:** GPL 3+