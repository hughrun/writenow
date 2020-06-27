#!/usr/bin/env node

/* #####################################################################
    writenow
    Version 1.0.0
    A CLI app to make your static-site publishing life easier 

    Copyright (c) 2018 Hugh Rundle

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

// require nodejs components
const path = require('path');

// require dotenv and pull environment variables from writenow.env
// if it exists
require('dotenv').config({path: path.resolve(process.cwd(), 'writenow.env')});

const cmds = require('./lib/commands');

if (process.argv[2] === 'write') {
  cmds.write(process.argv)
} else if (process.argv[2] === 'backup') {
  cmds.backup(process.argv)  
} else if (process.argv[2] === 'config' || process.argv[2] === 'setup') {
  cmds.config()  
} else if (process.argv[2] === 'publish') {
  cmds.publish(process.argv)
} else if (process.argv[2] === 'test') {
  cmds.test()    
} else if (process.argv[2] === 'help') {
  cmds.help(process.argv)
} else {
  cmds.hint(process.argv[2])
}