/// <reference path="typings/parse/parse.d.ts"/>
import {Parse} from "parse";
import * as _ from "underscore";

interface Transaction {
    sellCurrency: string,
    buyAmount?: number,
    buyCurrency: string,
    sellAmount?: number,
    facebookId: string,
    //convertedAmout: number;
}

function generateTransactions() {
    var hardCoded = { "EUR": "0.8976400", "USD": "1", "ARS": "9.3033000", "AUD": "1.4265100", "NOK": "8.2673700", "BRL": "3.7514500", "CAD": "1.3201200", "CLP": "686.5745500", "CNY": "6.3539600", "NZD": "1.5638500", "CZK": "24.2568900", "DKK": "6.6951800", "FJD": "2.1931100", "GBP": "0.6552000", "HNL": "21.9625000", "HKD": "7.7500000", "HUF": "281.8136300", "ISK": "130.0229500", "INR": "66.0533800", "IDR": "14264.0179000", "ILS": "3.9345400", "JPY": "119.8877600", "KRW": "1192.1002100", "CHF": "0.9731100", "MYR": "4.2264300", "MXN": "16.8503500", "PKR": "103.9914700", "PHP": "46.7655000", "PLN": "3.7834200", "RUB": "67.0224500", "SGD": "1.4174400", "ZAR": "13.5765500", "SEK": "8.4081000", "TWD": "32.4177300", "THB": "35.8045000", "TRY": "2.9675100", "VND": "22434.4321300" };


    var people = ["10153597214619241", "10153464221078780", "10204790430027293"];
    var allCurrencies = Object.keys(hardCoded);

    var currencies = _.uniq(allCurrencies);

    var result: Transaction[] = [];

    for (let i = 0; i < 300; i++) {
        var transaction = generateTransaction(people, currencies);

        result.push(transaction);
    }

    return result;
}

function generateTransaction(people: string[], currencies: string[]): Transaction {

    var currency = randomInt(0, currencies.length);
    var otherCurrencies = currencies.filter((value, index) => index != currency);
    let amount = randomInt(0, 40);
    let result: Transaction = {
        sellCurrency: currencies[currency],
        //convertedAmout: randomInt(0, 30),
        facebookId: people[randomInt(0, people.length)],
        buyCurrency: otherCurrencies[randomInt(0, otherCurrencies.length)]
    };

    if (amount % 2 === 0) {
        result.buyAmount = amount;
    } else {
        result.sellAmount = amount;
    }

    return result;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

Parse.initialize("NdI8S94kzL9WfkyMRTaIGARw4HeAR7OA01u41DQE", "Pcts5Dw3ukhBh3KemHe5eRrf3LniBTbvJaSbrs26");

for (let value of generateTransactions()) {
    var ParseTransaction = Parse.Object.extend("Transaction");
    var transactionToInsert = new ParseTransaction();

    transactionToInsert.set("sellCurrency", value.sellCurrency);
    transactionToInsert.set("buyAmount", value.buyAmount);
    transactionToInsert.set("buyCurrency", value.buyCurrency);
    transactionToInsert.set("sellAmount", value.sellAmount);
    transactionToInsert.set("facebookId", value.facebookId);

    transactionToInsert.save(null, {
        success: function (gameScore) {
            console.log("success!");
            // Now let's update it with some new data. In this case, only cheatMode and score
            // will get sent to the cloud. playerName hasn't changed.
        }
    });
}
