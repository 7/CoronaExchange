const mockdb = require('../mockdb')
const mockDb = new mockdb.mockDb(mockdb.availableItems)

var expect = require('chai').expect;

describe('itemsByLocation(...)', function () {
    it('should return all items in a window', function () {
        tlLocation = {
            lat: 52,
            lng: 12
        };
        lrLocation = {
            lat: 54,
            lng: 14
        };
        items = mockDb.itemsByLocation(tlLocation, lrLocation)
        expect(items.length).to.be.equal(mockdb.availableItems.length);
    })
})

describe('itemsByLocation(...)', function () {
    it('should return no items in an invalid window', function () {
        tlLocation = {
            lat: 52,
            lng: 12
        };
        lrLocation = {
            lat: 51,
            lng: 11
        };
        items = mockDb.itemsByLocation(tlLocation, lrLocation)
        expect(items.length).to.be.equal(0);
    })
})