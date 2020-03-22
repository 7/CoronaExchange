const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const auth = require('./authentication')

const offeringsMockData = require('./offerings-berlin.json')
const mockdb = require('./mockdb')
var db = new mockdb.mockDb(offeringsMockData, mockdb.availableMessages)

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

  if (topLeftLocation.lat >= lowerRightLocation.lat || topLeftLocation.lng >= lowerRightLocation.lng) {
    res.status(400).send({
      message: 'Invalid location data. Top left corner coordinates are bigger than lower right corner coordinates.'
    });
    return
  }

  items = db.itemsByLocation(topLeftLocation, lowerRightLocation);
  res.end(JSON.stringify(items));
}

function chatMessages(req, res) {
  me = "KhxRmzKFILT8ziEwDhPJZd65lnq1"; // gandalf
  participant = req.params.participantId;
  chatMessages = db.chatMessagesBetweenUsers(me, participant);
  res.end(JSON.stringify(chatMessages));
}

// chat id aus hash beider namen

function newMessage(req, res) {
  me = "KhxRmzKFILT8ziEwDhPJZd65lnq1"; // gandalf
  participant = req.params.participantId;
  message = {
    from: me,
    to: participant,
    date: new Date(),
    message: req.body.message
  };

  db.availableMessages.push(message)
  res.sendStatus(200);
}

express()
  .use(express.static(path.join(__dirname, 'public/dist')))
  .use(express.json())
  .get('/api/search', searchItems)
  .get('/api/chat/:participantId', chatMessages) // auth.checkIfAuthenticated
  .post('/api/chat/:participantId', newMessage) // auth.checkIfAuthenticated
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
