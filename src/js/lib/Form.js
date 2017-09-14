/**
 * Form Component
 * @param {Object} opt setting for class
 * @see IT.Form#settings
 */
IT.Form = class extends IT.Component{
	constructor(opt){
		super(opt);
		let me=this;

		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.Form#settings
		 * @property {String} id ID of element
		 * @property {array} items Items
		 */
		me.settings = $.extend(true,{
			id: '',
			url:'',
			items:[]
		}, opt);

		/** 
		 * ID of class or element
		 * @member {boolean}
		 * @name IT.Form#id
		 */
		me.id = me.settings.id || IT.Utils.id();
		let wrapper = $('<div />', { 
			id: me.id, 
			class: 'container-fluid'
		});

		let count = 0,div;
		$.each(me.settings.items, function(k, el) {
			if(el){
				div = $("<div>",{class:'row'});
				if(!el.isClass)el = IT.Utils.createObject(el);
				el.renderTo(div);
				wrapper.append(div);
				count++;
			}
		});
		me.content= $("<form />",{
			name:IT.Utils.id(),
			class:"it-form",
			action: me.settings.url,
			target: me.settings.target
		});
		me.content.append(wrapper);
	}
}

/*
function Form(params){
	var settings=$.extend({
		method:'POST',
		id:'Fm',
		url:'',
		width: 'auto',
		fieldDefaults:{
			labelWidth:100,
			fieldType:'text'
		},
		items:[]
	},params);
	
	var me=this;
	var parrent=null;
	var konten='<form method="'+settings.method+'" action="'+settings.url+'" name="'+settings.id+'" id="'+settings.id+'" '+getStyle(settings)+' enctype="multipart/form-data"></form>';
	var $konten=$(konten);

	var nItems = {};
	if (settings.items.length > 0){
		var width = settings.width != 'auto' ? "width='"+settings.width+"'" : "";
		var itemsContainer = "<table class='it-table-form' "+width+"></table>";
		var $itemsContainer = $(itemsContainer);
		for (var i = 0; i < settings.items.length; i++){
			if (settings.items[i] === null)continue;
			var items = settings.items;
			var item = null;
			var tr = "<tr><td width='"+settings.fieldDefaults.labelWidth+"'>" + items[i].fieldLabel + "</td><td class='form-field' "+getStyle(settings.items[i])+"></td></tr>";
			$tr = $(tr);
			
			if (typeof items[i].renderTo == 'function'){
				items[i].renderTo($tr.find('.form-field'));
				item = items[i];
				nItems[item.getId()] = item;
			}else if (typeof items[i] == 'object' && items[i].xtype == 'container'){
				for (var x = 0; x < items[i].items.length; x++){
					item=createObject(items[i].items[x]);
					var opt = item.getSetting();
					
					var $wrap = $('<div class="it-form-container"/>');
					if (typeof opt.fieldLabel != 'undefined'){
						if (typeof items[i].labelWidth != 'undefined') $wrap.css("width", items[i].labelWidth);
						$wrap.css("padding", "0 10px");
						$wrap.html(opt.fieldLabel);
						$tr.find('.form-field').append($wrap);
					}
					if (typeof opt.itemWidth != 'undefined') { 
						$wrap.css("width", opt.itemWidth);
						item.renderTo($wrap);
						$tr.find('.form-field').append($wrap);
					}else{
						item.renderTo($tr.find('.form-field'));
					}

					nItems[item.getId()] = item;
				}
			}else if(typeof items[i] == 'object' && items[i].xtype != 'container'){
				item=createObject(items[i]);
				item.renderTo($tr.find('.form-field'));
				nItems[item.getId()] = item;
			}
			
			$tr.appendTo($itemsContainer);
		}
		$itemsContainer.appendTo($konten);
	}

	me.setData=function(data){
		$.each( data, function( key, value ) {
			if ($konten.find("#" + key).attr("type") != "file"){
				$konten.find("#" + key).val(value);
				$konten.find("#" + key).find("option").filter('[value="' + value + '"]').prop("selected", true);
				$konten.find("#" + key).prop("checked", (value == 1 ? true : false));
			}
		});
	}
	me.setInvalid=function(data){
		$.each( data, function( key, value ) {
			$konten.find("#" + key).wrap('<div class=\"it-infoBox\"/>');
			$konten.find("#" + key).parent().append('<div class=\"it-infoBox-message\"> ' + value + ' </div>');
			$konten.find("#" + key).parent().find(".it-infoBox-message").css('left', $konten.find("#" + key).outerWidth() + 10);
			$konten.find("#" + key).addClass('invalid');
		});
	}
	me.validasi=function(msg){
		var msg = typeof msg == 'undefined'?true:msg;
		var valid = true;
		$.each( nItems, function( i, item ) {
			var allowBlank = typeof item.getSetting().allowBlank != "undefined" ? item.getSetting().allowBlank : true;
			var minlength = typeof item.getSetting().minlength != "undefined" ? item.getSetting().minlength : 0;
			var id = item.getId();
			var obj = $("#" + id);
			var val = typeof obj.find("option:selected").val() != 'undefined' ? obj.find("option:selected").val() : obj.val();

			if (val == null) val = '';

			obj.removeClass("invalid");

			if (!allowBlank && val == "") { obj.addClass("invalid"); valid = false; }
			if (val != "" && val.length < minlength) { obj.addClass("invalid"); valid = false; }
		});

		if (valid == false && msg){
			new MessageBox({type:'critical',width:'400',title:'Peringatan',message:"Silahkan Lengkapi Kolom Berwarna Merah"});
		}

		return valid;
	}
	me.getItem=function(idx){
		return nItems[idx];
	}
	me.serializeObject=function(){
		return $konten.serializeObject();
	}
	me.renderTo=function(obj){
		$konten.appendTo(obj);
		parrent=obj;
	}

	me.getSetting=function(){ return settings; }
	me.getId=function(){ return id; }
	return me;
}
*/