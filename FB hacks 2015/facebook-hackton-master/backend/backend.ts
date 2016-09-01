/// <reference path="typings/express/express.d.ts"/>
/// <reference path="typings/parse/parse.d.ts"/>
import * as express from "express";
import * as https from "https";
import {Parse} from "parse";

export function setupHacktonService(app: express.Express) {
    app.get("/getConversionRate", getConversionRate);
    app.get("/getTransactions", getTransactions);
    app.get("/getTransactionsById", getTransactionsById);
    app.post("/postTransaction", postTransaction);
    app.delete("/deleteTransaction", deleteTransactionById);
}

function getTransactions(req: express.Request, res: express.Response, next: Function) {
    var transactionsQuery: TransactionsQuery = req.query;
    var query = new Parse.Query("Transaction");
    var mirrorQuery = new Parse.Query("Transaction");

    if (transactionsQuery.buyCurrency != null) {
        query.equalTo("buyCurrency", transactionsQuery.sellCurrency);
        mirrorQuery.equalTo("buyCurrency", transactionsQuery.sellCurrency);
    }
    if (transactionsQuery.sellCurrency != null) {
        query.equalTo("sellCurrency", transactionsQuery.buyCurrency);
        mirrorQuery.equalTo("sellCurrency", transactionsQuery.buyCurrency);
    }

    if (transactionsQuery.sellAmount != null) {
        query.notEqualTo("buyAmount", 0);
        mirrorQuery.notEqualTo("sellAmount", 0);
    } else {
        query.notEqualTo("sellAmount", 0);
        mirrorQuery.notEqualTo("buyAmount", 0);        
    }

    query.limit(500);
    mirrorQuery.limit(500);

    query.find({
        success: (transactions: Parse.Object[]) => {
            var result = convertTransactions(transactions);

            mirrorQuery.find({
                success: (transactions: Parse.Object[]) => {
                    var mirrorResult = convertTransactions(transactions);
                    var all = result.concat(mirrorResult);
                    res.json(all);
                }
            });
        }
    });
}

function getConversionRate(req: express.Request, res: express.Response, next: Function) {
    var conversionRequest: ConversionRequest = req.query;
    var converter = new CurrencyConverter();
    let rate = converter.getRate(conversionRequest.fromCurrency, conversionRequest.toCurrency);

    return conversionRequest.amount * rate;
}


function getTransactionsById(req: express.Request, res: express.Response, next: Function) {
    var transactionsQuery: TransactionsByIdQuery = req.query;
    var query = new Parse.Query("Transaction");

    query.equalTo("facebookId", transactionsQuery.facebookId);

    query.limit(500);

    query.find({
        success: (transactions) => {
            var result = convertTransactions(transactions);

            res.json(result);
        }
    });
}

function postTransaction(req: express.Request, res: express.Response, next: Function) {
    var postData: TransactionPostData = req.body;

    var ParseTransaction = Parse.Object.extend("Transaction");
    var transactionToInsert = new ParseTransaction();

    transactionToInsert.set("sellCurrency", postData.sellCurrency);
    transactionToInsert.set("buyAmount", Number(postData.buyAmount));
    transactionToInsert.set("buyCurrency", postData.buyCurrency);
    transactionToInsert.set("sellAmount", Number(postData.sellAmount));
    transactionToInsert.set("facebookId", postData.facebookId);

    transactionToInsert.save(null, {
        success: function (p) {
            res.sendStatus(201);
        },
        error: function(ex) {
            res.sendStatus(500);
        }
    });
}

function deleteTransactionById(req: express.Request, res: express.Response, next: Function) {
    var transactionsQuery: TransactionDeleteRequest = req.body;
    var ParseTransaction = Parse.Object.extend("Transaction");
    var query = new Parse.Query(ParseTransaction);

    query.get(transactionsQuery.id, {
        success: (transaction : Parse.Object) => {
            transaction.destroy({
                success: function () {
                    res.sendStatus(204);
                },
                error: function() {
                    res.sendStatus(500);
                }
            });
        },
        error: function (r) {
            console.log(r);
            res.sendStatus(500);        
        }
    });
}


function convertTransactions(transactions: Parse.Object[]) : Transaction[] {
    var converter = new CurrencyConverter();

    var result =
        transactions.map(x => {
            let buyCurrency: string = x.get("buyCurrency");
            let sellCurrency: string = x.get("sellCurrency");
            let sellAmount: number = x.get("sellAmount");
            let buyAmount: number = x.get("buyAmount");

            let convert: number;

            if (sellAmount != null && sellAmount !== 0) {
                convert = converter.getRate(sellCurrency, buyCurrency) * sellAmount;
            } else if (buyAmount != null && buyAmount !== 0) {
                convert = converter.getRate(buyCurrency, sellCurrency) * buyAmount;                
            }

            return {
                id: x.id,
                facebookId: x.get("facebookId"),
                buyCurrency: buyCurrency,
                sellCurrency: sellCurrency,
                buyAmount: buyAmount,
                sellAmount: sellAmount,
                convertedAmount: convert
            }
        });

    return result;
}

interface ConversionRequest {
    amount: number;
    fromCurrency: string;
    toCurrency: string;
}


interface TransactionsQuery {
    buyCurrency: string;
    buyAmount?: number,
    sellAmount?: number,
    sellCurrency?: string;
}

interface TransactionsByIdQuery {
    facebookId: string;
}

interface Transaction {
    sellCurrency: string,
    buyCurrency: string,
    sellAmount: number,
    facebookId: string,
    convertedAmount: number;
}

interface TransactionDeleteRequest {
    id: string,    
}

interface TransactionPostData {
    sellCurrency: string,
    buyCurrency: string,
    buyAmount?: number,
    sellAmount?: number,
    facebookId: string,
}

class CurrencyConverter {
    private _hardCoded = { "EUR": "0.8976400", "USD": "1", "ARS": "9.3033000", "AUD": "1.4265100", "NOK": "8.2673700", "BRL": "3.7514500", "CAD": "1.3201200", "CLP": "686.5745500", "CNY": "6.3539600", "NZD": "1.5638500", "CZK": "24.2568900", "DKK": "6.6951800", "FJD": "2.1931100", "GBP": "0.6552000", "HNL": "21.9625000", "HKD": "7.7500000", "HUF": "281.8136300", "ISK": "130.0229500", "INR": "66.0533800", "IDR": "14264.0179000", "ILS": "3.9345400", "JPY": "119.8877600", "KRW": "1192.1002100", "CHF": "0.9731100", "MYR": "4.2264300", "MXN": "16.8503500", "PKR": "103.9914700", "PHP": "46.7655000", "PLN": "3.7834200", "RUB": "67.0224500", "SGD": "1.4174400", "ZAR": "13.5765500", "SEK": "8.4081000", "TWD": "32.4177300", "THB": "35.8045000", "TRY": "2.9675100", "VND": "22434.4321300" };

    private _currencyToCurrencyToRate = {};

    public getRate(fromCurrency: string, toCurrency: string): number {
        var fromCurrencyValue = this._currencyToCurrencyToRate[fromCurrency];

        if (fromCurrencyValue == null) {
            fromCurrencyValue = {};
            this._currencyToCurrencyToRate[fromCurrency] = fromCurrencyValue;
        }

        var toCurrencyValue = fromCurrencyValue[toCurrency];

        if (toCurrencyValue == null) {
            toCurrencyValue = this.getRateSynchronous(fromCurrency, toCurrency);
            fromCurrencyValue[toCurrency] = toCurrencyValue;
        }

        return toCurrencyValue;
    }

    private getRateSynchronous(fromCurrency: string, toCurrency: string): number {
        let toConverted = Number(this._hardCoded[toCurrency]);
        let fromConverted = Number(this._hardCoded[fromCurrency]);
        return fromConverted / toConverted;
    }
}

class RestCurrencyConverter {
    private _currencyToCurrencyToRate = {};

    public getRate(fromCurrency: string, toCurrency: string) : number {
        var fromCurrencyValue = this._currencyToCurrencyToRate[fromCurrency];

        if (fromCurrencyValue == null) {
            fromCurrencyValue = {};
            this._currencyToCurrencyToRate[fromCurrency] = fromCurrencyValue;
        }

        var toCurrencyValue = fromCurrencyValue[toCurrency];

        if (toCurrencyValue == null) {
            toCurrencyValue = this.getRateSynchronous(fromCurrency, toCurrency);
            fromCurrencyValue[toCurrency] = toCurrencyValue;
        }

        return toCurrencyValue;
    }

    private getRateSynchronous(fromCurrency: string, toCurrency: string): number {
        var options = {
            host: `currency-api.appspot.com`,
            path: `/api/${fromCurrency}/${toCurrency}.json?amount=1.00`
        };

        var completed = false;
        var result = '';
        console.log("calling " + options.host);
        var callback = function(response) {

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function(chunk) {
                result += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {
                completed = true;
                console.log(result);
            });
        }

        https.request(options, callback).end();

        var parsed = JSON.parse(result);

        return parsed.rate;
    }
}