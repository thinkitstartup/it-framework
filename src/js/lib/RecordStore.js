/**
 * Record Store
 * @extends IT.RecordStore
 * @type IT.RecordStore
 * @param {Object} record
 * @depend IT.BaseClass
 */
IT.RecordStore = class extends IT.BaseClass {
	/** conctructor */
	constructor(record){
		super();
		
		let me 			= this;
		me.rawData 		= record,
		me.changed		= {},
		me.field		= Object.keys(record);
	}
	/**
	 * is this record has been updated
	 * @return {Boolean} true if record has changed
	 */
	isChanged(){
		return Object.keys(this.changed).length>0;
	}

	/**
	 * Update the record, but it's appended to changed data. Raw data still untouched
	 * @param  {String} key   [description]
	 * @param  {String} value [description]
	 * @return {true}       true if updating succes. (append to changed data)
	 */
	update(key,value){
		let me = this;
		if (me.rawData.hasOwnProperty(key)){
			if(me.rawData[key] === value){
				if (me.changed[key]){
					delete me.changed[key];
				}
			}
			else {
				me.changed[key] = value;
				return true;
			}
		}else {console.error("Field "+key+" is not exists");}
		return false;
	}

	/**
	 * Get data changed
	 * @return {Object} return null if isChanged false. otherwise return rawdata with changed applied
	 */
	getChanged(){
		let me=this;
		return !me.isChanged()?null:Object.assign({},me.rawData,me.changed);
	}

	/**
	 * Get record data property
	 * @param  {String} key key field
	 * @return {Object}     value
	 */
	get(key){
		return this.rawData[key];
	}
}