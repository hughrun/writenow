// from library
const { exec } = require('child_process');
const fs = require('fs');

// modules
const axios = require('axios').default;
const expandTilde = require('expand-tilde');
const WordPOS = require('wordpos'),
      wordpos = new WordPOS();

// local files
const hasFlag = require('./flags')

// function to choose a random word from the new clean array
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// set questions for inquirer interface
const questions = [
  {
    name: 'type',
    message: 'Post or Page?',
    type: 'list',
    choices: ['post', 'page'],
    default: 'post'
  },
  {
    name: 'title',
    message: 'Title:',
    validate: function( value ) {
      if (value.length) {
        return true;
      } else {
        return 'Title is compulsory';
      }
    } 
  },
  {
    name: 'subtitle',
    message: 'Subtitle:'
  },
  {
    name: 'author',
    message: 'Author:',
    default: process.env.AUTHOR
  },
  {
    name: 'tags',
    message: 'Tags (no need for \'post\'):',
    default: process.env.TAG,
    filter: function(tags) {
      let array = tags.split(','); // create an array by splitting the string at each comma
      return array.map(x => `'${x.trim()}'`); // remove whitespace and create safe strings by surrounding each tag with quotes
    }
  },
  {
    name: 'summary',
    message: 'Summary:'
  }
]

// fire up the question interface with the questions
function prepareForImageCall(answers, commands) {
  // check for the -i flag or the absence of an Unsplash API Client ID in .env
  const noImage = hasFlag(commands).image ? true : (process.env.CLIENT_ID == '' || !process.env.CLIENT_ID) ? true : false
  // concat title and subtitle
  return {noImage: noImage, text: answers.title + " " + answers.subtitle, answers: answers}
}
function getRandomImage(params) {
  if (!params.noImage) {
    // use wordPOS and random to select a random noun or verb from the full title
    let text = params.text
    return wordpos.getPOS(text)
    .then( pos => {
      let options = [...new Set( pos.nouns.concat(pos.verbs) )]
      let x = getRandomInt(options.length)
      console.log(`Finding image for ${options[x]}...`)
      return axios.get(`https://api.unsplash.com/photos/random`, {
        params: {
          client_id: process.env.CLIENT_ID, 
          query: options[x]
        }
      })
      .then(pic => {
          let description = pic.data.description;
          let photo = pic.data.urls.small;
          params.image = {};
          params.image.photo = photo;
          params.image.description = description;
          return params
      })
      .catch( err => {
        if (err.message === `404 - {"errors":["No photos found."]}`) {
          console.log(`Couldn't find image for '${clean[x]}', retrieving random image...`)
          return axios.get('https://api.unsplash.com/photos/random', {
            params: {
              client_id: process.env.CLIENT_ID
            }
          })
          .then(newpic => {
            let description = newpic.data.description;
            let photo = newpic.data.urls.small;
            params.image = {};
            params.image.photo = photo;
            params.image.description = description;          
            return params
          })
        } else {
          throw {
            name: 'Unsplash Error',
            code: 'UNSPLASH'
          }
        }
      })
    })
  } else {
    return params
  }
}

// save parameters to a file
function createFile (params) {
  params.answers.tags.push(`'${params.answers.type}'`) // add the tag 'post' or 'page'
  let slug = params.answers.title.toLowerCase().replace(/[^A-Za-z0-9\s]/g, '').replace(/\s*\s/g, '-').replace(/-$/, ''); //slugify the title
  let filename = expandTilde(`${process.env.INPUT_DIR}${slug}.md`)
  //write the file 
  fs.writeFileSync(filename, 
    `---\nlayout: ${params.answers.type}\ntitle: ${params.answers.title}\nsubtitle: ${params.answers.subtitle}\nauthor: ${params.answers.author}\ntags: [${params.answers.tags}]\nsummary: ${params.answers.summary}`)
    params.filename = filename;
    return params
}

function appendImage (params) {
  if (params.image) {
    fs.appendFileSync(params.filename, 
      `\nimage:\n  photo: ${params.image.photo}\n  description: ${params.image.description}\n\n---`)
  } else {
    fs.appendFileSync(params.filename, 
      `\n\n---`)
  }
  return params.filename
}

function openFile(filename) {
  // open the markdown file in the default application
  exec(`open ${filename}`, (err) => {
    if (err) {
      throw {
        name:'Error saving file',
        code: 'ENOENT'
      }
    } });
  // exit rather than leaving the session hanging.
  process.exit(0);   
}

module.exports = {
  questions: questions,
  prepareForImageCall: prepareForImageCall,
  getRandomImage: getRandomImage,
  createFile: createFile,
  appendImage: appendImage,
  openFile: openFile
}