var IT= IT || {};

var base_url = base_url || '';
var base_events = ["blur", "change", "click", "dblclick", "focus", "hover", "keydown", "keypress", "keyup", "show", "hide"];
var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
var animationEnd = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';

/**
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
}
/**
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
}
/**
 * [Button description]
 * @type {class}
 * @extends IT.Component
 * @depend IT.Component
 */
IT.Button = class extends IT.Component {
	constructor(params){
		super(params);

		let me = this;
		me.settings = $.extend(true, {
			id: '',
			buttonClass: '',
			iconClass: '',
			enable: true,
			enableDropdown: true, 
			text: 'Tombol',
			items:[],
			css: {}
		}, params);
		me.id = me.settings.id || IT.Utils.id();
		me.enable = me.settings.enable;
		me.listener = new IT.Listener(me, me.settings, ["onClick"]);
		
		let btn = $('<a/>', {
			id: me.id,
			html: me.settings.text,
			class: 'it-btn ' + me.settings.buttonClass,
			css: me.settings.css	
		});

		btn.click(function(e){
			if(me.enable){
				if (typeof me.settings.handler === 'function')
					me.settings.handler.call();
				me.listener.fire("onClick",[me, me.id]);
				e.stopPropagation();
			}
		});

		if(me.settings.iconClass) {
			let icon = $('<span/>', { 
				class: 'fa fa-'+me.settings.iconClass, 
				html: '&nbsp;'
			});
			btn.prepend(icon);
		}

		me.content = btn;

		if(!me.settings.enable) {
			me.setEnable(false);
		}

		if(me.settings.items.length) {
			let btnGroup = $('<div/>', { class: 'it-btn-group'} );
			btnGroup.append(me.content);
			let btnDropdown = new IT.Button({
				iconClass: 'angle-down',
				buttonClass: me.settings.buttonClass + ' btn-dropdown ',
				text: '',
				handler: function(){
					me.content.find('.menu-group').toggle();
					menuDropdown.removeClass('menu-reverse');
					if((menuDropdown.offset().top + menuDropdown.outerHeight()) > $(window).height()) {
						menuDropdown.addClass('menu-reverse');
					}
				}
			});
			btnDropdown.setEnable(me.settings.enableDropdown);
			btnDropdown.renderTo(btnGroup);

			let menuDropdown = $('<ul/>', { class:'menu-group' });
			$.each(me.settings.items, function(k, el) {
				if(el) {
					let li = $('<li/>', { class:'clearfix' });

					if (typeof el === 'string' ) {
						el = IT.Utils.createObject({
							xtype:'html',
							content: $('<div/>', { class: 'menu-group-separator' })
						});
					} else if(!el.isClass) { 
						el = $.extend(true, { xtype: 'button' }, el);
						el = IT.Utils.createObject(el);
					}
					
					el.renderTo(li);
					li.appendTo(menuDropdown);
				}
			});
			btnGroup.append(menuDropdown);
			me.content = btnGroup;
		}
	}

	renderTo(obj) {
		super.renderTo(obj);
		
		// hide dropdown menu if click outside the object
		if(this.settings.items.length) {
			$(document).click(function(e){
				if (!$(e.target).closest('.menu-group').length) {
					$('.menu-group').hide();
				}
			});
		}
	}

	setEnable(set) {
		this.enable = set;
		this.content[this.enable ?'removeClass':'addClass']('btn-disabled');
	}
}
/**
 * DataTable element
 * @extends IT.DataTable
 * @type IT.DataTable
 * @param {Object} opt setting for class
 * @see IT.Component#settings
 */
IT.DataTable = class extends IT.Component {
	/** @param  {object} opt  */
	constructor(opt){
		super(opt);
		let me = this;	
		


		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.DataTable#settings
		 * @property {string} id ID of element
		 */
		me.settings = $.extend(true,{
			id:"",
			cls: 'it-grid',
			width: '100%',
			height: '',
			cellEditing: true,
			wrap: false,
			paging:true,

			store: {
				type: 'json',
				params:{
					start: 0,
					limit: 20,
					orderBy: '',
					sortBy: ''
				}
			},
			columns: [{}],
			customHeader:""
		}, opt);

		/** 
		 * ID of class or element
		 * @member {boolean}
		 * @name IT.DataTable#id
		 */
		me.id = me.settings.id || IT.Utils.id();


		/**
		 * listeners
		 * @type {object}
		 */
		me.listener = new IT.Listener(me, me.settings, [
			"onItemClick",
			"onItemDblClick",
			"onLoad",
			"onChangePage"
		]);

		/**
		 * store data
		 * @member {boolean}
		 * @name IT.DataTable#store
		 * @see IT.Store
		 */
		if(!me.settings.store.isClass){
			me.store = new IT.Store($.extend(true, {
				onLoad:function(store,storeData,params){
					me.assignData(storeData);
					me.listener.fire("onLoad",[me,store]);
				}
			}, me.settings.store));
		}


		me.params = me.store.params;
		me.selectedRecord = null;
		me.selectedColumn = null;
		me.paging = {
			total_rows:0
		}
		me.createComponent();
	}

	createComponent(){
		let me =this,s = me.settings;
		//spaceimg='data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEHAAIALAAAAAABAAEAAAICVAEAOw==';
		
		//content .it-grid
		me.content = $('<div />', {
			id: me.id,
			class: s.cls 
		}).width(s.width).height(s.height);

		//wrapper
		let wrapper 	= $(`<div class="it-grid-wrapper"/>`);
		let fixHeader 	= $(`<div class="it-grid-fixed-header"/>`);
		let table 		= $(`<table width='${s.width}' height='${s.height}'/>`);
		let thead 		= $(`<thead/>`);
		let tbody 		= $(`<tbody/>`);
		me.content.append(wrapper.append(table.append(thead)));

		//create header
		if (s.customHeader) thead.append($(s.customHeader));
		else {
			let col, tr=$(`<tr/>`);
			for (let i = 0; i < s.columns.length; i++){
				col =s.columns[i];
				tr.append($(`<th />`,{
					css:{
						"min-width":col.width, 	// to precise width
						"width":col.width,		// to precise width
					}
				}).append(col.header))
			}
			thead.append(tr);
		}
		me.content.append(fixHeader.append(table.clone()));
		table.append(tbody);

		if(s.paging)
			me.content.append(`
				<div class="it-grid-pagination" >
					<ul>
						<li><button class="it-grid-icon" rel="first"><span class="fa fa-step-backward"></span></button></li>
						<li><button class="it-grid-icon" rel="back"><span class="fa fa-chevron-left"></span></button></li>
						<li> 
							<input type="text" class="it-grid-pagination-current" value="1"> /
						 	<span class="it-grid-pagination-page"></span>
						</li>
						<li><button class="it-grid-icon" rel="next"><span class="fa fa-chevron-right"></span></button></li>
						<li><button class="it-grid-icon" rel="last"><span class="fa fa-step-forward"></span></button></li>
						<li >
							Menampilkan
							<span class='it-grid-pagination-show'></span> 
							dari
							<span class='it-grid-pagination-count'></span> 
							Data
						</li>
					</ul>
					<div class='it-grid-pagination-info'></div>
				</div>
			`);
	}
	assignData(storeData){
		let me =this;
		if (storeData && storeData.rows) {
			me.content.find("tbody").empty();
			
			let total_rows = storeData.total_rows;
			let start = me.params.start;
			let limit = me.params.limit;
			let last_data = (start + limit) < total_rows ? (start + limit) : total_rows;
			let data_show = total_rows > 0 ? (start + 1) + "/" + last_data : "0";
			let page_count = Math.ceil(total_rows / limit);

			me.paging = {
				total_rows:total_rows,
				pageCount:page_count
			}

			me.content.find('.it-grid-pagination-show').html(data_show);
			me.content.find('.it-grid-pagination-count').html(total_rows);
			me.content.find('.it-grid-pagination-page').html(page_count);

			if (start == 0) 
				me.content.find('.it-grid-pagination-current').val(1);

			for (let k=0;k<storeData.rows.length;k++){	
				let current_row = storeData.rows[k];
				/*
				error_highlight = typeof current_row.errorRow == 'object' && current_row.errorRow.length > 0 ? "style='background:#ffeeee;'" : "";
				error_highlight = typeof current_row.isError != 'undefined' && current_row.isError == true ? "style='background:#ffeeee;'" : error_highlight;
				
				var $rows = "<tr " + error_highlight + ">";
				 */
				let row_element = $("<tr>");
				for (let i = 0; i < me.settings.columns.length; i++){
					let current_col = me.settings.columns[i];
					let data = current_row[me.settings.columns[i].dataIndex];
					data = !data ? "" : data;
					row_element.append($("<td />",{
						html:data,
						valign:current_col.valign ||"top",
						align:current_col.align ||"left",
						class:"" + (me.settings.wrap?"wrap":""),
					}));
					// var comboData = null;
					// var $value = "";
					// var editor = typeof current_col.editor != 'undefined' ? current_col.editor : null;
					// var dataIndex = settings.columns[i].dataIndex;

					// if ((editor != null && editor.xtype == 'combo') || typeof current_col.data != 'undefined') {
					// 	$value = " value='" + $data + "'";
					// 	comboData = typeof current_col.data != 'undefined' ? current_col.data : settings.columns[i].editor.data;
					// 	arrayIndex = null;
					// 	for (z = 0; z < comboData.length; z++){
					// 		if (comboData[z]['key'] == $data){
					// 			arrayIndex = z;
					// 			break;
					// 		}
					// 	}
					// 	$data = arrayIndex != null ? comboData[arrayIndex]['value'] : "";
					// 	$data = $data != "" && editor != null && typeof editor.format != 'undefined' ? editor.format.format(comboData[arrayIndex].key, comboData[arrayIndex].value) : $data;
					// }

					// if (editor != null && editor.xtype == 'check') {
					// 	$value = " value='1' ";
					// 	$checked = $data == 1 || $data == "Y" ? "checked" : "";
					// 	$data = " <input name='" + dataIndex + "[]' class='" + dataIndex + "' type='checkbox' " + $value + $checked + ">";
					// }
					

					/*

					$cssTD += current_row.errorRow == 'object' && current_row.errorRow.length > 0 && jQuery.inArray(dataIndex, current_row.errorRow) >= 0 ? "class='it-grid-error'" : "";
					
					
					var $img = typeof current_col.image != 'undefined' ? current_col.image : "";
					if ($img == true) $data = "<img src='" + $data + "' " + $cssTD + ">";
					$rows += "<td " + $cssTD + "><div"+ $value + $cssDiv +">" + $data + "</div></td>";
					*/
				}
				me.content.find("tbody").append(row_element);
			}
		}
	}

	renderTo(parent){
		super.renderTo(parent);
		let me = this;
		me.content.find('.it-grid-wrapper').scroll(function(){
			me.content.find('.it-grid-fixed-header').scrollLeft($(this).scrollLeft());
		});

	}
}
/**
 * Create window like dialog
 * @extends IT.Component
 * @depend IT.Component
 * 
 * @param {Object} opt setting for class
 * 
 * @see IT.Dialog#settings
 */
IT.Dialog = class extends IT.Component {
	/** @param  {object} opt  */
	constructor(opt){
		super(opt);
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
		me.listener = new IT.Listener(me, me.settings,["onShow", "onHide", "onClose"]);
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
*/
/**
 * base class for form item
 * @extends IT.Component
 * @type IT.FormItem
 * @param {Object} opt setting for class
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
}
/**
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
}
/**
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
}
/**
 * CLass listener to handdle event function 
 * @extends IT.BaseClass
 * @depend IT.BaseClass
 */
IT.Listener = class extends IT.BaseClass {
	/**
	 * set the listeners
	 * @param  {function} scope scope where listeners lies
	 * @param  {object} option object of event function
	 * @param  {sting[]}  listen_enable	array of string to register
	 */
	constructor(scope,option,listen_enable=[]){
		super();
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
			return me.events[listener].apply(me.scope,params);
		}
	}
}
IT.Select = class extends IT.Component {
	constructor(params){
		super(params);
		let me = this,cls;
		
		me.settings = $.extend(true,{ // Object.assign in deep
			id: '',
			value: 'Button',
			emptyText: '',
			format: null,
			defaultValue: '',
			autoLoad: true,
			allowBlank: true,
			disabled: false,
			width: 200,
			datasource: {
				type: 'array',
				url: '',
				data: null,
			},
			selectize: {
				allowEmptyOption: true
			}
		}, params);
		
		me.id = me.settings.id || makeid();

		me.select = $('<select />', {
			id: me.id,
			name: me.id,
			attr: {
				disabled: me.settings.disabled,
			},
			val: me.settings.defaultValue,
		});

		me.content = $('<div />', { class: 'it-edit' });
		me.content.append(me.select);
		me.select.selectize($.extend( true, me.settings.selectize ));

		if(me.settings.width) {
			me.content.css({
				'width': me.settings.width
			})
		}

		// If has value of empty text
		if(me.settings.emptyText) {
			me.getSelect().addOption({
				value: '',
				text: me.settings.emptyText
			});
		}

		// Jika Autuload OK 
		if(me.settings.autoLoad) {
			me.getDataSource();
		}
	}

	val(v) {
		if(typeof v === 'undefined') {
			this.getSelect().setValue(v);
		} else {
			this.getSelect().getValue();
		}
	}
	
 	setDataSouce(source) {
		this.settings.datasource = source;
		this.dataSource();
	}

	getDataSource() {
		let me = this;
		let ds = me.settings.datasource; 
		let selectize = me.getSelect();

		//Empty Option
		selectize.clear();

		// Type of Data Source array or ajax
		switch(ds.type) {
			case 'array' :
				if(typeof ds.data !== 'undefined' && ds.data.length > 0 ) { 
					$.each(ds.data, function(k, v){
						selectize.addOption({ 
							value: v.key, 
							text: v.value, 
							params: typeof v.params !== 'undefined' ? JSON.stringify(v.params) : ''
						}); 
					});
				}
				selectize.setValue(me.settings.defaultValue);
			break;
			case 'ajax' :
				$.ajax({
					url: ds.url,
					type: ds.method || "POST",
					data: ds.params || {},
					dataType: 'json',
					success: function(data) {
						var row = data.rows;
						if(typeof row !== 'undefined' && row.length > 0){
							$.each(row, function(k, v){
								selectize.addOption({ 
									value: v.key, 
									text: v.value, 
									params: typeof v.params !== 'undefined' ? JSON.stringify(v.params) : ''
								});
							});
						}
						selectize.setValue(me.settings.defaultValue);
					}
				});
			break;
		}
	}

	getSelect() {
		return this.select[0].selectize;
	}
}

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
IT.Tabs = class extends IT.Component {
	constructor(params){
		super(params);

		let me = this;
		me.settings = $.extend(true, {
			id: '',
			titles: {
				align: 'left',
				items:[]
			},
			items:[],
			defaultIndexActive: 0,
			height: 100,
			autoHeight: false
		}, params);

		me.id = me.settings.id || IT.Utils.id();
		me.ids = [];	
		me.content = $(`
			<div id="${me.id}" class="it-tabs">
				<ul class="it-tabs-menu ${me.settings.titles.align}"></ul>
				<div class="it-tabs-overflow">
					<span class="btn-overflow"><i class="fa fa-angle-down"></i></span>
					<ul class="menu-overflow"></ul>
				</div>
				<div class="it-tabs-container"></div>
			</div>`
		);
		me.content.css(me.settings.autoHeight ? 'min-height' : 'height', me.settings.height);

		// Loop judul tab
		$.each(me.settings.titles.items, function(k, v){
			let id = IT.Utils.id();
			let titleTab = $('<li/>', {
				class: 'it-tabs-link',
				html: v,
				attr: {
					'data-tab' : id,	
					'data-index' : k
				} 	
			});
			titleTab.appendTo(me.content.find('.it-tabs-menu'));
			titleTab.click(function(){
				me.setActive($(this).data('index'));
			});
			me.ids.push(id);
		});

		// Loop berdasarkan ids untuk membuat konten
		$.each(me.settings.items, function(k, el){
			if(el) {
				// Buat Div Tab konten
				let itemTab = $('<div/>', {
					class: 'it-tabs-content',
					id: me.ids[k]
				});

				if(!el.isClass)
						el = IT.Utils.createObject(el);
					el.renderTo(itemTab);

				itemTab.appendTo(me.content.find('.it-tabs-container'));
			}	
		});

		// Event dan Trigger untuk tombol overflow
		me.content.find('.btn-overflow').click(function(){
			$(this).next().toggle();
		});
	}
	renderTo(obj) {
		super.renderTo(obj);
		let me = this;
		$(window).resize(function() {
		   me._autoShowMore();
		});

		me._autoShowMore();
		me.setActive(me.settings.defaultIndexActive);
		
		// Still Bugs 
		setTimeout(() => {
			me._autoShowMore();
		}, 10);
	}

	setActive(index) {
		let cur, 
			me = this,
			el = me.content.find('.it-tabs-menu li').eq(index);
		if(el.length < 1) throw 'offset index';
		me.content.find(".tab-active").removeClass("tab-active");
		cur = el.addClass("tab-active");
		me.content.find('#'+cur.data('tab')).addClass('tab-active');
	}

	getActive() {
		let el = this.getContent().find('.it-tabs-menu li.tab-active');
		return {
			index: el.index(),
			content: el,
		}
	}

	_autoShowMore() {
		let me = this;
		let menuOverflow = me.content.find('.menu-overflow');
		menuOverflow.empty();	

		let menu = me.content.find('.it-tabs-menu li');
		menu.show();
		menu.each(function(){
			if(($(this).position().left + $(this).outerWidth()) > me.content.width()) {
				$(this).clone(true).appendTo(menuOverflow);
				$(this).hide();
			}
		});

		me.content.find('.it-tabs-overflow').toggle(menuOverflow.children('li').length > 0);
	}
}
/**
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
}
/**
 * [Toolbar description]
 * @extends IT.Component
 * @depend IT.Component
 */
IT.Toolbar = class extends IT.Component {
	constructor(params){
		super();
		let me =this,cls;
		me.settings = $.extend(true,{ // Object.assign in deep
			id: '',
			position: 'top',
			items:[]
		},params);
		me.id = me.settings.id||IT.Utils.id();
		me.content = $(`
			<div id="${me.id}" class="it-toolbar toolbar-${me.settings.position} clearfix">
				<ul class="it-toolbar-left"></ul>
				<ul class="it-toolbar-right"></ul>
			</div>
		`);
		me.ids=[];
		me.items={};
		$.each(me.settings.items, function(k, el) {
			if(el) {
				let li = $('<li/>');
				if(!el.isClass)
					el=IT.Utils.createObject(el);
				el.renderTo(li);
				me.content.find(`.it-toolbar-${el.getSetting().align||'left'}`).append(li);
				me.ids.push(el.getId());
				me.items[el.getId()] = el;
			}
		});
	}
	getItemCount(){
		return this.ids.length;
	}
	getItem(id){
		if(id)return this.items[id]||null;
		return this.items;
	}
}
/**
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
			button 		: "Button",
			toolbar		: "Toolbar",
			html		: "HTML",
			flex		: "Flex",
			panel		: "Panel",
			
			form		: "Form",
			textbox		: "TextBox",
			checkbox	: "CheckBox",
			select  	: "Select",

			grid		: "Grid",
			datatable	: "DataTable",
			tabs    	: "Tabs"
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


	/**
	 * check if value's in money format
	 * @param  {string}  value text to be checked
	 * @return {boolean}       return true if string is money
	 */
	static isMoney(value){
		var m = value.replace( /[$,]/g, "" ).replace(/\./g, "").replace(/,/g, ".").replace(/\%/g, "");
		return ! isNaN(m);
	}
	/**
	 * check if value's in date format
	 * @param  {string}  value text to be checked
	 * @return {boolean}       return true if string is date
	 */	
	static isDate(value){
		var d = new Date(value);
		return ! isNaN(d);
	}
}