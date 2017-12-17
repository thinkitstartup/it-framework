var IT= IT || {};
var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
(function($){
	$.fn.serializeObject = function () {
		var result = {};
		var extend = function (i, element) {
			var node = result[element.name];
			if (typeof node !== 'undefined' && node !== null) {
				if ($.isArray(node)) node.push(element.value);
				else result[element.name] = [node, element.value];
			} else result[element.name] = element.value;
		};
		$.each(this.serializeArray(), extend);
		return result;
	};
})(jQuery);
/**
 * Class
 * @type {class}
 */
IT.BaseClass = class {
	constructor(settings) {
		let me = this;
		me._id = "";//private

		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.Component#settings
		 */
		me.settings = settings||{};
	}

	get className(){
		return this.classname || this.settings.xtype || this.settings.x || undefined;
	}

	/**
	 * used to check if this is a class
	 * @type {boolean}
	 */
	get isClass(){
		return true;
	}
	/**
	 * addEvents to the the class
	 * @param  {option} object of functions 
	 * @param  {events_available} array array of string. Can be act as event available
	 */
	//https://stackoverflow.com/questions/23344625/create-javascript-custom-event
	addEvents(option,listen_enable=[]){
		let me=this;
		if (listen_enable.length==0){
			Object.keys(option).forEach((e)=>
				typeof option[e]=="function"
					?listen_enable.push(e)
					:null
			);
		}
		let sel = option.selector || $(me);
		//sel = (typeof sel.on=="function")?sel:$(sel);
		listen_enable.forEach((event) =>
			sel.on(
				event, 
				(option[event]||IT.Utils.emptyFn)
			)
		)
	}
	/**
	 * Call event from available events.
	 * @param  {event} string of the event to be called
	 * @param  {params} array array of argument to be passed
	 */
	doEvent(event,params){
		$(this).trigger(event,params);
	}
	/**
	 * Clear all available events.
	 * @param  {option} object of functions 
	 */
	clearEvents(option={}){
		let sel = option.selector || $(this).off();
	}

	/**
	 * Shorthand for this.settings;
	 * @returns {object} setting object
	 */
	get s(){
		return this.settings;
	}
}
/**
 * [Button description]
 * @type {class}
 * @extends IT.Component
 */
IT.Button = class extends IT.Component {
	constructor(params){
		super(params);

		let me = this;
		me.settings = $.extend(true,{
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
		//me.listener = new IT.Listener(me, me.settings, ["onClick"]);
		me.addEvents(me.settings, ["onClick"]);


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
				//me.listener.fire("onClick",[me, me.id]);
				me.doEvent("onClick",[me, me.id]);
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

	setText(text){
		let me=this;
		me.content.html(text);
	}
}