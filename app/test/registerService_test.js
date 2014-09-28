/**
 * Created by alidad on 9/28/14.
 */


'use strict';
describe("registerService", function () {
    var registerService;

    function getValues(list) {
        var ls = [];
        for (var i = 0; i < list.length; i++) {
            ls.push(+(list[i].value));
        }

        return ls.sort(function (a, b) {
            // for some reason sort function does not sort it properly
            if (a < b)
                return -1;
            else if (a > b)
                return 1;
            else
                return 0;
        });
    }

    beforeEach(function () {
        module('myApp');

        inject(function (_registerService_) {
            registerService = _registerService_;
        });

    });

    it('get available coins should return all the available coins', function () {
        expect(registerService._private.getAvailableCoins()).toEqual([1, 5, 10, 25, 50, 100, 200, 500, 1000, 2000]);
    });

    it('make change for zero should return empty list', function () {
        var changes = registerService.makeChange(0);
        expect(getValues(changes)).toEqual([]);
    });

    it('make change for available coins 75', function () {
        var changes = registerService.makeChange(75);
        expect(getValues(changes)).toEqual([25, 50]);
    });

    it('make change for available coins 76', function () {
        var changes = registerService.makeChange(76);
        expect(getValues(changes)).toEqual([1, 25, 50]);
    });

    it('make change should return not return the coin that is not available at the begining', function () {
        registerService.getData().denominations[25].availableAmount = 0;
        var changes = registerService.makeChange(75);
        expect(getValues(changes)).toEqual([5, 10, 10, 50]);
    });

    it('make change should return not return the coin that is not available', function () {
        registerService.getData().denominations[10].availableAmount = 2;
        registerService.getData().denominations[25].availableAmount = 0;
        var changes = registerService.makeChange(75);
        expect(getValues(changes)).toEqual([5, 10, 10, 50]);
        expect(registerService.getData().denominations[10].availableAmount).toEqual(0);
        registerService.getData().denominations[25].availableAmount = 1;
        // after spending both dimes
        changes = registerService.makeChange(75);
        expect(getValues(changes)).toEqual([25, 50]);
    });


});