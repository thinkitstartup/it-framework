IT.Selectize = class extends IT.FormItem {
	constructor(settings){
		super(settings);
		let me = this,cls;
		me.settings = $.extend(true,{
			id: '',
			value: '',
			emptyText: '',
			format: null,
			defaultValue: '',
			autoLoad: true,
			allowBlank: true,
			disabled: false,
			width: 200,
			store: {
				url		: '',
				type	: 'array',
				data	: null,
			},
			selectize: {
				allowEmptyOption: true
			}
		}, settings);
		me.id = me.s.id || IT.Utils.id();
		me.input = $('<select />', {
			id: me.id,
			name: me.id,
			attr: {
				disabled: me.s.disabled,
			},
			val: me.s.defaultValue,
		});
		me.content = $('<div />', { class: 'it-edit' });
		me.content.append(me.input);
		me.input.selectize(me.s.selectize);

		if(me.s.width) {
			me.content.css({
				'width': me.s.width
			})
		}


		if(me.s.style) {
			me.content.css(me.s.style);
		}

		me.addEvents(me.s,[
			"onLoad",
			"onChange"
		]);
		
		me.getSelect().on("change",function(){
			me.doEvent("onChange",[me,me.val()]);
		});

		// If has value of empty text
		if(me.s.emptyText && !me.s.autoLoad) {
			me.getSelect().addOption({
				value: '',
				text: me.s.emptyText
			});
			me.getSelect().setValue('');
		}

		//setting store
		me.store = new IT.Store($.extend(true,{},me.s.store,{
			// replace autoLoad with false, we need extra event 'afterload'
			// wich is not created at the moment
			autoLoad:false 
		}));
		me.store.addEvents({// add extra afterload
			beforeLoad:function(){
				me.readyState = false;
			},
			afterLoad:function(ev,cls,data){
				data.forEach((obj)=>
					me.getSelect().addOption({ 
						value: obj.rawData.key, 
						text: obj.rawData.value, 
						params: typeof obj.rawData.params !== 'undefined' ? JSON.stringify(obj.rawData.params) : ''
					})
				);
				me.readyState = true;
			}
		}); 
		
		// If Autuload
		if(me.s.autoLoad) {
			me.getDataStore();
		}else me.readyState = true;
	}
	getDisplayValue(){
		let me = this;
		return me.getSelect().getItem(me.val())[0].innerHTML;
	}
 	setDataStore(store) {
		this.settings.store = store;
		this.dataStore();
	}
	getDataStore() {
		let me = this;
		let ds = me.s.store; 
		let selectize = me.getSelect();

		//Empty Option
		selectize.clearOptions();
		

		// If has value of empty text
		if(me.s.emptyText) {
			selectize.addOption({
				value: '',
				text: me.s.emptyText
			});
			selectize.setValue('');
		}
		me.store.load();
	}
	getSelect() {
		return this.input[0].selectize;
	}
	/**
	 * Override
	 * @param  {Optional} value Value to setter
	 * @return {String}   value for getter
	 */
	val(value) {
		if (typeof value === "undefined")
			return this.getSelect().getValue();
		else return this.getSelect().setValue(value);
	}
}
