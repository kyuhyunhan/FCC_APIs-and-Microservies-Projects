const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');

require('dotenv').config()

const route = require('./routes/route');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/api/exercise', route);


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
