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

async function searchItems(req, res) {
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

  tradeItems=await fireData.ref('/trades').once('value');
  let returnItems=[];
  tradeItems.forEach(function(childSnapshot){
    childSnapshot.forEach(function(child){
      returnItems.push(child.val());
    })
  });
  return jsonResponse(res, returnItems);
}

async function chatMessages(req, res) {
  me=req.params.participantId;
  conversationPartners=await fireData.ref('/conversations').child(me).once('value');

  return jsonResponse(res, conversationPartners);
  /* me = req.authId;
  participant = req.params.participantId;
  chatMessages = db.chatMessagesBetweenUsers(me, participant);
  jsonResponse(res, chatMessages); */
}

function chatPartners(req,res){
  me=req.params.participantId;
}

function jsonResponse(res, obj){
  res.setHeader('Content-Type', 'application/json; charset=utf-8');  
  res.end(JSON.stringify(obj));
}

function newMessage(req, res) {
  me = req.body.userId;
  participant = req.body.participantId;
  message = {
    from: me,
    to: participant,
    date: new Date(),
    message: req.body.message,
    conversationId: me+"/"+participant
  };
  fireData.ref('/messages').child(me+"+"+participant).push(message);

  /* db.availableMessages.push(message)   */
  res.sendStatus(200);
}
async function getUserspecificTrades(req, res){
  let tradeItems;
  participant = req.params.participantId;
  tradeItems=await fireData.ref('/trades').child(participant).once('value');
  let returnItems=[];
  tradeItems.forEach(function(childSnapshot){
    returnItems.push(childSnapshot.val());
  });
  return jsonResponse(res, returnItems);
  
}
function saveOffering(req,res){
  let id=uuid();
  let newItem={
    tradeId:id,
    userId:req.body.userId,
    offer:req.body.offer,
    tradeFor:req.body.tradeFor,
    location:req.body.location,
    date: Date.now()
  }
  fireData.ref('/trades').child(newItem.userId).child(id).set(newItem);
  return jsonResponse(res, newItem);
  
}
function deleteOffer(req, res){
  fireData.ref('/trades').child(req.body.userId).child(req.body.tradeId).remove();
  return getUserspecificTrades(req, res);
}
function saveUser(req, res){
  fireData.ref('/user').child(req.body.uid).set(req.body);
  res.sendStatus(200);
}
async function getUser(uid){
  let username=await fireData.ref('/user').child(uid).once('value');
  username=username.val().displayName;
  return username;
}
async function getConversations(req, res){
  conversationPartners=await fireData.ref('/conversations').child(req.params.participantId).once('value');
  let returnPartners=[]
  conversationPartners.forEach(function(partner){
    tmp=partner.val();
    returnPartners.push(tmp);
  });
  for(let i=0; i<returnPartners.length;++i){
    returnPartners[0].tradeWith=await getUser(returnPartners[0].tradeWith);
  }
  return jsonResponse(res, returnPartners);
}
function newConversation(req,res){
  me = req.body.userId;
  trade={
    offer: req.body.offer,
    tradeFor:req.body.tradeFor,
    tradeWith: req.body.tradePartner,
    tradeId:req.body.tradeId
  }
  fireData.ref('/conversations').child(me).child("tradeConversationId").set(trade);
  res.sendStatus(200);
}

express()
  .use(express.static(path.join(__dirname, 'public/dist')))
  .use(express.json())
  .use(cors())
  .get('/api/search', searchItems)
  .get('/api/chat/:participantId', /* auth.checkIfAuthenticated ,*/ chatMessages)
  .post('/api/chat/:participantId', /* auth.checkIfAuthenticated ,*/ newMessage)
  .get('/api/conversations/:participantId', getConversations)
  .post('/api/conversations', newConversation)
  .post('/api/offerings/:participantId',/* auth.checkIfAuthenticated, */ saveOffering)
  .get('/api/trades/:participantId', getUserspecificTrades)
  .post('/api/deleteTrade/:participantId',deleteOffer)
  .post('/api/user',saveUser)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
