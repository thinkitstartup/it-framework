/**
 * Grid system layout
 * @type {IT.Grid}
 * @extends IT.Component
 */
IT.Grid = class extends IT.Component {
	/** @param {object} opt */
	constructor(settings){
		super(settings);
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
			columnRule: '',
			rowContainer: '',
			css: {},
			items:[]
		}, settings);
		
		// set id
		me.id = me.settings.id || IT.Utils.id();

		if(me.settings.columnRule) {
			me.content = $('<div />', { 
				id: me.id, 
				class: me.settings.columnRule 
			});
		} else {
			me.content = $('<div/>', { 
				id: me.id, 
				class: 'row' 
			});
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
		if(me.settings.columnRule == '' && me.settings.rowContainer == 'fluid') {
			me.content = $('<div/>', { class:'container-fluid' }).append(me.content);
		} else if(me.settings.columnRule == '' &&  me.settings.rowContainer == 'standar') {
			me.content = $('<div/>', { class:'container' }).append(me.content);
		}
	}
}