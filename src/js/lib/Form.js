import Component from "./Component";
import Utils from "./Utils";
import MessageBox from "./MessageBox";

export default class Form extends Component {
	constructor(opt) {
		super(opt);
		let me = this,
			div, wrapper;
		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.Form#settings
		 * @property {String} id ID of element
		 * @property {array} items Items
		 */
		me.settings = $.extend(true, {
			id: '',
			url: '',
			items: []
		}, opt);
		me.addEvents(me.settings, [
			"beforeSerialize",
			"beforeSubmit",
			"success",
			"error",
		]);
		/** 
		 * ID of class or element
		 * @member {boolean}
		 * @name IT.Form#id
		 */
		me.id = me.settings.id || Utils.id();
		wrapper = $('<div />', {
			id: me.id,
			class: 'container-fluid'
		});
		me.ids = [];
		me.items = {};
		$.each(me.settings.items, function (k, el) {
			if (el) {
				if (!el.isClass)
					el = Utils.createObject(el);
				if (!el.noRow) {
					div = $("<div/>", {
						class: 'row form-row align-items-center'
					});
					el.renderTo(div);
					wrapper.append(div);
				} else {
					el.renderTo(wrapper);
				}
				me.ids.push(el.getId());
				me.items[el.getId()] = el;
			}
		});
		me.content = $("<form />", {
			name: Utils.id(),
			class: "it-form",
			action: me.settings.url,
			target: me.settings.target | "",
			enctype: "multipart/form-data"
		});
		me.content.append(wrapper);

		// Validate
		if (typeof $.validator !== "undefined") {
			me.content.validate({
				errorClass: 'invalid-label',
				errorElement: 'span',
				highlight: function (element, errorClass, validClass) {
					$(element).addClass('invalid');
				},
				unhighlight: function (element, errorClass, validClass) {
					$(element).removeClass('invalid');
				}
			});
		} else {
			console.warn("Please install jquery.validation for validation features");
		}

		// Ajax Form
		me.ajaxForm = me.content.ajaxForm($.extend({}, {
			url: me.content.prop("action"),
			type: "POST",
			dataType: "json",
			delegation: true,
			beforeSerialize: function ($form, options) {
				// return false to cancel submit
				let ret = me.doEvent("beforeSerialize", [me, $form, options]);
				return (typeof ret == 'undefined' ? true : ret);
			},
			beforeSubmit: function (arr, $form, options) {
				// form data array is an array of objects with name and value properties
				// [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
				// return false to cancel submit
				let ret = me.doEvent("beforeSubmit", [me, arr, $form, options]);
				return (typeof ret == 'undefined' ? true : ret);
			},
			success: function (data, textStatus, jqXHR) {
				me.doEvent("success", [data, me, jqXHR, textStatus]);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				me.doEvent("error", [me, jqXHR, textStatus, errorThrown]);
			}
		}));
	}
	getItemCount() {
		return this.ids.length;
	}
	getItem(id) {
		if (typeof id === "number") id = this.ids[id];
		if (id) return this.items[id] || null;
		return this.items;
	}
	getData() {
		return this.content.serializeJSON();
	}
	setData(data) {
		let me = this;
		let setsDeep = function (arr) {
			$.each(arr, function (i, l) {
				if (typeof l.val == "function" && l.className != "checkbox" && l.className != "radio") {
					let v = data.getChanged(l.settings.name) || data.get(l.settings.name);
					l.val(v);
				} else if (l.items) setsDeep(l.items);
			});
		}
		setsDeep(me.items);
	}
	validate(showError = false) {
		let me = this,
			valid = true;
		let setsDeep = function (arr) {
			$.each(arr, function (i, l) {
				if (typeof l.val == "function" && l.className != "checkbox" && l.className != "radio") {
					valid = valid && l.validate();
				} else if (l.items) setsDeep(l.items);
			});
		}
		setsDeep(me.items);

		!valid && showError && new MessageBox({
			type: 'waw',
			title: "Peringatan",
			message: "Silahkan Perikasa kembali data"
		});

		return valid;
	}
	valid(callback) {
		if (typeof $.validator !== "undefined") {
			if (this.content.valid()) {
				callback();
			}
		} else {
			console.warn("Please install jquery.validation for validation features");
		}
	}
	submit(options = null) {
		let me = this;
		if (options == null) me.content.submit();
		else {
			me.content.ajaxSubmit($.extend({
				url: me.content.prop("action"),
				type: "POST",
				dataType: "json",
				delegation: true,
				beforeSerialize: function ($form, options) {
					let ret = me.doEvent("beforeSerialize", [me, $form, options]);
					return (typeof ret == 'undefined' ? true : ret);
				},
				beforeSubmit: function (arr, $form, options) {
					let ret = me.doEvent("beforeSubmit", [me, arr, $form, options]);
					return (typeof ret == 'undefined' ? true : ret);
				},
				success: function (data, textStatus, jqXHR) {
					me.doEvent("success", [data, me, jqXHR, textStatus]);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					me.doEvent("error", [me, jqXHR, textStatus, errorThrown]);
				}
			}, options));
		}
	}
	clear() {
		this.ajaxForm.clearForm();
	}
	reset() {
		this.ajaxForm.resetForm();
	}
}