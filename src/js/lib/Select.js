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
