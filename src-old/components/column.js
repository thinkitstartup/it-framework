function Column(params){
	var settings=$.extend({
		columns:[]
	},params);
	
	var me=this;
	var parrent=null;
	var konten = '<table width="100%" '+getStyle(settings)+'><tr></tr></table>';
	var $konten=$(konten);
	
	for (var c = 0; c < settings.columns.length; c++){
		var $td = $("<td></td>");
		for (var i = 0; i < settings.columns[c].items.length; i++){
			if (items[i] === null)continue;

			var items = settings.columns[c].items;
			var item = null;
			if (typeof items[i].renderTo == 'function'){
				item=items[i];
			}else if(typeof items[i] == 'object'){
				item=createObject(items[i]);
			}
			
			item.renderTo($td);
		}
		$konten.find('tr').append($td);
	}

	me.renderTo=function(obj){
		$konten.appendTo(obj);
		parrent=obj;
	}
	me.getSetting=function(){ return settings; }
	return me;
}