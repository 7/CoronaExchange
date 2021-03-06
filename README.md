# CoronaExchange

This app allows people to find items they need urgently (and cannot buy, as they are currently sold out) and trade for them with items they have too much of.

## Setup

To setup and run a local instance execute the following commands:

```bash
$ npm install
$ cd public
$ npm install
$ cd ..
$ npm start
```

## Use cases

### Trade items

A simple example:

Mr. Brown freaked out, when he heard of the outbreak of a new disease. He ran to the store and bought tons of toilet paper. But in his urgency he forgot to buy noodles.

Mrs. Green meanwhile could not get any toilet paper, but bought a bunch of noodle packs. She calls up the CoronaExchange app and adds noodles to her stock, stating that she's willing to trade for toilet paper.

Mr. Brown opens up his app and can quickly check that someone close to him (Mrs. Green) is offering noodles for toilet paper. He clicks the trade offer and negotiates a meeting, where they can safely exchange a set amount of their items.

### Lookup stock exchange values for toilet paper

If you are wondering what amount of toilet paper usually trades for a pack of noodles, you can quickly check with a look at the current CoronaExchange Stock Market.

## Backend API

### GET /api/search

#### Example Request:

```
http://localhost:5000/api/search?topLeftLocation=52.5,13&lowerRightLocation=54,14
```

#### Example Response:

```json
[
    {
        "user": "Wolverine",
        "location": {
            "lat": 52.5157723,
            "lng": 13.3869281
        },
        "offer": "Nudeln",
        "tradeFor": "Toiletten Papier"
    },
    {
        "user": "Gandalf",
        "location": {
            "lat": 52.5670062,
            "lng": 13.3936488
        },
        "offer": "Dosenwurst",
        "tradeFor": "Mineralwasser"
    }
]
```

### GET /api/chat/:participantId

This requires a valid authentication token from Firebase. The user id is determined from the token.

#### Example Request:

```
http://localhost:5000/api/chat/KhxRmzKFILT8ziEwDhPJZd65lnq1
```

#### Example Response:

```json
[
    {
        "from": "KhxRmzKFILT8ziEwDhPJZd65lnq1",
        "to": "sJoqxWyKobTJZp3LAEoZlcyccKg1",
        "date": "2020-03-20T12:22:38 -00:00",
        "text": "Hi Walter. Ich interessiere mich für dein Mineralwasser. Ich hätte Dosenwurst im Austausch."
    },
    {
        "from": "sJoqxWyKobTJZp3LAEoZlcyccKg1",
        "to": "KhxRmzKFILT8ziEwDhPJZd65lnq1",
        "date": "2020-03-20T14:12:32 -00:00",
        "text": "Gerne. Wann können wir die Waren austauschen?"
    },
    {
        "from": "KhxRmzKFILT8ziEwDhPJZd65lnq1",
        "to": "sJoqxWyKobTJZp3LAEoZlcyccKg1",
        "date": "2020-03-20T14:13:23 -00:00",
        "text": "In 10 min beim Kiosk an der Ecke."
    },
    {
        "from": "sJoqxWyKobTJZp3LAEoZlcyccKg1",
        "to": "KhxRmzKFILT8ziEwDhPJZd65lnq1",
        "date": "2020-03-20T14:15:00 -00:00",
        "text": "Ok. Bis gleich."
    }
]
```

### POST /api/chat/:participantId

This requires a valid authentication token from Firebase. The user id is determined from the token.

#### Example Request body:

```json
{
    "message":"Hello!"
}
```

#### Response

If the message was posted successfully, the endpoint will return `200 OK`.

## Technology Decisions

### Vue.js for frontend

This is where we have the most frontend knowledge currently.

### Node.js for backend

Node.js is easy to setup and learn. Additionally it allows frontend developers with a little Javascript knowledge to help out with backend development.

### Heroku for deployment

Free to use. The following is an excerpt from the Heroku example project `getting-started-with-nodejs`.

#### node-js-getting-started

A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

##### Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

##### Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

##### Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)

### Firebase for Authentication

We decided to use the Google service Firebase to support social login authentication.

### Generate .json test data

The offerings-berlin.json contains sample data in and around Berlin.
The test data was generated with https://www.json-generator.com/# by using the following query:

```
[
  '{{repeat(1000)}}',
  {
    _id: '{{objectId()}}',
    userId: '{{random("4UfWXtocrIVst8ibYw1Nu2CqHQC2", "KhxRmzKFILT8ziEwDhPJZd65lnq1", "sJoqxWyKobTJZp3LAEoZlcyccKg1", "PdWOFNsvMRZRogZQdFxd2oywsAH2")}}',
    location: {
      lat: '{{floating(52.354002, 52.622138)}}',
      lng: '{{floating(13.220354, 13.739104)}}'
    },
    offer: '{{random("Nudeln", "Toilettenpapier","Mineralwasser","Dosenwurst")}}',
    tradeFor: '{{random("Nudeln", "Toilettenpapier","Mineralwasser","Dosenwurst")}}'
  }
]
```

The test users are:

* wolverine@xmen.test (userId:4UfWXtocrIVst8ibYw1Nu2CqHQC2)
* gandalf@lofr.test (userId: KhxRmzKFILT8ziEwDhPJZd65lnq1)
* walter@breakingb.test (userId: sJoqxWyKobTJZp3LAEoZlcyccKg1)
* morpheus@matrix.test (userId: PdWOFNsvMRZRogZQdFxd2oywsAH2)
