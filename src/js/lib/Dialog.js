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
		 * @property {boolean} cancelable cancelable
		 * @property {object} css css
		 */
		me.settings = $.extend(true,{
			id: '',
			title: '',
			iconCls: '',
			items: [],
			footers:[],
			overlay: true,
			autoShow: true,
			width: 300,
			height: 100,
            autoHeight: true,
            cancelable: false,
			css:{}
		}, opt);

		/** 
		 * ID of class or element
		 * @member {boolean}
		 * @name IT.Dialog#id
		 */
		me.id = me.settings.id || IT.Utils.id();

		me.addEvents(me.settings, [
		 	"onShow", 
		 	"onHide", 
		 	"onClose"
		]);

		me.ids=[];
		me.items={};
		if(me.settings.autoShow) me.show();
		else me.createElement();
	}

	/**
	 * Create HTML Element
	 */
	createElement(){
		let me = this;
		if(me.elExist) return;
		me.content = $(`
			<div class="it-dialog">
				<div class="it-dialog-container">
					<div class="it-dialog-header"></div>
					<div class="it-dialog-content"></div>
					<div class="it-dialog-footer"></div>
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
				.find('.it-dialog-header')
				.append(dialogTitle);
		}

		if(!me.settings.overlay) {
			me.content.addClass("no-overlay");
		}
		
		$.each(me.settings.items, function(k, el) {
			if(el) {
				if(!el.isClass) el = IT.Utils.createObject(el);
				el.renderTo(me.content.find('.it-dialog-content'));
				me.ids.push(el.getId());
				me.items[el.getId()] = el;
			}
		});

		$.each(me.settings.footers, function(k, el) {
			if(el) {
				if(!el.isClass) el = IT.Utils.createObject(el);
				el.renderTo(me.content.find('.it-dialog-footer'));
				me.ids.push(el.getId());
				me.items[el.getId()] = el;
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
		if(me.settings.cancelable) {
			me.content.find('.it-dialog-container').click(function(e){
				e.stopPropagation();
			})
			me.content.click(function(){
				me.close();
			});
		}
	}
	
	getItemCount(){
		return this.ids.length;
	}
	getItem(id){
		if(typeof id==="number")id = this.ids[id];
		if(id)return this.items[id]||null;
		return this.items;
	}

	/** show the dialog, crete DOMelement if not exist, then add show() */
	show() {
		let me=this;
		me.createElement();
		me.content.show(0, function(){
			$(this).addClass('dialog-show');
			$(this).find('.it-dialog-container')
				.addClass('dialog-show');
		});
		me.doEvent("onShow",[me, me.id]);

		$(window).resize(function() {
			clearTimeout(window.resizedFinished);
			window.resizedFinished = setTimeout(function(){
				me.setScroll();
			}, 500);
		});
		$(window).trigger("resize");
	}
	
	/** hide the dialog, adding class display : none */
	hide() {
		let me = this;
		me.content
			.find('.it-dialog-container')
			.removeClass('dialog-show')
			.one(transitionEnd, function(){
				me.content.removeClass('dialog-show');
				me.doEvent("onHide",[me, me.id]);
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
							me.doEvent("onClose",[me, me.id]);
						}, 700);
					})
			});
	}

	/** 
	 * Detection if the dialog height is wider than height of the window 
	 * then automatically make the container dialog has a scroll
	 * @private
	 */
	setScroll() {
		let me = this,
		container = me.content.find('.it-dialog-container');
		container.height($(window).height() <= me.content.find('.it-dialog-content').height() ? ($(window).height() - 50) : 'auto');
	}
}