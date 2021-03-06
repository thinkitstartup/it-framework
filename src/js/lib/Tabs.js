import Component from "./Component";
import Utils from "./Utils";

export default class Tabs extends Component {
	constructor(settings) {
		super(settings);

		let me = this;
		me.settings = $.extend(true, {
			id: '',
			titles: {
				align: 'left',
				items: []
			},
			items: [],
			defaultIndexActive: 0,
			height: 100,
			autoHeight: false
		}, settings);

		me.id = me.settings.id || Utils.id();
		me.items = {};
		me.content = $(`
			<div id="${me.id}" class="it-tabs">
			<ul class="it-tabs-menu ${me.settings.titles.align}"></ul>
			<div class="it-tabs-overflow">
			<span class="btn-overflow"><i class="fa fa-angle-down"></i></span>
			<ul class="menu-overflow"></ul>
				</div>
				<div class="it-tabs-container"></div>
				</div>`
		);
		me.content.css(me.settings.autoHeight ? 'min-height' : 'height', me.settings.height);

		// Loop judul tab
		me.idsTitle=[];
		$.each(me.settings.titles.items, function (k, v) {
			let id = Utils.id();
			let titleTab = $('<li/>', {
				class: 'it-tabs-link',
				html: v,
				attr: {
					'data-tab': id,
					'data-index': k
				}
			});
			titleTab.appendTo(me.content.find('.it-tabs-menu'));
			titleTab.click(function () {
				me.setActive($(this).data('index'));
			});
			me.idsTitle.push(id);
		});
		
		// Loop berdasarkan ids untuk membuat konten
		me.ids = [];
		$.each(me.settings.items, function (k, el) {
			if (el) {
				// Buat Div Tab konten
				let itemTab = $('<div/>', {
					class: 'it-tabs-content',
					id: me.idsTitle[k]
				});

				if (!el.isClass)
					el = Utils.createObject(el);
				el.renderTo(itemTab);
				me.ids.push(el.getId());
				me.items[el.getId()] = el;
				itemTab.appendTo(me.content.find('.it-tabs-container'));
			}
		});

		// Event dan Trigger untuk tombol overflow
		me.content.find('.btn-overflow').click(function () {
			$(this).next().toggle();
		});
	}
	renderTo(obj) {
		super.renderTo(obj);
		let me = this;
		$(window).resize(function () {
			me._autoShowMore();
		});

		me._autoShowMore();
		me.setActive(me.settings.defaultIndexActive);

		// Still Bugs 
		setTimeout(() => {
			me._autoShowMore();
		}, 10);
	}
	setActive(index) {
		let cur,
			me = this,
			el = me.content.find('.it-tabs-menu li').eq(index);
		if (el.length < 1) throw 'offset index';
		me.content.find(".tab-active").removeClass("tab-active");
		cur = el.addClass("tab-active");
		me.content.find('#' + cur.data('tab')).addClass('tab-active');
	}
	getActive() {
		let el = this.getContent().find('.it-tabs-menu li.tab-active');
		return {
			index: el.index(),
			content: el,
		}
	}
	_autoShowMore() {
		let me = this;
		let menuOverflow = me.content.find('.menu-overflow');
		menuOverflow.empty();

		let menu = me.content.find('.it-tabs-menu li');
		menu.show();
		menu.each(function () {
			if (($(this).position().left + $(this).outerWidth()) > me.content.width()) {
				$(this).clone(true).appendTo(menuOverflow);
				$(this).hide();
			}
		});

		me.content.find('.it-tabs-overflow').toggle(menuOverflow.children('li').length > 0);
	}
	getItemCount() {
		return this.ids.length;
	}
	getItem(id) {
		if (typeof id === "number") id = this.ids[id];
		if (id) return this.items[id] || null;
		return this.items;
	}
}