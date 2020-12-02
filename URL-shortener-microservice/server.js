require('dotenv').config();
import { nanoid } from 'nanoid';
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const Url = require('./models/url');
const mongoose = require('mongoose');
const db = mongoose.connection;

// Basic Configuration
const port = process.env.PORT || 3000;

// mongoDB and mongoose connection
mongoose.connect('mongodb://localhost:27017/url_shortener');
db.on('error', function(err) {
  console.log('Error : ', err);
});
db.once('open', function() {
  console.log('Open Event');
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));



app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.route('/api/shorturl/new').post((req,res)=>{
  const inputUrl = req.body.url;

  if(validUrl.isUri(inputUrl)){   // <?> it doesn't work in right way when omitting http:// or https://
    console.log('Yes!');
    
    const shortUrl = nanoid(5);

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
        } else {
          res.json({original_url: data[0].url, short_url: data[0].short});
        }
      }
    })
  } else {
    res.send('Sorry, it seems like a wrong url format. Please enter valid url')
  }
})

app.route('/api/shorturl/:randomId').get((req,res) => {
  Url.findOne({short:req.params.randomId}, (err, data) => {
    if(err){
      console.log(err);
    } else {
      if(data) {
        res.redirect(data.url);
      } else {
        res.json({error: "This url is not on the database."});
      }
    }
  })
})






app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
