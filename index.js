const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const availableItems = [
  {
    location: 79104,
    offer: "Toilet Paper",
    tradeFor: "Noodles"
  },
  {
    location: 79111,
    offer: "Toilet Paper",
    tradeFor: "Noodles"
  }
];

function orderByLocation(a, b, zipcode) {
  relativeLocationA = Math.abs(a.location - zipcode)
  relativeLocationB = Math.abs(b.location - zipcode)
  return relativeLocationA >= relativeLocationB ? 1 : -1;
}

function searchItems(req, res) {
  zipcode = req.query.zipcode;
  sortedItems = availableItems.sort((a, b) => orderByLocation(a, b, zipcode))
  res.end(JSON.stringify(sortedItems))
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/api/search', searchItems)
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
