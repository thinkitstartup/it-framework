/**
 * CLass listener to handdle event function 
 * @extends IT.BaseClass
 * @depend IT.BaseClass
 * @deprecated No longer used
 */
// IT.Listener = class extends IT.BaseClass {
// 	/**
// 	 * set the listeners
// 	 * @param  {function} scope scope where listeners lies
// 	 * @param  {object} option object of event function
// 	 * @param  {sting[]}  listen_enable	array of string to register
// 	 */
// 	constructor(scope,option,listen_enable=[]){
// 		super();
// 		// let me =this;
// 		// me.events={};
// 		// me.scope=scope;
// 		// listen_enable.forEach((a) => me.events[a]=option[a]);
// 		console.info("Deprecated");
// 		throw "Deprecated";
// 	}

// 	/**
// 	 * apply a function listener with params
// 	 * @param  {sting} listener listener tobe called
// 	 * @param  {array} params   array of string to pass as argument listener
// 	 */
// 	fire(listener,params){
// 		// var me=this;
// 		// if(typeof me.events[listener]=="function"){
// 		// 	return me.events[listener].apply(me.scope,params);
// 		// }
// 	}
// }