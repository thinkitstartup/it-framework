function Store(options){
	var settings = $.extend({
		type: 'json',
		url: '',
		data: {},
		params:{
			start: 0,
			limit: 20,
			orderBy: '',
			sortBy: ''
		}
	}, options);
	
	var me = this;
	me.events=new Event(me, settings);
	me.params = {};
	me.storeData = null;
	me.dataChanged = [];
	me.isSaved = false;

	me.beforeLoad=function(act){me.events.add("beforeLoad",act);}
	me.afterLoad=function(act){me.events.add("afterLoad",act);}
	me.completeLoad=function(act){me.events.add("completeLoad",act);}
	me.onLoad=function(act){me.events.add("onLoad",act);}
	me.onError=function(act){me.events.add("onError",act);}
	me.onChange=function(act){me.events.add("onChange",act);}

	me.empty = function(){
		me.dataChanged=[];
		me.storeData={rows:[],total_rows:0};
		me.events.fire("onLoad", [me.storeData, me.params]);
	}


	me.load = function(opt){
		$('#loading').show();

		me.events.fire("beforeLoad",[me.storeData]);

		var opt = opt || {};
		switch(settings.type){
			case "json":
				var params = $.extend(settings.params, opt.params);
				me.params = params;
				me.dataChanged=[];
				$.ajax({
					type: 'POST',
					url: settings.url,
					data: params,
					success: function(data){
						if (typeof data.rows != 'undefined' && typeof data.total_rows != 'undefined'){
							me.storeData=data;
							me.events.fire("onLoad", [me.storeData, me.params]);
						}
						else{
							me.storeData = {};
							me.events.fire("onError", [{status:false, message:"Format Data Tidak Sesuai"}]);
						}
					},
					error: function(){me.events.fire("onError", [{status:false, message: "Data JSON '" + settings.url + "' Tidak Ditemukan"}]);},
					complete:function(){me.events.fire("afterLoad",[me.storeData]);me.events.fire("completeLoad",["satu","dua"]);},
					dataType: settings.type
				});
			break;
			case "array":
				if (typeof settings.data.rows != 'undefined' && typeof settings.data.total_rows != 'undefined'){
					me.storeData = settings.data;
					me.events.fire("onLoad", [me.storeData, me.params]);
				}else{
					me.events.fire("onError", [{status:false, message: "Data JSON Tidak Ditemukan"}]);
				}
				me.events.fire("afterLoad",[me.storeData]);
				me.events.fire("completeLoad",["satu","dua"]);
			break;
		}
	}
	if (settings.autoLoad) me.load();
	me.searchData = function(data, key, value){
		index = null;
		for (i = 0; i < data.length; i++){
			if (data[i][key] == value){
				index = i;
				break;
			}
		}
		return index;
	}
	var isMoney = function ( value ) {
		var m = value.replace( /[$,]/g, "" ).replace(/\./g, "").replace(/,/g, ".").replace(/\%/g, "");
		return ! isNaN(m);
	}
	var isDate = function ( value ) {
		var d = new Date(value);
		return ! isNaN(d);
	}
	me.sort = function(prop, asc){
		var asc = asc;
		var prop = prop;
		me.storeData.rows = me.storeData.rows.sort(function(a, b) {
			var valueA = a[prop];
			var valueB = b[prop];
			if ( ! isNaN(valueA) && ! isNaN(valueB) ) {
				valueA = parseFloat(valueA);
				valueB = parseFloat(valueB);
			} else if ( isDate(valueA) && isDate(valueB) ) {
				valueA = new Date(valueA);
				valueB = new Date(valueB);
			} else if ( isMoney(valueA) && isMoney(valueB) ) {
				valueA = parseFloat(valueA.replace( /[$,]/g, "" ).replace(/\./g, "").replace(/,/g, ".").replace(/\%/g, ""));
				valueB = parseFloat(valueB.replace( /[$,]/g, "" ).replace(/\./g, "").replace(/,/g, ".").replace(/\%/g, ""));
			}

			if (asc == 'Y') return (valueA > valueB);
			else return (valueB > valueA);
		});

		me.events.fire("onLoad", [me.storeData, me.params]);
	}
	me.getParams = function(){ return me.params; }
	me.getData = function(){ return me.storeData; }
	me.setData = function(d){ settings.data = d; } 
	me.getSetting = function(){ return settings; }
	me.cekData = function(index, column, data){
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
	
	return me;
}