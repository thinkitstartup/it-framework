IT.SelectIT = class extends IT.FormItem {
	constructor(settings) {
		super(settings);
		let me = this, cls;
		me.settings = $.extend(true, {
			
		}, settings);
		me.id = me.settings.id || IT.Utils.id();
		me.input = $('<select />', {
			id: me.id,
			class: 'select',
			attr: {
				name: me.settings.name || me.id,
				disabled: me.settings.disabled,
			}
		});
		me.content = $(`
			<div class="it-select">
				<div class="it-select-wrap">
					<input type="text" class="it-select-search"/>
					<div class="it-select-dropdown-button"><i class="fa fa-chevron-down"></i></div>
				</div>
				<ul class="it-select-dropdown"></ul>
				<input type="hidden" class="it-select-value"/>
			</div>
		`);
		//me.content.append(me.input);
		me.searchInput = me.content.find("input");
		me.content.find(".it-select-wrap").click((e)=>{
			me.content.find('.it-select-dropdown').toggle();
			e.stopPropagation();
			e.preventDefault();
		});
		// //me.content.append(me.input);
		// me.content=$(((me.settings.label) ? `<div class="${me.settings.size.label}">`+
		// 	`<label for="${me.id}-item" class='it-input-label it-input-label-${me.settings.labelAlign||'left'}'>${me.settings.label}</label>`+
		// `</div>`:"") + `<div class="${me.settings.size.field}"></div>`);
		// me.content.last().append(me.input);

		// if(me.settings.width) {
		// 	me.content.css({
		// 		'width': me.settings.width
		// 	})
		// }

		// if(me.settings.withRowContainer) {
		// 	me.content = $('<div/>', { class:'row'}).append(me.content);
		// }

		// me.addEvents(me.settings,[
		// 	"onLoad",
		// 	"onChange"
		// ]);

		// me.input.on("change",function(){
		// 	me.doEvent("onChange",[me,me.val()]);
		// });

		// // If has value of empty text
		// if(me.settings.emptyText && !me.settings.autoLoad) {
		// 	me.input.append($('<option/>', {
		// 		val: '',
		// 		text: me.settings.emptyText
		// 	}));
		// }

		// //setting store
		// me.store = new IT.Store($.extend(true,{},me.settings.store,{
		// 	// replace autoLoad with false, we need extra event 'afterload'
		// 	// wich is not created at the moment
		// 	autoLoad:false 
		// }));
		// me.store.addEvents({// add extra afterload
		// 	beforeLoad:function(){
		// 		me.readyState = false;
		// 	},
		// 	afterLoad:function(ev,cls,data){
		// 		data.forEach((obj)=> {
		// 			me.input.append($('<option/>', {
		// 				val: obj.rawData.key,
		// 				text: obj.rawData.value,
		// 				attr: {
		// 					'data-params' : (typeof obj.rawData.params !== 'undefined' ? JSON.stringify(obj.rawData.params) : '')
		// 				}
		// 			}));
		// 		});
		// 		me.readyState = true;
		// 	}
		// }); 

		// // If Autuload
		// if(me.settings.autoLoad) {
		// 	me.getDataStore();
		// }else me.readyState = true;
	}
	// getDisplayValue(){
	// 	let me = this;
	// 	return me.getSelect().getItem(me.val())[0].innerHTML;
	// }
	// setDataStore(store) {
	// 	this.settings.store = store;
	// 	this.dataStore();
	// }
	// getDataStore() {
	// 	let me = this;
	// 	let ds = me.settings.store; 

	// 	me.input.empty();

	// 	// If has value of empty text
	// 	if(me.settings.emptyText) {
	// 		me.input.append($('<option/>', {
	// 			val: '',
	// 			text: me.settings.emptyText
	// 		}));
	// 	}
	// 	me.store.load();
	// }

	// /**
	//  * Override
	//  * @param  {Optional} value Value to setter
	//  * @return {String}   value for getter
	//  */
	// val(value) {
	// 	if (typeof value === "undefined")
	// 		return this.input.val();
	// 	else return this.input.val(value);
	// }
}
