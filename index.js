const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const availableItems = [
  {
    user: "N. Maier",
    location: {
      lat: 52.4923924,
      lng: 13.373914
    },
    offer: "Toiletten Papier",
    tradeFor: "Nudeln"
  },
  {
    user: "H. Müller",
    location: {
      lat: 52.5157723,
      lng: 13.3869281
    },
    offer: "Nudeln",
    tradeFor: "Toiletten Papier"
  },
  {
    user: "A. Schmidt",
    location: {
      lat: 52.5670062,
      lng: 13.3936488
    },
    offer: "Dosenwurst",
    tradeFor: "Mineralwasser"
  },
  {
    user: "B. Brand",
    location: {
      lat: 52.4753942,
      lng: 13.3997043
    },
    offer: "Mineralwasser",
    tradeFor: "Dosenwurst"
  }
];

function byLocation(entry, topLeftLocation, lowerRightLocation) {
  lat = entry.location.lat;
  lng = entry.location.lng;
  if (topLeftLocation.lat <= lat && lat <= lowerRightLocation.lat){
    if (topLeftLocation.lng <= lng && lng <= lowerRightLocation.lng){
      return true;
    }
  }
  return false;
}

function searchItems(req, res) {
  tlSplit = req.query.topLeftLocation.split(",");
  lrSplit = req.query.lowerRightLocation.split(",");

  topLeftLocation = {
    lat:tlSplit[0],
    lng:tlSplit[1]
  };
  lowerRightLocation = {
    lat:lrSplit[0],
    lng:lrSplit[1]
  };
  sortedItems = availableItems.filter(e => byLocation(e, topLeftLocation, lowerRightLocation));
  res.end(JSON.stringify(sortedItems));
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/api/search', searchItems)
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
