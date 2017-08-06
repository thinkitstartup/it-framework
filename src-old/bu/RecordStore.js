/**
 * Record Store
 * @extends IT.RecordStore
 * @type IT.RecordStore
 * @param {Object} settings setting for class
 * @depend IT.BaseClass
 */
IT.RecordStore = class extends IT.BaseClass {
	/** conctructor */
	constructor(record){
		super();
		
		let me =this,
			_changed={};

		Object.defineProperties(me, {
			rawData:{
				enumerable: false,
				writable: false,
				configurable: false,
				value: record
			},
			field:{
				get:function(){
					return Object.keys(record)
				}
			},
			changed: {
				enumerable:true,
				set:function(value){
					_changed = value;
				},
				get: function () {
					return _changed;
				}
			},
			isChanged:{
				get: function () {
					return _changed === me.rawData;
				}	
			}
		});
	}
	update(key,value){
		let me = this;
		if(Object.keys(me.changed).length==0){
			me.changed = ;
		}
		if(me.changed.hasOwnProperty(key))
			me.changed[key] = value;
	}
}