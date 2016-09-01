/// <reference path="typings/jquery/jquery.d.ts"/>
$(function () {
    $.ajax({
        type: 'DELETE',
        dataType: "json",
        url: "http://localhost:5000/deleteTransaction/",
        data: {
            id: "JRsZfd2WNA"
        },
        success: function (responseData, textStatus, jqXHR) {
            console.log("success!");
        },
        error: function (responseData, textStatus, errorThrown) {
            alert('POST failed.');
        }
    });
});


//$(function () {
//    $.ajax({
//        type: 'POST',
//        dataType: "json",
//        url: "http://localhost:5000/postTransaction/",
//        data: {
//            facebookId: "10153464221078780",
//            buyCurrency: "EUR",
//            sellCurrency : "USD",
//            sellAmount: 40  
//        },
//        success: function (responseData, textStatus, jqXHR) {
//            console.log("success!");
//        },
//        error: function(responseData, textStatus, errorThrown) {
//            alert('POST failed.');
//        }
//    });
//});