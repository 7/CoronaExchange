# CoronaExchange

This app allows people to find items they need urgently (and cannot buy, as they are currently sold out) and trade for them with items they have too much of.

## Use cases

### Trade items

A simple example:

Mr. Brown freaked out, when he heard of the outbreak of a new disease. He ran to the store and bought tons of toilet paper. But in his urgency he forgot to buy noodles.

Mrs. Green meanwhile could not get any toilet paper, but bought a bunch of noodle packs. She calls up the CoronaExchange app and adds noodles to her stock, stating that she's willing to trade for toilet paper.

Mr. Brown opens up his app and can quickly check that someone close to him (Mrs. Green) is offering noodles for toilet paper. He clicks the trade offer and negotiates a meeting, where they can safely exchange a set amount of their items.

### Lookup stock exchange values for toilet paper

If you are wondering what amount of toilet paper usually trades for a pack of noodles, you can quickly check with a look at the current CoronaExchange Stock Market.

## Technology Decisions

### Vue.js for frontend

This is where we have the most frontend knowledge currently.

### Node.js for backend

Node.js is easy to setup and learn. Additionally it allows frontend developers with a little Javascript knowledge to help out with backend development.

### Heroku for deployment

Free to use.

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

