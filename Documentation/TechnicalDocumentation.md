## Backend API

### Offerings and Trades

#### GET /api/trades/:Id

Returns the trades related to the UserID
##### Example Request:
```
http://localhost:5000/api/trades/1234567
```

#### Example Response:

```json
[
    {
        "date": 1591865306639,
        "location": {
            "lat": 47.8119,
            "lng": 9.65158
        },
        "offer": "Zahnpasta",
        "tradeFor": "Deo",
        "tradeId": "51578ac0-fe6f-4443-bd84-ab18266a7dc6",
        "userId": "i0OnXR4C3uNAZ7YN8GN3tqLqtoI3"
    },
    {
        "date": 1592128469421,
        "location": {
            "lat": 52.517,
            "lng": 13.3889
        },
        "offer": "Nudeln",
        "tradeFor": "Reis",
        "tradeId": "60616e31-9d0e-4415-8bb4-7ac3a1ffaf71",
        "userId": "i0OnXR4C3uNAZ7YN8GN3tqLqtoI3"
    }
]
```

#### POST /api/deleteTrade/:Id

Deletes the offer with the tradeId in the message body and returns the remaining trades
##### Example message body:
```json
{
    "tradeId":"sadasdg4-das2-rfg5-fsd5-123dasd",
    "userId":"i0OnXR4C3uNAZ7YN8GN3tqLqtoI3"
}
```
#### Example Response:

```json
[
    {
        "date": 1591865306639,
        "location": {
            "lat": 47.8119,
            "lng": 9.65158
        },
        "offer": "Zahnpasta",
        "tradeFor": "Deo",
        "tradeId": "51578ac0-fe6f-4443-bd84-ab18266a7dc6",
        "userId": "i0OnXR4C3uNAZ7YN8GN3tqLqtoI3"
    }
]
```

#### POST /api/offerings

Adds a new offer
##### Example message body:
```json
{
  "userId": "i0OnXR4C3uNAZ7YN8GN3tqLqtoI3",
  "offer": "Nudeln",
  "location": { "lng": 13.3889, "lat": 52.517 },
  "tradeFor": "Reis"
}

```

#### Example Response:
```json
{
    "tradeId": "059aab70-f685-4ab2-ac14-5baa8986e77e",
    "userId": "i0OnXR4C3uNAZ7YN8GN3tqLqtoI3",
    "offer": "Nudeln",
    "tradeFor": "Reis",
    "location": {
        "lng": 13.3889,
        "lat": 52.517
    },
    "date": 1592129489671
}
```

### Chats

#### GET /api/chat/:conversationId

Returns the messages for a specific conversation
##### Example Request:
```
http://localhost:5000/api/chat/2652992626
```

#### Example Response:

```json
[
    {
        "convId": 2652992626,
        "date": 1591865323463,
        "from": "i0OnXR4C3uNAZ7YN8GN3tqLqtoI3",
        "message": "Hallo, ich würde gerne Brot gegen Zwiebeln tauschen. Wollen wir dazu einen Treffpunkt vereinbaren?",
        "to": "L8QiM13E1vMGOgJSQTaBMGCM0HK2",
        "traderName": "User 1"
    },
    {
        "convId": 2652992626,
        "date": 1592125288011,
        "from": "L8QiM13E1vMGOgJSQTaBMGCM0HK2",
        "message": "Vielen Dank für Ihr Angebot. Gerne können wir uns heute Nachmittag am XY-Platz treffen um zu tauschen",
        "to": "i0OnXR4C3uNAZ7YN8GN3tqLqtoI3",
        "traderName": "User 2"
    }
]
```

#### POST /api/chat

Adds a new message to a conversation
##### Example message body:
```json
{
  "message": "Könnten wir uns heute Mittag treffen um den Tausch durchzuführen?",
  "from": "i0OnXR4C3uNAZ7YN8GN3tqLqtoI3",
  "to": "L8QiM13E1vMGOgJSQTaBMGCM0HK2",
  "convId": 2652992626,
  "dateSent": 1592130639018
}
```
#### Example Response:

```json
[
    {
        "date": 1591865306639,
        "location": {
            "lat": 47.8119,
            "lng": 9.65158
        },
        "offer": "Zahnpasta",
        "tradeFor": "Deo",
        "tradeId": "51578ac0-fe6f-4443-bd84-ab18266a7dc6",
        "userId": "i0OnXR4C3uNAZ7YN8GN3tqLqtoI3"
    }
]
```

#### GET /api/conversations/:Id

Returns the existing conversation for the requested UserId
##### Example Request:
```
http://localhost:5000/api/conversations/i0OnXR4C3uNAZ7YN8GN3tqLqtoI3
```

#### Example Response:

```json
[
    {
        "convId": 2652992626,
        "lastMessage": 1592130639028,
        "offer": "Reis",
        "tradeFor": "Nudeln",
        "tradeId": "959864f3-4e35-4d5d-bd0f-6472f3c7c0ee",
        "tradeWith": "L8QiM13E1vMGOgJSQTaBMGCM0HK2",
        "traderName": "User 1"
    }
]
```

#### POST /api/conversations

Adds a new conversation object to the database
##### Example message body:
```json
{
  "me": "i0OnXR4C3uNAZ7YN8GN3tqLqtoI3",
  "offer": "Reis",
  "tradeFor": "Nudeln",
  "tradeId": "b2daf6ff-16ea-40b8-ab0c-7385ae3f3931",
  "tradeWith": "L8QiM13E1vMGOgJSQTaBMGCM0HK2",
  "convId": 2652992626
}
```

### User

#### GET /api/user/:Id

Returns the data for the requested UserId
##### Example Request:
```
http://localhost:5000/api/user/L8QiM13E1vMGOgJSQTaBMGCM0HK2
```

#### Example Response:

```json
[
    {
        "displayName": "User 1",
        "email": "user1@mockmail.de",
        "uid": "L8QiM13E1vMGOgJSQTaBMGCM0HK2"
    }
]

```

#### POST /api/user

Saves the data for a new user
##### Example message body:
```json
[
    {
        "email":"user1@mockmail.de",
        "displayName":"User 1",
        "uid": "L8QiM13E1vMGOgJSQTaBMGCM0HK2"
    }
]
```
