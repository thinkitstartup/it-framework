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

		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.Component#settings
		 */
		me.settings = opt||{};


		me.content = null;
	}
	/**
	 * Render this Element to parentEl
	 * @param  {selector} parentEl selector for parent
	 */
	renderTo(parentEl) {
		if(this.content.appendTo)
			this.content.appendTo(parentEl);
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
 * Create window like dialog
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
 * base class for form item
 * @extends IT.Component
 * @type IT.FormItem
 * @class IT.FormItem
 * @param {Object} opt setting for class
 * @see IT.Component#settings
 */
IT.FormItem = class extends IT.Component {
	/** @param  {object} opt  */
	constructor(opt){
		super(opt);
	}
	/**
	 * getter or setter for value
	 * @param  {object} value if value is exist, then it's setter for value
	 * @return {object}   value of this item, return true if setter success
	 * @example
	 * var a = new IT.TextBox();
	 * a.renderTo($(body))
	 * a.val("this is the val") // setter
	 * console.info(a.val()); // getter
	 */
	val(value) {
		if (typeof value === "undefined")
			return this.input.val(); 
		else return this.input.val(value);
	}

	/** 
	 * if state is true, mark the input with border red
	 * @param {Boolean} state pass true to make this item invalid
	 */
	setInvalid(state=true){
		this.input[state?"addClass":"removeClass"]("invalid");
	}

	/** return true if valid */
	validate(){
		return !(!this.settings.allowBlank && this.val()==""); 
	}

	/** 
	 * whether set this item readonly or not
	 * @param {Boolean} state pass true to make this item readonly
	 */
	setReadonly(state=false){
		this.input.attr('readonly', state)
			[state?"addClass":"removeClass"]('input-readonly');
	}
	/** 
	 * whether set this item enabled or not
	 * @param {Boolean} state pass true to make this item invalid
	 */
	setEnabled(state=false){
		this.input.attr('disabled', !state)
			[!state?"addClass":"removeClass"]('input-disabled');
	}
};/**
 * Grid system layout
 * @type {IT.Grid}
 * @extends IT.Component
 */
IT.Grid = class extends IT.Component {
	/** @param {object} opt */
	constructor(params){
		super(params);
		let me = this;
	
		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.Grid#settings
		 * @property {String} id id the classs
		 * @property {enum} type : [row, colomn]
		 * @property {string} columnRule any 12 bootstrap grid system. ex : "col-sm-12", "col-md-8"
		 * @property {object} css style for this item
		 */
		me.settings = $.extend(true,{ 
			id: '',
			type: 'row',
			columnRule: '',
			rowContainer: '',
			css: {},
			items:[]
		}, params);
		
		// set id
		me.id = me.settings.id || IT.Utils.id();

		if(me.settings.type == 'row') {
			me.content = $('<div/>', { 
				id: me.id, 
				class: 'row' 
			});
		} else if(me.settings.type == 'column') {
			me.content = $('<div />', { 
				id: me.id, 
				class: me.settings.columnRule 
			});
		} else {
			console.info('Grid hanya mempunyai 2 type : row atau column');
			me.content = '';
			return;
		}
		
		// Set CSS ke objek
		me.content.css(me.settings.css); 

		// Looping semua yang ada di items
		$.each(me.settings.items, function(k, el) {
			if(el) {
				if(typeof el.renderTo !== 'function')
					el = IT.Utils.createObject(el);
				el.renderTo(me.content);
			}
		});

		// Berikan Container
		if(me.settings.type == 'row' && me.settings.rowContainer == 'fluid') {
			me.content = $('<div/>', { class:'container-fluid' }).append(me.content);
		} else if(me.settings.type == 'row' &&  me.settings.rowContainer == 'standar') {
			me.content = $('<div/>', { class:'container' }).append(me.content);
		}
	}
};/**
 * HTML Class. Standar dom class.
 * @type IT.HTML
 * @extends IT.Component
 */
IT.HTML = class extends IT.Component{
	/** @param {object} opt */
	constructor(params){
		super(params);
		let me = this;

		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.HTML#settings
		 * @property {string} id id the classs
		 * @property {string} url if url given, HTML will load data from url then append it content to this content
		 * @property {string} content content to be shown
		 * @property {object} css style for this item
		 * @property {string} class append this string to attribute class
		 */
		me.settings = $.extend(true, { // Object.assign in deep
			id: '',
			url: '',
			content: '', 
			css: {},
			class:""
		},params);
		
		me.id = me.settings.id||IT.Utils.id();
		me.content = $('<div/>', {id: me.id});
		if(me.settings.class)
			me.content.addClass(me.settings.class);
		me.content.css(me.settings.css);
		
		if(me.settings.url)
			me.content.load(me.settings.url);
		else 
			me.content.html(me.settings.content);
	}

	/**
	 * set the desire content to HTML
	 * @param {string|selector}  html    the content that'll be replaced to
	 * @param {Boolean} replace replace mode, if set true, before appending, this content will be empty before
	 */
	setContent(html, replace = false){
		if (replace) this.content.empty();
		if (typeof html=="string") this.content.append(html);
		else html.appendTo(this.content);
	}
};/**
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
};/**
 * TextBox Component
 * @type {Class}
 * @extends IT.FormItem
 */
IT.TextBox = class extends IT.FormItem {
	/** @param {object} opt */
	constructor(opt){
		super(opt);
		let me=this,s;

		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.TextBox#settings
		 * @see https://github.com/RobinHerbots/Inputmask/blob/4.x/dist/jquery.inputmask.bundle.js
		 * 
		 * @property {enum} available : [textarea, text, mask]
		 * @property {int} cols how many coloms char, only used for type textarea
		 * @property {int} rows how many rows char,only used for type textarea
		 * @property {Object} maskSettings maskSettings:{}, // only used for type mask
		 * @property {String} id id the classs
		 * @property {String} label set label description
		 * @property {String} name name for the input, < input type='type' > name="xxx">
		 * @property {boolean} allowBlank set the input weather can be leave blank or not
		 * @property {String} value value for input
		 * @property {String} placeholder placeholder for input
		 * @property {boolean} readonly set wather this comp readonly or not
		 * @property {boolean} enabled set wather this comp enabled or not
		 * @property {object} length how many char can be accepted
		 * @property {int} length.min minimal char length 
		 * @property {int} length.max maximal char length 		 
		 * @property {object} size in column grid system by bootstrap
		 * @property {string} size.field size for field input
		 * @property {string} size.label size for label input		 
		 * @property {object} info extra div for estra input
		 * @property {string} info.prepend info before input
		 * @property {string} info.append info after input
		 * @example
		 * var a = new IT.TextBox({
		 *    info:{
		 *        prepend:"Rp. ",
		 *        append:"-,.",
		 *    }
		 * });
		 * a.renderTo($(body));
		 *
		 * @example
		 * 
		 * //input type mask, numeric
		 * {
		 * x:"textbox",
					type:"mask",
					label:"masukan nama",
					placeholder:"masukan nama",
					allowBlank:false,
					info:{
						prepend:"Rp. ",
						append:"-,."
					},
					maskSettings:{
						groupSeparator: ".",
						radixPoint: "",
						alias: "numeric",
						placeholder: "0",
						autoGroup: !0,
						digits: 2
					},

				}
		 */
		me.settings = $.extend(true, {
			x:"textbox",
			type:'text',
			cols:19, 
			rows:5, 
			maskSettings:{}, 
			id:"", 
			label:"", 
			name:"", 
			allowBlank: true, 
			value:"", 
			placeholder: '', 
			readonly:false, 
			enabled:true, 
			length:{
				min:0, 
				max:-1,
			},
			size:{
				field:"col-sm-8",
				label:"col-sm-4"
			},
			info: {
				prepend: '',
				append: ''
			}
		}, opt);
		s= me.settings;

		// set id
		me.id = s.id||IT.Utils.id();

		//if label empty, field size is 12
		if(s.label=="")
			s.size.field = "col-sm-12";

		//create input
		switch(s.type){
			case 'textarea':
				me.input = $(`<textarea style='resize: none;' id="${me.id}-item" `+
					`class='it-edit-input' `+
					`${s.allowBlank==false?`required`:""} `+
					`cols='${s.cols}' `+
					`rows='${s.rows}' `+
					`${s.readonly?` readonly `:""} `+
					`${s.enabled==false?` disabled `:""} `+
					`name='${me.settings.name||IT.Utils.id()}' `+
					`${s.length.min>0?`minlength='${s.length.min}'`:""} `+
					`${s.length.max>0?`maxlength='${s.length.max}'`:""} `+
				`>${s.value?`${s.value}`:""}</textarea>`);
			break;
			case 'text':
			case 'mask':
				me.input = $(`<input id="${me.id}-item" `+
					`type='text' `+
					`class='it-edit-input' `+
					`name='${me.settings.name||IT.Utils.id()}' `+
					`${s.length.min>0?`minlength='${s.length.min}'`:""} `+
					`${s.length.max>0?`maxlength='${s.length.max}'`:""} `+
					`${s.allowBlank==false?`required`:""} `+
					`${s.readonly?` readonly `:""} `+
					`${s.enabled==false?` disabled `:""} `+
					`${s.placeholder?`placeholder='${s.placeholder}'`:""} `+
					`${s.value?`value='${s.value}'`:""} `+
				`>`);
				if (s.type =="mask") //input type mask
					me.input.inputmask(s.maskSettings||{});
			break;
			default:console.error("input type unknown : "+ s.type); break;
		}

		// event
		me.input.on("focus change blur",function(e){
			me.setInvalid(!me.validate());
		});

		//wrapper
		let wraper = $("<div class='it-edit' />").append(me.input);

		//info
		s.info.prepend && wraper.prepend($('<div />', {
			class: 'it-edit-item',
			html: s.info.prepend
		}));
		s.info.append && wraper.append($('<div />', {
			class: 'it-edit-item',
			html: s.info.append
		}));

		//content
		me.content=$(((s.label) ? `<div class="${s.size.label}">`+
			`<label for="${me.id}-item" class='it-input-label it-input-label-${s.labelAlign||'left'}'>${s.label}</label>`+
		`</div>`:"") + `<div class="${s.size.field}"></div>`);
		me.content.last().append(wraper);
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