require('dotenv').config();
import { nanoid } from 'nanoid';
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const Url = require('./models/url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



// save the entered url in request body
// assign a random url(/api/shorturl/randomNumber) to the original url.
// when enter '../api/shorturl/randomNumber' in address bar, link to the original url.

// in other words, I need an API which create linking url automatically.
// And the API fetches data from somewhere has 'original url' and 'randomNumber' assigned.

app.route('/api/shorturl/new').post((req,res)=>{
  const local = req.headers.host;   // log 'localhost:3000'
  const inputUrl = req.body.url;

  if(validUrl.isUri(inputUrl)){   // <?> it doesn't work in right way when omitting http:// or https://
    console.log('Yes!')
    Url.find({url:inputUrl}, function(err, data) {
      if(err){
        console.err(err);
      } else {
        if (data.length == 0) {
          
          const urlObj = {url: inputUrl, short: nanoid(5)};
          Url.create(urlObj, function(err, newUrl) {
            if(err){
              console.err(err);
            } else {
              const originalUrl = newUrl.url;
              const shortUrl = newUrl.short;
              res.json({original_url: originalUrl, short_url: shortUrl});
            }
          })
        }
      }
    })
  } else {
    console.log('Sorry, it seems a wrong url format. Please enter valid url')
  }
})







app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
