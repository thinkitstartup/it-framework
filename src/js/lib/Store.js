/**
 * Data Store
 * @extends IT.BaseClass
 * @type IT.Store
 * @param {Object} settings setting for class
 * @depend IT.BaseClass
 * @depend IT.RecordStore
 */
IT.Store = class extends IT.BaseClass {
	/** conctructor */
	constructor(settings){
		super(settings);

		let me =this;
		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.Store#settings
		 * @property {string} id ID of element
		 */
		me.settings = $.extend(true,{
			type: 'json',
			url: '',
			data: [],
			autoLoad:false,
			params:{
				start: 0,
				limit: 20
			}
		}, settings);
		me.params = me.settings.params;
		me.data = [];
		me.total_rows = 0;
		me.listener = new IT.Listener(me, me.settings, [
			"beforeLoad",
			"afterLoad",
			"onLoad",
			"onError",
			"onEmpty"
		]);

		if (me.settings.autoLoad) me.load();
	}

	/**
	 * empty store data
	 */
	empty(){
		let me=this;
		me.total_rows = 0;
		me.data = [];
		me.listener.fire("onEmpty", [me.data, me.params]);
	}
	/**
	 * Load Data
	 * @param  {object} opt optional params
	 */
	load(opt={}){
		let me = this;
		//var opt = opt || {};
		switch(me.settings.type){
			case "json":
				var params = $.extend(me.settings.params, opt.params);
				me.params = params;
				me.empty();
				$.ajax({
					dataType: me.settings.type,
					type	: 'POST',
					url		: me.settings.url,
					data	: params,
					beforeSend: function(a,b){
						me.total_rows = 0;
						return me.listener.fire("beforeLoad",[me, a, b]);
					},
					success : function(data){
						if (typeof data.rows != 'undefined' && typeof data.total_rows != 'undefined'){
							$.each(data.rows ,(idx, item)=>{
								me.data.push(new IT.RecordStore(item));
							});							
							me.total_rows = data.total_rows;
							me.listener.fire("onLoad",[me, me.getData(true), me.params]);
						}
						else{
							me.empty();
							me.listener.fire("onError",[me,{status:false, message:"Format Data Tidak Sesuai"}]);
						}
					},
					error: function(){
						me.listener.fire("onError",[me,{status:false, message:"Data JSON '" + me.settings.url + "' Tidak Ditemukan"}]);
					},
					complete:function(){
						me.listener.fire("afterLoad",[me,me.getData()]);
					},
				});
			break;
			case "array":
				me.total_rows=0;
				if(!me.beforeLoad || (me.beforeLoad && me.listener.fire("beforeLoad",[me, me.data||[], null]))){
					if (typeof me.settings.data != 'undefined' ){
						$.each(me.settings.data ,(idx, item)=>{
							me.data.push(new IT.RecordStore(item));
							me.total_rows++;
						});
						me.listener.fire("onLoad",[me, me.getData(true), null]);
					}else{
						me.listener.fire("onError",[me,{status:false, message:"Data JSON '" + me.settings.url + "' Tidak Ditemukan"}]);
					}
					me.listener.fire("afterLoad",[me,me.getData()]);
				}else{
					me.empty();
					me.listener.fire("onError",[me,{status:false, message:"Format Data Tidak Sesuai"}]);
				}
			break;
		}
	}

	/**
	 * sort data
	 * @param  {string} field Sort by this field
	 * @param  {boolean} asc  Determine if order is ascending. true=Ascending, false=Descending
	 * @deprecated Deprecated, doesn't support ordering in front side
	 */
	sort(field,asc=true){
		throw "Deprecated, doesn't support ordering in front side"
	}
	/**
	 * Get parameter(s)
	 * @return {object} paramters
	 */
	getParams(){ return this.params; }

	/**
	 * Get Stored Data
	 * @param  {Boolean} sanitize wether return in raw or not, false = raw, true = sanitized
	 * @return {array}           expected data
	 */
	getData(){
		return this.data;
	}

	/**
	 * Get only changed data from raw
	 * @return {array}  array of record
	 */
	getChangedData(){
		let me=this,r = [];
		for(let idx in me.data){
			if(me.data[idx].changed)
				r.push($.extend({},me.data[idx].data,{indexRow: parseInt(idx) }));
		}
		return r;
	}

	/**
	 * Set stored Data
	 * @param {object} data replacement for data
	 */
	setData(data){ 
		let me=this;
		data = me.type=="json"?data.rows:data;
		me.empty();
		$.each(data ,(idx, item)=>{
			me.data.push(new IT.RecordStore(item));
			me.total_rows++;
		});
		me.listener.fire("onLoad",[me, me.data, me.params]);
	} 

	/**
	 * get generated settings
	 * @return {object}
	 */
	getSetting(){ return this.settings; }

	/**
	 * Change data
	 * @param  {Object} data     Updated data
	 * @param  {Number} indexRow index data to be changed
	 */
	replace(data={},indexRow=0){
		let me=this;
		for (let key in data) {
			me.data[indexRow].update(key,data[key]);
		}
	}
}