const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const auth = require('./authentication')

const mockdb = require('./mockdb')
var db = new mockdb.mockDb(mockdb.availableItems)

function searchItems(req, res) {
  tlSplit = req.query.topLeftLocation ?
    req.query.topLeftLocation.split(",")
    : [];
  lrSplit = req.query.lowerRightLocation ?
    req.query.lowerRightLocation.split(",")
    : [];

  if (tlSplit.length != 2 || lrSplit.length != 2) {
    res.status(400).send({
      message: 'Invalid location data. A valid request is of the form "/api/search?topLeftLocation=<latitude>,<longitude>&lowerRightLocation=<latitude>,<longitude>".'
    });
    return
  }

  topLeftLocation = {
    lat: tlSplit[0],
    lng: tlSplit[1]
  };
  lowerRightLocation = {
    lat: lrSplit[0],
    lng: lrSplit[1]
  };

  if (topLeftLocation.lat >= lowerRightLocation.lat || topLeftLocation.lng >= lowerRightLocation.lng){
    res.status(400).send({
      message: 'Invalid location data. Top left corner coordinates are bigger than lower right corner coordinates.'
    });
    return
  }

  items = db.itemsByLocation(topLeftLocation, lowerRightLocation);
  res.end(JSON.stringify(items));
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')  
  .get('/', (req, res) => res.render('pages/index'))
  .get('/api/search', auth.checkIfAuthenticated, searchItems)
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
