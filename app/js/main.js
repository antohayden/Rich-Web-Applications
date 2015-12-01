// Needed to allow CROSS-domain requests
$.ajaxSetup({
	crossDomain : true,
	cache : false,
	contentType : "application/json",
	dataType : "json"
});

$.ajaxSetup({'cache':true});


var router = new AppRouter();
Backbone.history.start();

