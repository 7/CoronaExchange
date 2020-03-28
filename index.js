const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const auth = require('./authentication')
var cors = require('cors')
const offeringsMockData = require('./offerings-berlin.json')
const mockdb = require('./mockdb')

const uuid = require('uuid/v4');

//Firebase Database initialization
var admin = require("firebase-admin");
var firebase=require('firebase');


const firebaseConfig = {     
  apiKey: "AIzaSyA8Cnt81CF00BWGof4H-jEr-n0GjDisfDQ",     
  authDomain: "coronaexchange-44512.firebaseapp.com",     
  databaseURL: "https://coronaexchange-44512.firebaseio.com/",     
  projectId: "coronaexchange-44512",     
  storageBucket: "coronaexchange-44512.appspot.com",     
  messagingSenderId: "468202509714",     
  appId: "1:468202509714:web:0605968eec17c13b1f9d4b"   };   // Initialize Firebase   firebase.initializeApp(firebaseConfig);

  firebase.initializeApp(firebaseConfig);

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coronaexchange-44512.firebaseio.com"
});

var fireData = firebase.database();

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
  jsonResponse(res, items);
}

function chatMessages(req, res) {
  me = req.authId;
  participant = req.params.participantId;
  chatMessages = db.chatMessagesBetweenUsers(me, participant);
  jsonResponse(res, chatMessages);
}

function jsonResponse(res, obj){
  res.setHeader('Content-Type', 'application/json; charset=utf-8');  
  res.end(JSON.stringify(obj));
}

function newMessage(req, res) {
  me = req.authId;
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
function saveOffering(req,res){
  let id=uuid();
  let newItem={
    userId:req.body.userId,
    offer:req.body.offer,
    tradeFor:req.body.tradeFor,
    location:req.body.location
  }
  fireData.ref('/trades').child(req.body.userId).set(newItem);
  jsonResponse(res, newItem);
  
}

express()
  .use(express.static(path.join(__dirname, 'public/dist')))
  .use(express.json())
  .use(cors())
  .get('/api/search', searchItems)
  .get('/api/chat/:participantId', auth.checkIfAuthenticated, chatMessages)
  .post('/api/chat/:participantId', auth.checkIfAuthenticated, newMessage)
  .post('/api/offerings/:participantId',/* auth.checkIfAuthenticated, */ saveOffering)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
