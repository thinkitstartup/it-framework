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