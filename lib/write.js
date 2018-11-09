const fs = require('fs');
const expandTilde = require('expand-tilde');
const request = require('request-promise-native');
const chalk = require('chalk');
const { exec } = require('child_process');
// require local files
const hasFlag = require('./flags')

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
  // lowercase title and subtitle, strip numbers and punctuation, and make an array of all the words that are left
  // We use this array to choose a search term for Unsplash
  let cleanTitle = answers.title.replace(/[^A-Za-z\s]/g, '').replace(/\s+/g, ' ');
  let cleanSubtitle = answers.subtitle.replace(/[^A-Za-z\s]/g, '').replace(/\s+/g, ' '); 
  let title = answers.subtitle ? cleanTitle.toLowerCase().split(' ').concat(cleanSubtitle.toLowerCase().split(' ')) : cleanTitle.toLowerCase().split(' ');
  return {noImage: noImage, title: title, answers: answers}
}

// get a random image from Unsplash either using a keyword from the title
// or if that fails, any random image using their API
function getRandomImage(params) {
  if (!params.noImage) {
    // filter out stopwords
    let stopwords = ['a', 'an', 'and', 'be', 'did','do','does', 'done','i', 'if', 'in', 'is', "isnt", 'it', 'its', 'not', 'on', 'only', 'the', 'their', 'then', 'there', 'theres', 'they', 'theyre', 'to', 'when', 'where', 'with'];
    let clean = params.title.filter(word => {
      return stopwords.every((stopword) => {
        return stopword !== word
      })
    })

    // choose a random word from the new clean array
    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }
    let x = getRandomInt(clean.length);

    // search Unsplash
    console.log(`Finding image for '${clean[x]}'...`)
    return request.get({uri: `https://api.unsplash.com/photos/random`, qs: {client_id: process.env.CLIENT_ID, query: clean[x]}, json: true})
      .then(pic => {
          let description = pic.description;
          let photo = pic.urls.small;
          params.image = {};
          params.image.photo = photo;
          params.image.description = description;
          return params
      })
      .catch( err => {
        if (err.message === `404 - {"errors":["No photos found."]}`) {
          console.log(`Couldn't find image for '${clean[x]}', retrieving random image...`)
          return request.get({uri: 'https://api.unsplash.com/photos/random', qs: {client_id: process.env.CLIENT_ID}, json: true})
          .then(newpic => {
            let description = newpic.description;
            let photo = newpic.urls.small;
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