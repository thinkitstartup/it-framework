var IT= IT || class {};

var base_url = base_url || '';
var base_events = ["blur", "change", "click", "dblclick", "focus", "hover", "keydown", "keypress", "keyup", "show", "hide"];
var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
var animationEnd = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';

Array.prototype.remove = function(name, value) {  
    var rest = $.grep(this, function(item){    
        return (item[name] !== value);
    });
    this.length = 0;
    this.push.apply(this, rest);
    return this;
};

Array.prototype.insert = function (index, item) {
	this.splice(index, 0, item);
};

$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.fn.ajaxFileUpload = function(options) {
	var settings = {
		params: {},
		action: '',
		onStart: function() {},
		onComplete: function(response) {},
		onCancel: function() {},
		valid_extensions : ['gif','png','jpg','jpeg'],
		submit_button : null
	};

	var uploading_file = false;

	if (options){ $.extend( settings, options ); }

	return this.each(function() {
		var $element = $(this);
		if($element.data('ajaxUploader-setup') === true) return;
		
		$element.change(function(){
			uploading_file = false;
			if (settings.submit_button == null) upload_file();
		});

		if (settings.submit_button == null) {}
		else {
			settings.submit_button.click(function(){
				if (!uploading_file){
					upload_file();
				}
			});
		}
	
		var upload_file = function(){
			if($element.val() == '') return settings.onCancel.apply($element, [settings.params]);
			
			var ext = $element.val().split('.').pop().toLowerCase();
			if($.inArray(ext, settings.valid_extensions) == -1){
				settings.onComplete.apply($element, [{status: false, message: 'The select file type is invalid. File must be ' + settings.valid_extensions.join(', ') + '.'}, settings.params]);
			} else { 
				uploading_file = true;
				wrapElement($element);
				var ret = settings.onStart.apply($element);

				if(ret !== false){
					$element.parent('form').submit(function(e) { e.stopPropagation(); }).submit();
				}
			}
		};

		$element.data('ajaxUploader-setup', true);
		var handleResponse = function(loadedFrame, element) {
			var response, responseStr = loadedFrame.contentWindow.document.body.innerHTML;
			try {
				response = JSON.parse(responseStr);
			} catch(e) {
				response = responseStr;
			}
			element.siblings().remove();
			element.unwrap();

			uploading_file = false;
			settings.onComplete.apply(element, [response, settings.params]);
		};

		var wrapElement = function(element) {
			var frame_id = 'ajaxUploader-iframe-' + Math.round(new Date().getTime() / 1000)
			$('body').after('<iframe width="0" height="0" style="display:none;" name="'+frame_id+'" id="'+frame_id+'"/>');
			$('#'+frame_id).load(function() {
				handleResponse(this, element);
			});

			element.wrap(function() {
				return '<form action="' + settings.action + '" method="POST" enctype="multipart/form-data" target="'+frame_id+'" />'
			}).after(function() {
				var key, html = '';
				for(key in settings.params) {
					html += '<input type="hidden" name="' + key + '" value="' + settings.params[key] + '" />';
				}
				return html;
			});
		}
	});
}

$.fn.setCenter=function(params) {
	var defaults={
		topBottom:true,
		leftRight:true
	};
	var params=$.extend(defaults, params);
	var $p=params;
	return this.each(function(){
		var me=$(this);
		if($p.leftRight)
			me.css('left', ($(window).width() - $(this).outerWidth()) /2);
		if($p.topBottom)
			me.css('top', ($(window).height() - $(this).outerHeight()) /2);
	});
};

function makeid() {
	console.warn("deprecated soon. Use IT.Utils.makeid()");
    var text="IT-";
    var possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i=0; i<5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return "it-component-"+text;
}
;/**
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
};/**
 * Default Component CLass
 * @type {object}
 */
IT.Component = class extends IT.BaseClass {
	constructor(opt) {
		super(opt);
		let me = this;
		me._id = "";
		me.settings = {};
		me.content = null;
	}
	/**
	 * Render this Element to parentEl
	 * @param  {selector} parentEl selector for parent
	 */
	renderTo(parentEl) {
		if(this.content.appendTo)
			this.content.appendTo(domEl);
	}


	/**
	 * ID of component
	 * @name IT.Component#id
	 * @member {string}
	 */
	get id() {
		return this._id;
	}
	set id(id) {
		this._id = id;
	}

	/**
	 * get ID
	 * @return {string} Component ID
	 */
	getId() { return this.id; }

	/**
	 * get Content  selector 
	 * @return {selector} content
	 */
	getContent() { return this.content; }

	/**
	 * get generated settings
	 * @return {object}
	 */
	getSetting(){ return this.settings; }
};/**
 * Create window like dialogsssss
 * @class IT.Dialog
 * @param {Object} opt setting for class
 * @see IT.Dialog#settings
 */
IT.Dialog = class extends IT.Component {
	/** @param  {object} opt  */
	constructor(opt){
		super();
		let me = this;
		/** 
		 * Wether is element exists
		 * @member {boolean}
		 * @name IT.Dialog#elExists
		 */
		me.elExist = false;

		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.Dialog#settings
		 * @property {String} id ID of element
		 * @property {String} title title of the window
		 * @property {String} iconCls iconCls
		 * @property {array} items items
		 * @property {boolean} overlay overlay
		 * @property {boolean} autoShow autoShow
		 * @property {number} width width
		 * @property {number} height height
		 * @property {boolean} autoHeight autoHeight
		 * @property {object} css css
		 */
		me.settings = $.extend(true, {
			id: '',
			title: '',
			iconCls: '',
			items: [],
			overlay: true,
			autoShow: true,
			width: 300,
			height: 100,
            autoHeight: true,
			css:{}
		}, opt);

		/** 
		 * ID of class or element
		 * @member {boolean}
		 * @name IT.Dialog#id
		 */
		me.id = me.settings.id || IT.Utils.id();

		/** 
		 * Listeners
		 * @member {IT.Listener}
		 * @name IT.Dialog#listener
		 */
		me.listener = new Listener(me, me.settings,["onShow", "onHide", "onClose"]);
		me.createElement();
		if(me.settings.autoShow) me.show();
	}

	/**
	 * Create HTML Element
	 */
	createElement(){
		let me = this;
		me.content = $(`
			<div class="it-dialog">
				<div class="it-dialog-container">
					<div class="it-dialog-content"></div>
				</div>
			</div>
		`);

		if(me.settings.title) {
			let dialogTitle = $('<div/>', {
				class: 'it-title',
				html: me.settings.title
			});

			if(me.settings.iconCls) {
				let iconTitle = $('<span/>', { class:'fa fa-'+me.settings.iconCls });
				iconTitle.prependTo(dialogTitle);
			}
			me.content
				.find('.it-dialog-container')
				.prepend(dialogTitle);
		}

		if(!me.settings.overlay) {
			me.content.addClass("no-overlay");
		}
		
		$.each(me.settings.items, function(k, el) {
			if(el) {
				if(!el.isClass)el = IT.Utils.createObject(el);
				//console.info(el.isClass);
				if(el)el.renderTo(me.content.find('.it-dialog-content'));
				else console.warn("Xtype: undefined",obj);
			}
		});

		me.content
			.find('.it-dialog-container')
			.css({'max-width': me.settings.width});

		me.content
			.find('.it-dialog-content')
			.css($.extend(true, 
				me.settings.css, 
				me.settings.autoHeight ? { 'min-height' : me.settings.height } : { height: me.settings.height }
			));

		me.content.appendTo('body').hide();
		me.elExist = true;

		if(me.settings.autoShow) {
			me.show();
		}
	}
	
	/** show the dialog, crete DOMelement if not exist, then add show() */
	show() {
		let me=this;
		if(!me.elExist) me.createElement();
		me.content.show(0, function(){
			$(this).addClass('dialog-show');
			$(this).find('.it-dialog-container')
				.addClass('dialog-show');
		});
		me.listener.fire("onShow", [me, me.id]);

		$(window).resize(function() {
			me._autoScrollContainer();
		});
		me._autoScrollContainer();
	}
	
	/** hide the dialog, adding class display : none */
	hide() {
		let me = this;
		me.content
			.find('.it-dialog-container')
			.removeClass('dialog-show')
			.one(transitionEnd, function(){
				me.content.removeClass('dialog-show');
				me.listener.fire("onHide", [me, me.id]);
			});
	}

	/** close the dialog, and remove the DOMelement */
	close() {
		let me = this;
		me.content
			.find('.it-dialog-container')
			.removeClass('dialog-show')
			.one(transitionEnd, function(){
				me.content
					.removeClass('dialog-show')
					.one(transitionEnd, function(){
						setTimeout(() => {
							me.elExist = false;
							me.content.remove();
							me.listener.fire("onClose", [me, me.id]);	
						}, 300);
					})
			});
	}

	/** 
	 * Detection if the dialog height is wider than height of the window 
	 * then automatically make the container dialog has a scroll
	 * @private
	 */
	_autoScrollContainer() {
		let container = this.content.find('.it-dialog-container');
		let windowHeight = $(window).height();
		let calculate = windowHeight - (container.offset().top + container.outerHeight());
		
		if(calculate <= 20) {
			container.css({
				'overflow-y': 'scroll',
				height: (windowHeight - 30)
			});
		} else {
			container.css({
				'overflow-y': 'initial',
				height: 'auto'
			});
		}
	}
}
;/**
 * Form Component
 * @class IT.Form
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
			items:[]
		}, opt);

		/** 
		 * ID of class or element
		 * @member {boolean}
		 * @name IT.Form#id
		 */
		me.id = me.settings.id || makeid();
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
			class:"it-form"
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
*/;/**
 * CLass listener to handdle event function 
 */
class Listener {
	/**
	 * set the listeners
	 * @param  {function} scope scope where listeners lies
	 * @param  {object} option object of event function
	 * @param  {sting[]}  listen_enable	array of string to register
	 */
	constructor(scope,option,listen_enable=[]){
		let me =this;
		me.events={};
		me.scope=scope;
		listen_enable.forEach((a) => me.events[a]=option[a]);
	}

	/**
	 * apply a function listener with params
	 * @param  {sting} listener listener tobe called
	 * @param  {array} params   array of string to pass as argument listener
	 */
	fire(listener,params){
		var me=this;
		if(typeof me.events[listener]=="function"){
			me.events[listener].apply(me.scope,params);
		}
	}

	/**
	 * [set description]
	 * @param {scope} cls class scope
	 * @deprecated not used anymore
	 */
	set(cls){
		/*
		var ret = {};
		$.each( base_events, function( index, value ) {
			var value = value;
			var on = "on" + value.substring(0,1).toUpperCase() + value.substring(1,value.length).toLowerCase();

			ret[value]=function(){ b.trigger(value); }
			ret[on]=function(act){ me.add(on,act); }
			b.on(value, function(){
				me.fire(value,[],this);
				me.fire(on,[]);
			});
		});
		return ret;
		 */
	}
};IT.TextBox = class extends IT.Component {
	constructor(){
		console.info("hallo");
	}
};/**
 * Class Utils, all the members should static
 * @type {function}
 * @extends {IT.BaseClass}
 */
IT.Utils = class extends IT.BaseClass{
	/**
	 * @param  {object} opt option for class
	 */
	constructor(opt){
		super(opt);
	}

	/**
	 * createObject
	 * @param  {object} opt option for the class
	 * @return {class} function class
	 */
	static createObject(opt) {
		let xtype = opt.xtype||opt.x;
		let map = {
			button 	: "Button",
			toolbar	: "Toolbar",
			html	: "HTML",
			flex	: "Flex",
			panel	: "Panel",
			
			form	: "Form",
			textbox	: "TextBox",
			checkbox: "CheckBox",
			select  : "Select",

			grid	: "Grid",
			tabs    : "Tabs"
		}
		if(!IT[map[xtype]]) throw "Class IT."+map[xtype]+" not found";
		return map[xtype] && IT[map[xtype]]? new IT[map[xtype]](opt) : null;
	}

	/**
	 * create template literal
	 * @param  {string}    strings base template
	 * @param  {...object} keys    [object to be parsed]
	 * @return {template}            template
	 */
	static template(strings, ...keys) {
		return (function(...values) {
			var dict = values[values.length - 1] || {};
			var result = [strings[0]];
			keys.forEach(function(key, i) {
				var value = Number.isInteger(key) ? values[key] : dict[key];
				result.push(value, strings[i + 1]);
			});
			return result.join('');
		});
	}

	/**
	 * create random id with prefix "IT-"
	 * @return {string} string random id 
	 */
	static id(){
		var text="IT-";
		var possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for(var i=0; i<5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}

}