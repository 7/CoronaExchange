var fs = require("fs");
module.exports = {
    availableItems: [],
    availableMessages: [
        {
            from: "KhxRmzKFILT8ziEwDhPJZd65lnq1", // gandalf
            to: "sJoqxWyKobTJZp3LAEoZlcyccKg1", // walter
            date: "2020-03-20T12:22:38 -00:00",
            text: "Hi Walter. Ich interessiere mich für dein Mineralwasser. Ich hätte Dosenwurst im Austausch."
        },
        {
            from: "sJoqxWyKobTJZp3LAEoZlcyccKg1", // walter
            to: "KhxRmzKFILT8ziEwDhPJZd65lnq1", // gandalf
            date: "2020-03-20T14:12:32 -00:00",
            text: "Gerne. Wann können wir die Waren austauschen?"
        },
        {
            from: "KhxRmzKFILT8ziEwDhPJZd65lnq1", // gandalf
            to: "sJoqxWyKobTJZp3LAEoZlcyccKg1", // walter
            date: "2020-03-20T14:13:23 -00:00",
            text: "In 10 min beim Kiosk an der Ecke."
        },
        {
            from: "sJoqxWyKobTJZp3LAEoZlcyccKg1", // walter
            to: "KhxRmzKFILT8ziEwDhPJZd65lnq1", // gandalf
            date: "2020-03-20T14:15:00 -00:00",
            text: "Ok. Bis gleich."
        },
        {
            from: "KhxRmzKFILT8ziEwDhPJZd65lnq1", // gandalf
            to: "4UfWXtocrIVst8ibYw1Nu2CqHQC2", // wolverine
            date: "2020-03-21T14:15:00 -00:00",
            text: "Hast du auch Mineralwasser? Ich kann dir Dosenwurst anbieten."
        },
    ],

    mockDb: function (offerings, chatMessages) {
        this.availableItems = offerings;
        this.itemsByLocation = function (topLeftLocation, lowerRightLocation) {
            return this.availableItems.filter(e => byLocation(e, topLeftLocation, lowerRightLocation));
        };
        this.availableMessages = chatMessages;
        this.chatMessagesBetweenUsers = function(user1, user2) {
            return this.availableMessages.filter(e => byUsers(e, user1, user2));
        };
    }
}

function byLocation(entry, topLeftLocation, lowerRightLocation) {
    lat = entry.location.lat;
    lng = entry.location.lng;
    if (topLeftLocation.lat <= lat && lat <= lowerRightLocation.lat) {
        if (topLeftLocation.lng <= lng && lng <= lowerRightLocation.lng) {
            return true;
        }
    }
    return false;
}

function byUsers(msg, user1, user2) {
    fromUser1ToUser2 = msg.from == user1 && msg.to == user2;
    fromUser2ToUser1 = msg.from == user2 && msg.to == user1;
    return fromUser1ToUser2 || fromUser2ToUser1;
}