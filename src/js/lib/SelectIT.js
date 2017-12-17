IT.SelectIT = class extends IT.FormItem {
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
			name: "select",
			label: "Choose an option",
			withRowContainer: false,
			width: '',
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

		me.id = me.s.id || IT.Utils.id();
		me.readyState = false;
		me.addEvents(me.s, [
			"onLoad",
			"onChange",
			"onBlur",
			"query"
		]);

		// Content
		me.content = $(`
		<div class="it-select">
			<div class="it-select-wrap">
				<input type="text" class="it-select-search"/>
				<div class="it-select-dropdown-button">
					<i class="fa fa-chevron-down"></i>
				</div>
			</div>
			<ul class="it-select-dropdown"></ul>
			<input type="hidden" class="it-select-value"/>
		</div>`);
		me.searchInput = me.content.find("input.it-select-search");
		me.dropContent = me.content.find("ul.it-select-dropdown");
		me.input = me.content.find("input.it-select-value");

		if (me.s.emptyText /* && !me.s.autoLoad */) // If has value of empty text
			me.searchInput.attr("placeholder", me.s.emptyText);
		if (me.s.width) // if width set
			me.content.css({
				'width': me.s.width
			});
		if (me.s.withRowContainer)
			me.content = $('<div/>', { class: 'row' }).append(me.content);

		// //setting store
		me.store = new IT.Store($.extend(true, {}, me.s.store, {
			// replace autoLoad with false, 
			// we need extra event 'afterload'
			autoLoad: false,
			beforeLoad: function () {
				me.readyState = false;
			},
			afterLoad: function (ev, cls, data) {
				for (let i = 0; i < data.length; i++) {
					me.addItem(data[i]);
					me.readyState = true;
				}
			},
			params:{
				q:""
			}
		}));

		// Add handler
		me.input.on("change", function () {
			me.doEvent("onChange", [me, me.val()]);
		});
		me.searchInput.on("focus",(e) => {
			me.dropContent.show();
		}).on("keyup",(e)=>{
			if (me.store.s.type !== "array"){
				me.dropContent.children().remove()
				me.store.params["q"] = me.searchInput.val();
				me.getDataStore();
			}
		});

		// Load data
		if (me.s.autoLoad) me.getDataStore();
		else me.readyState = true;

	}
	getDataStore() {
		this.store.load();
	}
	renderTo(el) {
		let me = this;
		super.renderTo(el);
		me.searchInput.css({
			'width': me.s.width - me.dropContent.width()
		});
	}
	addItem(record) {
		let me = this;
		let li = $('<li/>', {
			text: record.rawData.value,
			attr: {
				'data-value': record.rawData.key
			}
		}).on('click', (e) => {
			li.parent().find("li").removeClass('it-select-selected');
			li.addClass('it-select-selected');
			me.searchInput.val(li.text()).blur();
			me.input.val(li.data('value')).change();
			me.dropContent.hide();
		});
		me.dropContent.append(li);
	}

	/**
	 * override 
	 * @see IT.FormItem.val();
	 */
	val(value) {
		return (typeof value === "undefined")
			? this.input.val()
			: this.input.val(value);
	}
}