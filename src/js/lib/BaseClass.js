/**
 * BaseClass for every Class Instance
 * @type {class}
 */
IT.BaseClass = class {
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
	addEvents(option,events_available=[]){
		let me=this;
		events_available.forEach((a) => me[a]=option[a]||function(){});
	}	
	/**
	 * Call event from available events.
	 * @param  {event} string of the event to be called
	 * @param  {params} array array of argument to be passed
	 * @param  {scope} object scope where the event will be called
	 */
	doEvent(event,params,scope=null){
		var me=this;
		if(typeof me[event]=="function"){
			return me[event].apply(scope||me,params);
		}
	}
}