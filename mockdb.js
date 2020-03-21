module.exports = {
    availableItems: [
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
        }],

    mockDb: function (items) {
        this.availableItems = items;
        this.itemsByLocation = function (topLeftLocation, lowerRightLocation) {
            return this.availableItems.filter(e => byLocation(e, topLeftLocation, lowerRightLocation));
        }
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