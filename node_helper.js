/* Magic Mirror
 * Module: mrx-work-traffic
 *
 * By Dominic Marx
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var request = require('request');
 
 module.exports = NodeHelper.create({
    // subclass start method.
    start: function() {
        console.log("====================== Starting node_helper for module [" + this.name + "]");
    },
	
	
	// subclass socketNotificationReceived
    socketNotificationReceived: function(notification, payload){
        if (notification === 'GOOGLE_TRAFFIC_GET') {
			this.getTimeFromGoogle( payload );
        }
    },
	
	getTimeFromGoogle: function( destinations ) {
		var _self = this;		
		for(var i = 0; i < destinations.length; i++){
			request({url: destinations[i].url + '&label=' + destinations[i].label, method: 'GET'}, function(error, response, body) 
			{
				var _obj = {
					destination: null,
					duration : null,
					label: null
				};
				
				var _path =  response.req.path;
				var _params = _path.split('?')[1].split('&');
				for(var i = 0; i < _params.length; i++){
					if( _params[i].split('=')[0] === 'label')
						_obj.label = _params[i].split('=')[1];
				}
				if(!error && response.statusCode == 200){
					var data = JSON.parse(body);
					_obj.destination = data.routes[0].legs[0].end_address;
					_obj.duration = data.routes[0].legs[0].duration.value;
					
					_self.sendSocketNotification('GOOGLE_TRAFFIC_LIST', _obj);
				}
				else{
					console.log( response.statusCode );
				}
			});
		}
	}
	
 });