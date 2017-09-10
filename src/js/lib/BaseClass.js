/**
 * BaseClass for every Class Instance
 * @type {class}
 */
IT.BaseClass = class {
	constructor(settings) {
		let me = this;
		me._id = "";//private

		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.Component#settings
		 */
		me.settings = settings||{};
	}


	/**
	 * used to check if this is a class
	 * @type {boolean}
	 */
	get isClass(){
		return true;
	}
	/**
	 * addEvents to the the class
	 * @param  {option} object of functions 
	 * @param  {events_available} array array of string. Can be act as event available
	 */
	//https://stackoverflow.com/questions/23344625/create-javascript-custom-event
	addEvents(option,listen_enable=[]){
		let me=this;
		if (listen_enable.length==0){
			Object.keys(option).forEach((e)=>
				typeof option[e]=="function"
					?listen_enable.push(e)
					:null
			);
		}
		let sel = option.selector || $(me);
		//sel = (typeof sel.on=="function")?sel:$(sel);
		listen_enable.forEach((event) =>
			sel.on(
				event, 
				(option[event]||IT.Utils.emptyFn)
			)
		)
	}
	/**
	 * Call event from available events.
	 * @param  {event} string of the event to be called
	 * @param  {params} array array of argument to be passed
	 */
	doEvent(event,params){
		$(this).trigger(event,params);
	}
}