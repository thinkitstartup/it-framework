IT.Grid = class extends IT.Component {
	constructor(params){
		super();
		let me = this;
		
		me.settings = $.extend(true,{ // Object.assign in deep
			id: '',
			type: 'row',
			columnRule: '',
			rowContainer: '',
			css: {},
			items:[]
		}, params);
		
		me.id = me.settings.id || makeid();

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
					el = createObject(el);
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