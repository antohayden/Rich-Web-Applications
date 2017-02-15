// Needed to allow CROSS-domain requests
$.ajaxSetup({
	crossDomain : true,
	cache : false,
	contentType : "application/json",
	dataType : "json"
});

$.ajaxSetup({'cache':true});

$( document ).ajaxStart(function() {
	$("body").addClass("loading");
});

$( document ).ajaxStop(function() {
	$('body').removeClass("loading");
});

var router = new AppRouter();
Backbone.$ = window.$;
Backbone.history.start();

