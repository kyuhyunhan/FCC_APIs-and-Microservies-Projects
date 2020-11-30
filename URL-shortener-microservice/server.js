require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

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
})







app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
