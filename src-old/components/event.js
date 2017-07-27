function Event(parent, s){
	var settings = s || {};
	var me = this;
	me.events={};
	me.add=function(e, f){
		if(typeof f == 'function'){
			me.events[e]=f;
		}
	}
	me.fire=function(events,arg,ret){
		var ret = ret || parent;
		if(me.events.hasOwnProperty(events) && typeof me.events[events]== 'function')
			me.events[events].apply(ret,arg);
		if(settings.hasOwnProperty(events) && typeof settings[events]=='function')
			settings[events].apply(ret, arg);
	},
	me.set=function(b){
		var ret = {};
		$.each( base_events, function( index, value ) {
			var value = value;
			var on = "on" + value.substring(0,1).toUpperCase() + value.substring(1,value.length).toLowerCase();

			ret[value]=function(){ b.trigger(value); }
			ret[on]=function(act){ me.add(on,act); }
			b.on(value, function(){
				me.fire(value,[],this);
				me.fire(on,[]);
			});
		});

		return ret;
	}
}