import FormItem from "./FormItem";
import Utils from "./Utils";
import Store from "./Store";

export default class Select extends FormItem {
	constructor(settings) {
		super(settings);
		let me = this, cls;

		me.settings = $.extend(true, {
			id: '',
			value: '',
			emptyText: '',
			format: null,
			defaultValue: '',
			autoLoad: true,
			allowBlank: true,
			disabled: false,
			withRowContainer: false,
			width: 200,
			store: {
				url: '',
				type: 'array',
				data: null,
			},
			size: {
				field: "col-md-8",
				label: "col-md-4"
			},
		}, settings);
		me.id = me.settings.id || Utils.id();

		me.input = $('<select />', {
			id: me.id,
			name: me.s.name,
			class: 'it-edit-input',
			attr: {
				disabled: me.settings.disabled,
			},
			val: me.settings.defaultValue,
		});

		//me.content = $('<div />', { class: 'it-edit' });
		//me.content.append(me.input);
		me.content = $(((me.settings.label) ? `<div class="${me.settings.size.label}">` +
			`<label for="${me.id}-item" class='it-input-label it-input-label-${me.settings.labelAlign || 'left'}'>${me.settings.label}</label>` +
			`</div>` : "") + `<div class="${me.settings.size.field}"></div>`);
		me.content.last().append(me.input);

		if (me.settings.width) {
			me.content.css({
				'width': me.settings.width
			})
		}

		if (me.settings.withRowContainer) {
			me.content = $('<div/>', { class: 'row' }).append(me.content);
		}

		me.addEvents(me.settings, [
			"onLoad",
			"onChange"
		]);

		me.input.on("change", function () {
			me.doEvent("onChange", [me, me.val()]);
		});

		// If has value of empty text
		if (me.settings.emptyText && !me.settings.autoLoad) {
			me.input.append($('<option/>', {
				val: '',
				text: me.settings.emptyText
			}));
		}

		//setting store
		me.store = new Store($.extend(true, {}, me.settings.store, {
			// replace autoLoad with false, we need extra event 'afterload'
			// wich is not created at the moment
			autoLoad: false
		}));
		me.store.addEvents({// add extra afterload
			beforeLoad: function () {
				me.readyState = false;
			},
			afterLoad: function (ev, cls, data) {
				data.forEach((obj) => {
					me.input.append($('<option/>', {
						val: obj.rawData.key,
						text: obj.rawData.value,
						attr: {
							'data-params': (typeof obj.rawData.params !== 'undefined' ? JSON.stringify(obj.rawData.params) : '')
						}
					}));
				});
				me.readyState = true;
				me.doEvent("onLoad", [me]);
			}
		});
		// If Autuload
		if (me.settings.autoLoad) {
			me.getDataStore();
		} else me.readyState = true;
	}
	getDisplayValue() {
		let me = this;
		return me.getSelect().getItem(me.val())[0].innerHTML;
	}
	setDataStore(store) {
		this.settings.store = store;
		this.dataStore();
	}
	getDataStore() {
		let me = this;
		let ds = me.settings.store;
		me.input.empty();
		// If has value of empty text
		if (me.settings.emptyText) {
			me.input.append($('<option/>', {
				val: '',
				text: me.settings.emptyText
			}));
		}
		me.store.load();
	}
	getSelectedIndex(){
		return document.getElementById(this.id).selectedIndex;
	}
	change(){
		
		this.input.change();
	}
}
