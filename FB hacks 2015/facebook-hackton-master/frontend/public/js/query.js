$( "#buyButton" ).click(function() {
		
	$.getJSON("http://calm-stream-6595.herokuapp.com/getTransactions?buyCurrency=" + document.getElementById("buyTargetCurrency").value + "&sellCurrency=" + document.getElementById("buySourceCurrency").value + "&buyAmount=" + document.getElementById("buyAmount").value).
	done(function (result) {
		document.getElementById('buyList').innerHTML = createTransactionList(result);
	})
	.fail(function () {
	});
});

$( "#sellButton" ).click(function() {
		
	$.getJSON("http://calm-stream-6595.herokuapp.com/getTransactions?buyCurrency=" + document.getElementById("sellTargetCurrency").value + "&sellCurrency=" + document.getElementById("sellSourceCurrency").value + "&sellAmount=" + document.getElementById("sellAmount").value).
	done(function (result) {
		document.getElementById('sellList').innerHTML = createTransactionList(result);
	})
	.fail(function () {
	});
});

function createTransactionList(serverResponse)
{
	var result = '';
	for (var i = 0; i < serverResponse.length; i++)
	{
		var data = serverResponse[i];
		console.log(data);
		
		var userId = data["facebookId"];
		var selling = Number((data["sellAmount"] || 0).toFixed(2));
		var buying = Number((data["buyAmount"] || 0).toFixed(2));
		var converted = Number((data["convertedAmount"] || 0).toFixed(2));
		var sellingCurrency = data["sellCurrency"];
		var buyingCurrency = data["buyCurrency"];

		var userName = "John Doe";
		if (userId == "10153597214619241")
		{
			userName = "Vladimir Gritsenko";
		}
		else if (userId == "10153464221078780")
		{
			userName = "Elad Zelingher";
		}
		else if (userId == "10204790430027293")
		{
			userName = "Itay Gutman";
		}
		else if (userId == "1026336607399278")
		{
			userName = "Oren Avram";
		}

		result += '<li class="table_row">';
		
		if (selling > 0)
		{
			result += '<a href="http://facebook.com/' + userId + '" style="color: #64A6D3;text-decoration: underline;margin-left: 5px;">' + userName +'</a> is selling <strong>' + selling + ' ' + sellingCurrency + '</strong> for <strong>' + converted + ' ' + buyingCurrency + '</strong>.';
		}
		else // buying > 0
		{
			result += '<a href="http://facebook.com/' + userId + '" style="color: #64A6D3;text-decoration: underline;margin-left: 5px;">' + userName +'</a> is buying <strong>' + buying + ' ' + buyingCurrency + '</strong> for <strong>' + converted + ' ' + sellingCurrency + '</strong>.';
		}
		
		result += '<li/>';
	}
	
	return result;
}
