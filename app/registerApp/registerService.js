/**
 * Created by alidad on 9/27/14.
 */


angular.module('myApp').factory('registerService', function () {
    var data = {
        messages: [],
        denominations: {
            1: { availableAmount: 100, name: "Penny"},
            5: { availableAmount: 3, name: "Nickel"},
            10: { availableAmount: 2, name: "Dime"},
            25: { availableAmount: 10, name: "Quarter"},
            50: { availableAmount: 100, name: "Fifty cents"},
            100: { availableAmount: 100, name: "Ten dollar"},
            200: { availableAmount: 100, name: "Two dollar"},
            500: { availableAmount: 100, name: "Five dollar"},
            1000: { availableAmount: 100, name: "Ten dollar"},
            2000: { availableAmount: 100, name: "Twenty dollar"}
        }};

    function getAvailableCoins() {
        var keys = [];
        angular.forEach(data.denominations, function (v, i) {
            if (v.availableAmount > 0) {
                keys.push(+i);
            }
        });
        return keys;
    }

    function getData() {
        return data;
    }


    function makeChange(changeAmount) {
        data.messages = [];
        return _makeChange(getAvailableCoins(), changeAmount)
    }

    function getAvailabilityAmountFor(key) {
        if (key in data.denominations) {
            return data.denominations[key].availableAmount
        }

    }

    /*
     Assumptions:
     Coin list is sorted
     */
    function _makeChange(coinsList, changeAmount) {
        sendMessage("Calculating the change based on dynamic programing algorithm");
        if (!coinsList) return [];
        if (!changeAmount) return [];

        var lastCoin = [0];
        var coinsUsed = [0];

        for (var cents = 1; cents <= changeAmount; cents++) {
            var minCoins = cents;
            var newCoin = coinsList[0];

            for (var j = 0; j < coinsList.length; j++) {
                if (coinsList[ j ] > cents)   break;
                if (coinsUsed[ cents - coinsList[j] ] + 1 < minCoins) {
                    minCoins = coinsUsed[ cents - coinsList[ j ] ] + 1;
                    newCoin = coinsList[ j ];
                }
            }

            if (getAvailabilityAmountFor(newCoin) - minCoins < 0) {
                sendMessage("out of coin for " + newCoin);
                if (newCoin == coinsList[0]) {
                    sendMessage("Not enough coin for " + newCoin);
                    sendMessage("Cannot proceed");
                    return [];
                }
                cents--;
                coinsList.splice(coinsList.indexOf(newCoin), 1);
                continue;
            }

            coinsUsed[ cents ] = minCoins;
            lastCoin[ cents ] = newCoin;
        }

        var acceptableCoins = [];
        for (var i = changeAmount; i > 0;) {
            var bill = lastCoin[ i ];
            acceptableCoins.push(data.denominations[bill]);
            i -= bill;
            spend(bill);

        }
        return acceptableCoins;
    }

    function spend(amount) {
        if (amount in data.denominations) {
            data.denominations[amount].availableAmount -= 1;
        } else {
            sendMessage("Error");
        }

    }

    function sendMessage(message) {
        console.log(message);
        data.messages.push(message);
    }

    return {
        makeChange: makeChange,
        getData: getData
    };
});



