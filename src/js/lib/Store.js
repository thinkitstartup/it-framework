/**
 * Data Store
 * @extends IT.BaseClass
 * @type IT.Store
 * @param {Object} opt setting for class
 * @depend IT.BaseClass
 */
IT.Store = class extends IT.BaseClass {
	/** conctructor */
	constructor(opt){
		super(opt);

		let me =this;
		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.Store#settings
		 * @property {string} id ID of element
		 */
		me.settings = $.extend({
			type: 'json',
			url: '',
			//data: {},
			autoLoad:false,
			params:{
				start: 0,
				limit: 20
			}
		}, opt);
		me.params = me.settings.params;
		me.dataChanged = [];
		me.storeData = {rows:[],total_rows:0};
		me.listener = new IT.Listener(me, me.settings, [
			"beforeLoad",
			"onLoad",
			"onError",
		]);

		if (me.settings.autoLoad) me.load();
	}

	/**
	 * empty store data
	 */
	empty(){
		me.dataChanged=[];
		me.storeData={rows:[],total_rows:0};
		//me.events.fire("onLoad", [me.storeData, me.params]);
	}
	/**
	 * Load Data
	 * @param  {object} opt optional params
	 */
	load(opt){
		let me = this;
		var opt = opt || {};
		switch(me.settings.type){
			case "json":
				var params = $.extend(me.settings.params, opt.params);
				me.params = params;
				me.dataChanged=[];
				$.ajax({
					dataType: me.settings.type,
					type	: 'POST',
					url		: me.settings.url,
					data	: params,
					beforeSend: function(a,b){
						return me.listener.fire("beforeLoad",[me, a, b]);
					},
					success : function(data){
						if (typeof data.rows != 'undefined' && typeof data.total_rows != 'undefined'){
							me.storeData=data;
							me.listener.fire("onLoad",[me, me.storeData, me.params]);
						}
						else{
							me.storeData = {};
							me.listener.fire("onError",[me,{status:false, message:"Format Data Tidak Sesuai"}]);
						}
					},
					error: function(){
						me.listener.fire("onError",[me,{status:false, message:"Data JSON '" + me.settings.url + "' Tidak Ditemukan"}]);
					},
					complete:function(){
						me.listener.fire("afterLoad",[me,me.storeData]);
					},
				});
			break;
			case "array":
				me.listener.fire("beforeLoad",[me, a, b]);
				if (typeof me.settings.data.rows != 'undefined' && typeof me.settings.data.total_rows != 'undefined'){
					me.storeData = me.settings.data;
					me.listener.fire("onLoad",[me, me.storeData, me.params]);
				}else{
					me.listener.fire("onError",[me,{status:false, message:"Data JSON '" + me.settings.url + "' Tidak Ditemukan"}]);
				}
				me.listener.fire("afterLoad",[me,me.storeData]);
			break;
		}
	}

	/**
	 * FuncsearchData 
	 * @param  {string} key   field to search
	 * @param  {object} value value to be search
	 * @return {integer}       ifdex of storeData
	 */
	searchData(key, value){
		index = null;
		if(me.storeData.rows && me.storeData.rows.length>0){
			for (i = 0; i < me.storeData.rows.length; i++){
				if (me.storeData.rows[i][key] == value){
					index = i;
					break;
				}
			}
		}
		return index;
	}

	/**
	 * sort data
	 * @param  {string} field Sort by this field
	 * @param  {boolean} asc  Determine if order is ascending. true=Ascending, false=Descending
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
	 * @return {object} current data
	 */
	getData(){ return this.storeData; }

	/**
	 * Set stored Data
	 * @param {object} data replacement for storeData
	 */
	setData(data){ this.storeData = data; } 

	/**
	 * get generated settings
	 * @return {object}
	 */
	getSetting(){ return this.settings; }

	/*
	cekData(index, column, data){
		let me = this;
		if ($.trim(me.storeData.rows[index][column]) != $.trim(data))
		{
			rows = $.extend({indexRow: index}, me.storeData.rows[index]);
			if (me.searchData(me.dataChanged, 'indexRow', index) == null)
			{
				me.dataChanged.push(rows);
			}
			me.dataChanged[me.searchData(me.dataChanged, 'indexRow', index)][column] = data;
			me.events.fire("onChange", [{index: index, data: [me.dataChanged[me.searchData(me.dataChanged, 'indexRow', index)]]}]);
			return true;
		}else{
			if (me.searchData(me.dataChanged, 'indexRow', index) != null)
			{
				me.dataChanged[me.searchData(me.dataChanged, 'indexRow', index)][column] = data;
			}
			return false;
		}
	}
	*/
}