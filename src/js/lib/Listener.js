/**
 * CLass listener to handdle event function 
 */
class Listener {
	/**
	 * set the listeners
	 * @param  {function} scope scope where listeners lies
	 * @param  {object} option object of event function
	 * @param  {sting[]}  listen_enable	array of string to register
	 */
	constructor(scope,option,listen_enable=[]){
		let me =this;
		me.events={};
		me.scope=scope;
		listen_enable.forEach((a) => me.events[a]=option[a]);
	}

	/**
	 * apply a function listener with params
	 * @param  {sting} listener listener tobe called
	 * @param  {array} params   array of string to pass as argument listener
	 */
	fire(listener,params){
		var me=this;
		if(typeof me.events[listener]=="function"){
			me.events[listener].apply(me.scope,params);
		}
	}

	/**
	 * [set description]
	 * @param {scope} cls class scope
	 * @deprecated not used anymore
	 */
	set(cls){
		/*
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
		 */
	}
}