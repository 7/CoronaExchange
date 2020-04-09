const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const auth = require('./authentication')
var cors = require('cors')

const uuid = require('uuid/v4');
//Firebase Database initialization
var admin = require("firebase-admin");
var firebase=require('firebase');


const firebaseConfig = {     
  apiKey: process.env.API_KEY,     
  authDomain: process.env.AUTH_DOMAIN,     
  databaseURL: process.env.DATABASE_URL,     
  projectId: process.env.PROJECT_URL,       
  messagingSenderId: process.env.MESSAGING_SENDER_ID,     
  appId: process.env.APP_ID   };   // Initialize Firebase   firebase.initializeApp(firebaseConfig);

  firebase.initializeApp(firebaseConfig);

var fireData = firebase.database();

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
  let messages=(await fireData.ref('/messages').child(req.params.conversationId).once('value'));
  let returnMessages=[];
  messages.forEach(function(partner){
    tmp=partner.val();
    returnMessages.push(tmp);
  });
  for(let i=0; i<returnMessages.length;++i){
    returnMessages[i].traderName=await getUser(returnMessages[i].from);
  }
  return jsonResponse(res, returnMessages);
  /* me = req.authId;
  participant = req.params.participantId;
  chatMessages = db.chatMessagesBetweenUsers(me, participant);
  jsonResponse(res, chatMessages); */
}
String.prototype.hashCode = function() {
  var hash = 0;
  if (this.length == 0) {
      return hash;
  }
  for (var i = 0; i < this.length; i++) {
      var char = this.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
function jsonResponse(res, obj){
  res.setHeader('Content-Type', 'application/json; charset=utf-8');  
  res.end(JSON.stringify(obj));
}

function newMessage(req, res) {
  me = req.body.from;
  participant = req.body.to;
  message = {
    from: me,
    to: participant,
    date: req.body.dateSent,
    message: req.body.message,
    convId: req.body.convId
  };
  fireData.ref('/messages').child(req.body.convId).push(message);
  fireData.ref('/conversations').child(me).child(req.body.convId).update({lastMessage:Date.now()});
  fireData.ref('/conversations').child(participant).child(req.body.convId).update({lastMessage:Date.now()});
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
async function getNotification(req, res){
  let messages=(await fireData.ref('/messages').child(req.body.convId).once('value'));
  let returnMessages=[];
  messages.forEach(function(partner){
    tmp=partner.val();
    returnMessages.push(tmp);
  });
  if(returnMessages[returnMessages.length - 1].from != req.body.me){
    let username=await fireData.ref('/user').child(req.body.participantId).once('value');
    username=username.val().displayName;
    return jsonResponse(res, username);
  }else{
    return jsonResponse(res, false);
  }
  
}
async function getConversations(req, res){
  conversationPartners=await fireData.ref('/conversations').child(req.params.participantId).once('value');
  let returnPartners=[]
  conversationPartners.forEach(function(partner){
    tmp=partner.val();
    returnPartners.push(tmp);
  });
  for(let i=0; i<returnPartners.length;++i){
    console.log(returnPartners[i].tradeWith);
    returnPartners[i].traderName=await getUser(returnPartners[i].tradeWith);
  }
  return jsonResponse(res, returnPartners);
}
function newConversation(req,res){
  me = req.body.me;
  participant = req.body.tradeWith;
  convId = req.body.convId;
  let trade={
    offer: req.body.offer,
    tradeFor:req.body.tradeFor,
    tradeWith: req.body.tradeWith,
    tradeId:req.body.tradeId,
    convId:convId,
    lastMessage: Date.now()
  }
  fireData.ref('/conversations').child(me).child(convId).set(trade);
  trade.tradeWith=me;
  fireData.ref('/conversations').child(participant).child(convId).set(trade);
  res.sendStatus(200);
}

express()
  .use(express.static(path.join(__dirname, 'public/dist')))
  .use(express.json())
  .use(cors())
  .get('/api/search', searchItems)
  .get('/api/chat/:conversationId', /* auth.checkIfAuthenticated ,*/ chatMessages)
  .post('/api/chat', /* auth.checkIfAuthenticated ,*/ newMessage)
  .get('/api/conversations/:participantId', getConversations)
  .post('/api/conversations', newConversation)
  .post('/api/offerings/:participantId',/* auth.checkIfAuthenticated, */ saveOffering)
  .get('/api/trades/:participantId', getUserspecificTrades)
  .post('/api/deleteTrade/:participantId',deleteOffer)
  .post('/api/user',saveUser)
  .post('/api/notification/', getNotification)
  .listen(PORT, () => console.log("Listening on "+PORT));
