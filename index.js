const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

function searchItems(req, res) {
  location = req.query.zipcode;
  response = {
    zipcode:location
  }
  res.end(JSON.stringify(response))
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/api/search', searchItems)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
