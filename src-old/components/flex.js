IT.Flex = class extends IT.Component {
	constructor(params){
		super();
		let me =this;
		
		me.settings = $.extend(true,{ // Object.assign in deep
			id: '',
			direction: 'row',
			wrap: '',
			justifyContent: '',
			alignItems: '',
			alignContent: '',
			items:[]
		}, params);
		
		me.id = me.settings.id || makeid();
		me.content = $('<div />', { id: me.id, class: 'it-flex' });
		me.content.addClass('it-flex-dir dir-' + me.settings.direction);
		me.content.addClass('it-flex-wrap wrap-' + me.settings.wrap);
		me.content.addClass('it-flex-jc jc-' + me.settings.justifyContent);
		me.content.addClass('it-flex-ai ai-' + me.settings.alignItems);
		me.content.addClass('it-flex-ac ac-' + me.settings.alignContent);

		$.each(me.settings.items, function(k, el) {
			if(el) {
				if(typeof el.renderTo !== 'function')
					el = createObject(el);

				if(typeof el.settings.flex !== 'undefined') 	
					el.content.addClass('it-flex-item');

				el.renderTo(me.content);
			}
		});
	}
}