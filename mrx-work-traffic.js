/* global Module */

/* Magic Mirror
 * Module: mrx-work-traffic
 *
 * By Dominic Marx
 * MIT Licensed.
 */

Module.register('mrx-work-traffic', {
	defaults: {
		apikey: '',
		origin: 'Platz der Republik 1, 11011 Berlin',
		startTime: '00:00',
		endTime: '23:59',
		destinations: [
			{
				destination: 'Platzl 9, 80331 München',
				label: 'Hofbräuhaus',
				time: null
			}
		]
	},
	
	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},
	
	// Define required styles.
	getStyles: function () {
		return ["font-awesome.css"];
	},

	/*
	 * Dont know why this.hide() is not working :(
	 * As workaround I decided to return empty elements/strings in getDom() & getHeader().
	 * => But there is the heading underline....
	 */
	start: function() {
		Log.info('Starting module: ' + this.name);
		var now = moment().format('LT');
		if( now >= this.config.startTime && now <= this.config.endTime ){
			this.loaded = false;
			this.payload = [];
			for(var i = 0; i<this.config.destinations.length; i++) {
				var _url = 'https://maps.googleapis.com/maps/api/directions/json' + this.getParams(this.config.destinations[i].destination);
				this.payload.push( {url: _url, label: this.config.destinations[i].label} );
			}
			setInterval(function(){
				this.askGoogle();
			},600000);
			
		}
		else{
			this.hide(0);
		}
	},
	
	getParams: function(dest) {
        var params = '?';
        params += 'origin=' + encodeURIComponent(this.config.origin);
        params += '&destination=' + encodeURIComponent(dest);
        params += '&key=' + this.config.apikey;
        return params;
    },
	
	askGoogle: function(){
		this.sendSocketNotification("GOOGLE_TRAFFIC_GET", this.payload);
	},
	
	// Override dom generator.
	getDom: function() {
		var now = moment().format('LT');
		if( now >= this.config.startTime && now <= this.config.endTime ){
			var table = document.createElement("table");
			table.className = "small";
			
			for(var i = 0; i<this.config.destinations.length; i++) {
				var row = document.createElement("tr");
				table.appendChild(row);
				
				var carCell = document.createElement("td");
				carCell.className = "mrx-wt-car";
				carCell.innerHTML = '<i class="fa fa-car"></i>';
				row.appendChild(carCell);
				
				var locationCell = document.createElement("td");
				locationCell.className = "mrx-wt-location";
				locationCell.innerHTML = this.config.destinations[i].label;
				row.appendChild(locationCell);
				
				var timeCell = document.createElement("td");
				timeCell.className = "mrx-wt-timetravel";
				timeCell.innerHTML =  this.config.destinations[i].time ?  this.config.destinations[i].time + ' min' : "<i class='fa fa-spin fa-circle-o-notch'></i>";
				row.appendChild(timeCell);
			}

			return table;
		}
		else{
			return document.createElement('span');
		}
	},
	
	getHeader: function(){
		var now = moment().format('LT');
		if( now >= this.config.startTime && now <= this.config.endTime ){
			return this.data.header;
		}
		return '<span></span>';
	},
	
	socketNotificationReceived: function(notification, payload) {
		if( notification === 'GOOGLE_TRAFFIC_LIST' ){
			for(var i = 0; i<this.config.destinations.length; i++) {
				if( this.config.destinations[i].label === payload.label)
					this.config.destinations[i].time = Math.floor( payload.duration / 60 );
			}
			this.updateDom();
		}
	}
});