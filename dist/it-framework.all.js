var IT = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  var Utils =
  /*#__PURE__*/
  function () {
    function Utils() {
      _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
      key: "createObject",

      /**
       * createObject
       * @param  {object} opt option for the class
       * @return {class} function class
       */
      value: function createObject(opt) {
        var xtype = opt.xtype || opt.x;
        var map = {
          button: "Button",
          toolbar: "Toolbar",
          html: "HTML",
          flex: "Flex",
          form: "Form",
          textbox: "TextBox",
          text: "TextBox",
          checkbox: "CheckBox",
          select: "Select",
          grid: "Grid",
          datatable: "DataTable",
          tabs: "Tabs"
        };
        if (!IT[map[xtype]]) throw "Class IT." + map[xtype] + " not found";
        return map[xtype] && IT[map[xtype]] ? new IT[map[xtype]](opt) : null;
      }
      /**
       * create template literal
       * @param  {string}    strings base template
       * @param  {...object} keys    [object to be parsed]
       * @return {template}            template
       */

    }, {
      key: "template",
      value: function template(strings) {
        for (var _len = arguments.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          keys[_key - 1] = arguments[_key];
        }

        return function () {
          for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            values[_key2] = arguments[_key2];
          }

          var dict = values[values.length - 1] || {};
          var result = [strings[0]];
          keys.forEach(function (key, i) {
            var value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
          });
          return result.join('');
        };
      }
      /**
       * create random id with prefix "IT-"
       * @return {string} string random id 
       */

    }, {
      key: "id",
      value: function id() {
        var text = "IT-";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
      }
      /**
       * check if value's in money format
       * @param  {string}  value text to be checked
       * @return {boolean}       return true if string is money
       */

    }, {
      key: "isMoney",
      value: function isMoney(value) {
        var m = value.replace(/[$,]/g, "").replace(/\./g, "").replace(/,/g, ".").replace(/\%/g, "");
        return !isNaN(m);
      }
      /**
       * check if value's in date format
       * @param  {string}  value text to be checked
       * @return {boolean}       return true if string is date
       */

    }, {
      key: "isDate",
      value: function isDate(value) {
        var d = new Date(value);
        return !isNaN(d);
      }
      /**
       * Empty Function
       */

    }, {
      key: "emptyFn",
      value: function emptyFn() {//console.info("Empty function");
      }
    }, {
      key: "findData",
      value: function findData(value, fromStore) {
        var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var v = value,
            dta = fromStore.getData ? fromStore.getData() : fromStore;
        opt = $.extend(true, {
          field: "key",
          look: "value"
        }, opt || {});

        if (dta.length) {
          for (var i = 0; i < dta.length; i++) {
            var el = dta[i];

            if (el[opt.field] == value) {
              v = el[opt.look];
              break;
            }
          }
        }

        return v;
      }
    }, {
      key: "transitionEnd",
      get: function get() {
        return 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
      }
    }]);

    return Utils;
  }();

  var BaseClass =
  /*#__PURE__*/
  function () {
    function BaseClass(settings) {
      _classCallCheck(this, BaseClass);

      var me = this;
      me._id = ""; //private

      /** 
       * Setting for class
       * @member {Object}
       * @name IT.Component#settings
       */

      me.settings = settings || {};
    }

    _createClass(BaseClass, [{
      key: "addEvents",

      /**
       * addEvents to the the class
       * @param  {option} object of functions 
       * @param  {events_available} array array of string. Can be act as event available
       */
      //https://stackoverflow.com/questions/23344625/create-javascript-custom-event
      value: function addEvents(option) {
        var listen_enable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var me = this;

        if (listen_enable.length == 0) {
          Object.keys(option).forEach(function (e) {
            return typeof option[e] == "function" ? listen_enable.push(e) : null;
          });
        }

        var sel = option.selector || $(me); //sel = (typeof sel.on=="function")?sel:$(sel);

        listen_enable.forEach(function (event) {
          return sel.on(event, option[event] || Utils.emptyFn);
        });
      }
      /**
       * Call event from available events.
       * @param  {event} string of the event to be called
       * @param  {params} array array of argument to be passed
       */

    }, {
      key: "doEvent",
      value: function doEvent(event, params) {
        $(this).trigger(event, params);
      }
      /**
       * Clear all available events.
       * @param  {option} object of functions 
       */

    }, {
      key: "clearEvents",
      value: function clearEvents() {
        var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var sel = option.selector || $(this).off();
      }
      /**
       * Shorthand for this.settings;
       * @returns {object} setting object
       */

    }, {
      key: "className",
      get: function get() {
        return this.classname || this.settings.xtype || this.settings.x || undefined;
      }
      /**
       * used to check if this is a class
       * @type {boolean}
       */

    }, {
      key: "isClass",
      get: function get() {
        return true;
      }
    }, {
      key: "s",
      get: function get() {
        return this.settings;
      }
    }]);

    return BaseClass;
  }();

  var Component =
  /*#__PURE__*/
  function (_BaseClass) {
    _inherits(Component, _BaseClass);

    function Component(settings) {
      var _this;

      _classCallCheck(this, Component);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Component).call(this, settings));

      var me = _assertThisInitialized(_assertThisInitialized(_this));

      me.content = null;
      return _this;
    }
    /**
     * Render this Element to parentEl
     * @param  {selector} parentEl selector for parent
     */


    _createClass(Component, [{
      key: "renderTo",
      value: function renderTo(parentEl) {
        if (this.content.appendTo) {
          this.content.appendTo(parentEl);
        }
      }
      /**
       * ID of component
       * @name IT.Component#id
       * @member {string}
       */

    }, {
      key: "getId",

      /**
       * get ID
       * @return {string} Component ID
       */
      value: function getId() {
        return this.id;
      }
      /**
       * get Content  selector 
       * @return {selector} content
       */

    }, {
      key: "getContent",
      value: function getContent() {
        return this.content;
      }
      /**
       * get generated settings
       * @return {object}
       */

    }, {
      key: "getSetting",
      value: function getSetting() {
        return this.settings;
      }
    }, {
      key: "id",
      get: function get() {
        return this._id;
      },
      set: function set(id) {
        this._id = id;
      }
    }]);

    return Component;
  }(BaseClass);

  var Form =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Form, _Component);

    function Form(opt) {
      var _this;

      _classCallCheck(this, Form);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Form).call(this, opt));

      var me = _assertThisInitialized(_assertThisInitialized(_this)),
          div,
          wrapper;
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
      me.addEvents(me.settings, ["beforeSerialize", "beforeSubmit", "success", "error"]);
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
          if (!el.isClass) el = Utils.createObject(el);

          if (!el.noRow) {
            div = $("<div/>", {
              class: 'row form-row'
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
      me.ajaxForm = me.content.ajaxForm($.extend({}, {
        url: me.content.prop("action"),
        type: "POST",
        dataType: "json",
        delegation: true,
        beforeSerialize: function beforeSerialize($form, options) {
          // return false to cancel submit
          var ret = me.doEvent("beforeSerialize", [me, $form, options]);
          return typeof ret == 'undefined' ? true : ret;
        },
        beforeSubmit: function beforeSubmit(arr, $form, options) {
          // form data array is an array of objects with name and value properties
          // [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
          // return false to cancel submit
          var ret = me.doEvent("beforeSubmit", [me, arr, $form, options]);
          return typeof ret == 'undefined' ? true : ret;
        },
        success: function success(data, textStatus, jqXHR) {
          me.doEvent("success", [data, me, jqXHR, textStatus]);
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          me.doEvent("error", [me, jqXHR, textStatus, errorThrown]);
        }
      }));
      return _this;
    }

    _createClass(Form, [{
      key: "getItemCount",
      value: function getItemCount() {
        return this.ids.length;
      }
    }, {
      key: "getItem",
      value: function getItem(id) {
        if (typeof id === "number") id = this.ids[id];
        if (id) return this.items[id] || null;
        return this.items;
      }
    }, {
      key: "getData",
      value: function getData() {
        return this.content.serializeJSON();
      }
    }, {
      key: "setData",
      value: function setData(data) {
        var me = this;

        var setsDeep = function setsDeep(arr) {
          $.each(arr, function (i, l) {
            if (typeof l.val == "function" && l.className != "checkbox" && l.className != "radio") {
              var v = data.getChanged(l.settings.name) || data.get(l.settings.name);
              l.val(v);
            } else if (l.items) setsDeep(l.items);
          });
        };

        setsDeep(me.items);
      }
    }, {
      key: "submit",
      value: function submit() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var me = this;
        if (options == null) me.content.submit();else {
          me.content.ajaxSubmit($.extend({
            url: me.content.prop("action"),
            type: "POST",
            dataType: "json",
            delegation: true,
            beforeSerialize: function beforeSerialize($form, options) {
              var ret = me.doEvent("beforeSerialize", [me, $form, options]);
              return typeof ret == 'undefined' ? true : ret;
            },
            beforeSubmit: function beforeSubmit(arr, $form, options) {
              var ret = me.doEvent("beforeSubmit", [me, arr, $form, options]);
              return typeof ret == 'undefined' ? true : ret;
            },
            success: function success(data, textStatus, jqXHR) {
              me.doEvent("success", [data, me, jqXHR, textStatus]);
            },
            error: function error(jqXHR, textStatus, errorThrown) {
              me.doEvent("error", [me, jqXHR, textStatus, errorThrown]);
            }
          }, options));
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        this.ajaxForm.clearForm();
      }
    }, {
      key: "reset",
      value: function reset() {
        this.ajaxForm.resetForm();
      }
    }]);

    return Form;
  }(Component);

  var Button =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Button, _Component);

    function Button(params) {
      var _this;

      _classCallCheck(this, Button);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Button).call(this, params));

      var me = _assertThisInitialized(_assertThisInitialized(_this));

      me.settings = $.extend(true, {
        id: '',
        buttonClass: '',
        iconClass: '',
        enable: true,
        enableDropdown: true,
        text: 'Tombol',
        items: [],
        css: {}
      }, params);
      me.id = me.settings.id || Utils.id();
      me.enable = me.settings.enable; //me.listener = new IT.Listener(me, me.settings, ["onClick"]);

      me.addEvents(me.settings, ["onClick"]);
      var btn = $('<a/>', {
        id: me.id,
        html: me.settings.text,
        class: 'it-btn ' + me.settings.buttonClass,
        css: me.settings.css
      });
      btn.click(function (e) {
        if (me.enable) {
          if (typeof me.settings.handler === 'function') me.settings.handler.call(); //me.listener.fire("onClick",[me, me.id]);

          me.doEvent("onClick", [me, me.id]);
          e.stopPropagation();
        }
      });

      if (me.settings.iconClass) {
        var icon = $('<span/>', {
          class: 'fa fa-' + me.settings.iconClass,
          html: '&nbsp;'
        });
        btn.prepend(icon);
      }

      me.content = btn;

      if (!me.settings.enable) {
        me.setEnable(false);
      }

      if (me.settings.items.length) {
        var btnGroup = $('<div/>', {
          class: 'it-btn-group'
        });
        btnGroup.append(me.content);
        var btnDropdown = new IT.Button({
          iconClass: 'angle-down',
          buttonClass: me.settings.buttonClass + ' btn-dropdown ',
          text: '',
          handler: function handler() {
            me.content.find('.menu-group').toggle();
            menuDropdown.removeClass('menu-reverse');

            if (menuDropdown.offset().top + menuDropdown.outerHeight() > $(window).height()) {
              menuDropdown.addClass('menu-reverse');
            }
          }
        });
        btnDropdown.setEnable(me.settings.enableDropdown);
        btnDropdown.renderTo(btnGroup);
        var menuDropdown = $('<ul/>', {
          class: 'menu-group'
        });
        $.each(me.settings.items, function (k, el) {
          if (el) {
            var li = $('<li/>', {
              class: 'clearfix'
            });

            if (typeof el === 'string') {
              el = Utils.createObject({
                xtype: 'html',
                content: $('<div/>', {
                  class: 'menu-group-separator'
                })
              });
            } else if (!el.isClass) {
              el = $.extend(true, {
                xtype: 'button'
              }, el);
              el = Utils.createObject(el);
            }

            el.renderTo(li);
            li.appendTo(menuDropdown);
          }
        });
        btnGroup.append(menuDropdown);
        me.content = btnGroup;
      }

      return _this;
    }

    _createClass(Button, [{
      key: "renderTo",
      value: function renderTo(obj) {
        _get(_getPrototypeOf(Button.prototype), "renderTo", this).call(this, obj); // hide dropdown menu if click outside the object


        if (this.settings.items.length) {
          $(document).click(function (e) {
            if (!$(e.target).closest('.menu-group').length) {
              $('.menu-group').hide();
            }
          });
        }
      }
    }, {
      key: "setEnable",
      value: function setEnable(set) {
        this.enable = set;
        this.content[this.enable ? 'removeClass' : 'addClass']('btn-disabled');
      }
    }, {
      key: "setText",
      value: function setText(text) {
        var me = this;
        me.content.html(text);
      }
    }]);

    return Button;
  }(Component);

  var Toolbar =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Toolbar, _Component);

    function Toolbar(settings) {
      var _this;

      _classCallCheck(this, Toolbar);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Toolbar).call(this));

      var me = _assertThisInitialized(_assertThisInitialized(_this));

      me.settings = $.extend(true, {
        id: '',
        position: 'top',
        items: []
      }, settings);
      me.id = me.settings.id || Utils.id();
      me.content = $("\n\t\t\t<div id=\"".concat(me.id, "\" class=\"it-toolbar toolbar-").concat(me.settings.position, " clearfix\">\n\t\t\t\t<ul class=\"it-toolbar-left\"></ul>\n\t\t\t\t<ul class=\"it-toolbar-right\"></ul>\n\t\t\t</div>\n\t\t"));
      me.ids = [];
      me.items = {};
      $.each(me.settings.items, function (k, el) {
        if (el) {
          var li = $('<li/>');
          if (!el.isClass) el = Utils.createObject(el);
          el.renderTo(li);
          me.content.find(".it-toolbar-".concat(el.getSetting().align || 'left')).append(li);
          me.ids.push(el.getId());
          me.items[el.getId()] = el;
        }
      });
      return _this;
    }

    _createClass(Toolbar, [{
      key: "getItemCount",
      value: function getItemCount() {
        return this.ids.length;
      }
    }, {
      key: "getItem",
      value: function getItem(id) {
        if (typeof id === "number") id = this.ids[id];
        if (id) return this.items[id] || null;
        return this.items;
      }
    }]);

    return Toolbar;
  }(Component);

  var FormItem =
  /*#__PURE__*/
  function (_Component) {
    _inherits(FormItem, _Component);

    /** @param  {object} settings  */
    function FormItem(settings) {
      var _this;

      _classCallCheck(this, FormItem);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(FormItem).call(this, settings));

      var me = _assertThisInitialized(_assertThisInitialized(_this));

      me._readyState = false;
      me.addEvents(me.settings, ["stateChange"]);
      me.readyState = true;
      return _this;
    }

    _createClass(FormItem, [{
      key: "val",

      /**
       * getter or setter for value
       * @param  {object} value if value is exist, then it's setter for value
       * @return {object}   value of this item, return true if setter success
       * @example
       * var a = new IT.TextBox();
       * a.renderTo($(body))
       * a.val("this is the val") // setter
       * console.info(a.val()); // getter
       */
      value: function val(value) {
        return typeof value === "undefined" ? this.input.val() : this.input.val(value);
      }
      /** 
       * if state is true, mark the input with border red
       * @param {Boolean} state pass true to make this item invalid
       */

    }, {
      key: "setInvalid",
      value: function setInvalid() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        if (this.input) this.input[state ? "addClass" : "removeClass"]("invalid");
      }
      /** return true if valid */

    }, {
      key: "validate",
      value: function validate() {
        return !(!this.settings.allowBlank && this.val() == "");
      }
      /** 
       * whether set this item readonly or not
       * @param {Boolean} state pass true to make this item readonly
       */

    }, {
      key: "setReadonly",
      value: function setReadonly() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        if (this.input) this.input.attr('readonly', state)[state ? "addClass" : "removeClass"]('input-readonly');
      }
      /** 
       * whether set this item enabled or not
       * @param {Boolean} state pass true to make this item invalid
       */

    }, {
      key: "setEnabled",
      value: function setEnabled() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        if (this.input) this.input.attr('disabled', !state)[!state ? "addClass" : "removeClass"]('input-disabled');
      }
    }, {
      key: "readyState",
      get: function get() {
        return this._readyState;
      },
      set: function set(state) {
        this._readyState = state;
        this.doEvent("stateChange", state);
      }
    }]);

    return FormItem;
  }(Component);

  var TextBox =
  /*#__PURE__*/
  function (_FormItem) {
    _inherits(TextBox, _FormItem);

    /** @param {object} opt */
    function TextBox(opt) {
      var _this;

      _classCallCheck(this, TextBox);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(TextBox).call(this, opt));

      var me = _assertThisInitialized(_assertThisInitialized(_this)),
          s;
      /** 
       * Setting for class
       * @member {Object}
       * @name IT.TextBox#settings
       * @see https://github.com/RobinHerbots/Inputmask/blob/4.x/dist/jquery.inputmask.bundle.js
       * 
       * @property {enum} available : [textarea, text, mask]
       * @property {int} cols how many coloms char, only used for type textarea
       * @property {int} rows how many rows char,only used for type textarea
       * @property {Object} maskSettings maskSettings:{}, // only used for type mask  https://github.com/RobinHerbots/Inputmask/blob/4.x/README.md
       * @property {String} id id the classs
       * @property {String} label set label description
       * @property {String} name name for the input, < input type='type' > name="xxx">
       * @property {boolean} withRowContainer wrap component with row
       * @property {boolean} allowBlank set the input weather can be leave blank or not
       * @property {String} value value for input
       * @property {String} placeholder placeholder for input
       * @property {boolean} readonly set wather this comp readonly or not
       * @property {boolean} enabled set wather this comp enabled or not
       * @property {object} length how many char can be accepted
       * @property {int} length.min minimal char length 
       * @property {int} length.max maximal char length 		 
       * @property {object} size in column grid system by bootstrap
       * @property {string} size.field size for field input
       * @property {string} size.label size for label input		 
       * @property {object} info extra div for estra input
       * @property {string} info.prepend info before input
       * @property {string} info.append info after input
       * @example
       * var a = new IT.TextBox({
       *    info:{
       *        prepend:"Rp. ",
       *        append:"-,.",
       *    }
       * });
       * a.renderTo($(body));
       *
       * @example
       * 
       * //input type mask, numeric
       * {
       * x:"textbox",
      			type:"mask",
      			label:"masukan nama",
      			placeholder:"masukan nama",
      			allowBlank:false,
      			info:{
      				prepend:"Rp. ",
      				append:"-,."
      			},
      			maskSettings:{
      				groupSeparator: ".",
      				radixPoint: "",
      				alias: "numeric",
      				placeholder: "0",
      				autoGroup: !0,
      				digits: 2
      			},
      				}
       */


      me.settings = $.extend(true, {
        x: "textbox",
        type: 'text',
        cols: 19,
        rows: 5,
        maskSettings: {},
        id: "",
        label: "",
        name: "",
        withRowContainer: false,
        allowBlank: true,
        value: "",
        placeholder: '',
        readonly: false,
        enabled: true,
        length: {
          min: 0,
          max: -1
        },
        size: {
          field: "col-sm-8",
          label: "col-sm-4",
          input: 0
        },
        info: {
          prepend: '',
          append: ''
        }
      }, opt);
      s = me.settings; // set id

      me.id = s.id || Utils.id(); //if label empty, field size is 12

      if (s.label == "") s.size.field = "col"; //create input

      switch (s.type) {
        case 'textarea':
          me.input = $("<textarea style='resize: none;' id=\"".concat(me.id, "-item\" ") + "class='it-edit-input' " + "".concat(s.allowBlank == false ? "required" : "", " ") + "cols='".concat(s.cols, "' ") + "rows='".concat(s.rows, "' ") + "".concat(s.readonly ? " readonly " : "", " ") + "".concat(s.enabled == false ? " disabled " : "", " ") + "name='".concat(me.settings.name || Utils.id(), "' ") + "".concat(s.length.min > 0 ? "minlength='".concat(s.length.min, "'") : "", " ") + "".concat(s.length.max > 0 ? "maxlength='".concat(s.length.max, "'") : "", " ") + ">".concat(s.value ? "".concat(s.value) : "", "</textarea>"));
          break;

        case 'text':
        case 'mask':
          me.input = $("<input id=\"".concat(me.id, "-item\" ") + "type='text' " + "class='it-edit-input' " + "name='".concat(me.settings.name || Utils.id(), "' ") + "".concat(s.length.min > 0 ? "minlength='".concat(s.length.min, "'") : "", " ") + "".concat(s.length.max > 0 ? "maxlength='".concat(s.length.max, "'") : "", " ") + "".concat(s.allowBlank == false ? "required" : "", " ") + "".concat(s.readonly ? " readonly " : "", " ") + "".concat(s.size.input != 0 ? " size='".concat(s.size.input, "'") : "", " ") + "".concat(s.enabled == false ? " disabled " : "", " ") + "".concat(s.placeholder ? "placeholder='".concat(s.placeholder, "'") : "", " ") + "".concat(s.value ? "value='".concat(s.value, "'") : "", " ") + ">");
          if (s.type == "mask") //input type mask
            me.input.inputmask(s.maskSettings || {});
          if (s.size.input != 0) me.input.addClass("noflex");
          break;

        case "hidden":
          me.input = $("<input id=\"".concat(me.id, "-item\" ") + "type='hidden' " + "name='".concat(me.settings.name || Utils.id(), "' ") + "".concat(s.value ? "value='".concat(s.value, "'") : "", " ") + ">");
          break;

        default:
          throw "input type unknown";
          break;
      } // event


      me.input.on("focus change blur", function (e) {
        me.setInvalid(!me.validate());
      });
      me.input.on("keypress", function (e) {
        if (e.which == 13) $(this).blur();
      }); //wrapper

      var wraper = $("<div class='it-edit' />").append(me.input); //info

      s.info.prepend && wraper.prepend($('<div />', {
        class: 'it-edit-item',
        html: s.info.prepend
      }));
      s.info.append && wraper.append($('<div />', {
        class: 'it-edit-item',
        html: s.info.append
      })); //content

      me.content = $((s.label ? "<div class=\"".concat(s.size.label, "\">\n\t\t\t<label for=\"").concat(me.id, "-item\" class='it-input-label it-input-label-").concat(s.labelAlign || 'left', "'> ").concat(s.label, " </label>\n\t\t</div>") : '') + "<div class=\"".concat(s.size.field, "\"></div>"));
      me.content.last().append(wraper);

      if (s.withRowContainer) {
        me.content = $('<div/>', {
          class: 'row'
        }).append(me.content);
      }

      me.readyState = true;
      return _this;
    }

    return TextBox;
  }(FormItem);

  var RecordStore =
  /*#__PURE__*/
  function (_BaseClass) {
    _inherits(RecordStore, _BaseClass);

    /** conctructor */
    function RecordStore(record) {
      var _this;

      _classCallCheck(this, RecordStore);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(RecordStore).call(this, record));

      var me = _assertThisInitialized(_assertThisInitialized(_this));

      me.commited = false;
      me.rawData = record, me.changed = {}, me.field = Object.keys(record);
      me.locked = [];
      return _this;
    }
    /**
     * is this record has been updated
     * @param {String} [String] Optional. If set, it will check if the record is changed base on key.
     * @return {Boolean} true if record has changed
     */


    _createClass(RecordStore, [{
      key: "isChanged",
      value: function isChanged() {
        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (key) {
          return key in this.changed;
        } else return Object.keys(this.changed).length > 0;
      }
      /**
       * Update the record, but it's appended to changed data. Raw data still untouched
       * @param  {String} key   field key to update
       * @param  {String} value changed value to commit
       * @return {true}       true if updating succes. (append to changed data)
       */

    }, {
      key: "update",
      value: function update(key, value) {
        var me = this;

        if (me.rawData.hasOwnProperty(key)) {
          if (me.rawData[key] == value) {
            if (me.changed.hasOwnProperty(key)) {
              delete me.changed[key];
              return true;
            }
          } else {
            me.changed[key] = value;
            return true;
          }
        } else {
          console.error("Field " + key + " is not exists");
        }

        return false;
      }
      /**
       * Get data changed
       * @return {Object} return null if isChanged false. otherwise return rawdata with changed applied
       */

    }, {
      key: "getChanged",
      value: function getChanged() {
        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var me = this;

        if (key) {
          return me.isChanged(key) ? me.changed[key] : null;
        } else return !me.isChanged() ? null : Object.assign({}, me.rawData, me.changed);
      }
      /**
       * Get Raw data
       * @return {Object} raw data, before data changeds
       */

    }, {
      key: "getRawData",
      value: function getRawData() {
        return this.rawData;
      }
      /**
       * Get record data property
       * @param  {String} key key field
       * @return {Object}     value
       */

    }, {
      key: "get",
      value: function get(key) {
        return this.rawData[key];
      }
      /**
       * check certain field is locked
       * @param  {string} key field to be checked
       * @return {boolean}     wether the field is locked. true if locked
       */

    }, {
      key: "isLocked",
      value: function isLocked(key) {
        return $.inArray(key, this.locked) > -1;
      }
    }]);

    return RecordStore;
  }(BaseClass);

  var Store =
  /*#__PURE__*/
  function (_BaseClass) {
    _inherits(Store, _BaseClass);

    /** conctructor */
    function Store(settings) {
      var _this;

      _classCallCheck(this, Store);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Store).call(this, settings));

      var me = _assertThisInitialized(_assertThisInitialized(_this));
      /** 
       * Setting for class
       * @member {Object}
       * @name IT.Store#settings
       * @property {string} id ID of element
       */


      me.settings = $.extend(true, {
        type: 'json',
        url: '',
        data: [],
        autoLoad: false,
        params: {
          start: 0,
          limit: 20
        }
      }, settings);
      me.params = me.settings.params;
      me.data = [];
      me.total_rows = 0;
      me.procces = false;
      me.addEvents(me.settings, ["beforeLoad", "afterLoad", "onLoad", "onError", "onEmpty"]);
      if (me.settings.autoLoad) me.load();
      return _this;
    }
    /**
     * empty store data
     */


    _createClass(Store, [{
      key: "empty",
      value: function empty() {
        var me = this;
        me.total_rows = 0;
        me.data = [];
        me.doEvent("onEmpty", [me, me.getData(), me.params]);
      }
      /**
       * Load Data
       * @param  {object} opt optional params
       */

    }, {
      key: "load",
      value: function load() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var me = this;

        switch (me.settings.type) {
          case "ajax":
          case "json":
            me.settings.type = "json";
            var params = $.extend(me.settings.params, opt.params);
            me.params = params;
            me.empty();
            $.ajax({
              dataType: me.settings.type,
              type: 'POST',
              url: me.settings.url,
              data: params,
              beforeSend: function beforeSend(a, b) {
                me.procces = true;
                me.total_rows = 0;
                var ret = me.doEvent("beforeLoad", [me, a, b]);
                return typeof ret == 'undefined' ? true : ret;
              },
              success: function success(data) {
                if (typeof data.rows != 'undefined' && typeof data.total_rows != 'undefined') {
                  $.each(data.rows, function (idx, item) {
                    var rec = new RecordStore(item);
                    rec.commited = true;
                    me.data.push(rec);
                  });
                  me.total_rows = data.total_rows;
                  me.doEvent("onLoad", [me, me.getData(), me.params]);
                } else me.doEvent("onError", [me, {
                  status: false,
                  message: "Format Data Tidak Sesuai"
                }]);
              },
              error: function error(XMLHttpRequest, textStatus, errorThrown) {
                //throw errorThrown;
                me.doEvent("onError", [me, {
                  status: textStatus,
                  message: errorThrown
                }]);
              },
              complete: function complete() {
                me.procces = false;
                me.doEvent("afterLoad", [me, me.getData()]);
              }
            });
            break;

          case "array":
            me.total_rows = 0;
            me.procces = true;
            var bl_return = me.doEvent("beforeLoad", [me, me.data || [], null]);

            if (typeof bl_return == 'undefined' ? true : bl_return) {
              if (typeof me.settings.data != 'undefined') {
                $.each(me.settings.data, function (idx, item) {
                  var rec = new RecordStore(item);
                  rec.commited = true;
                  me.data.push(rec);
                  me.total_rows++;
                });
                me.doEvent("onLoad", [me, me.getData(), null]);
              } else me.doEvent("onError", [me, {
                status: false,
                message: "Data JSON '" + me.settings.url + "' Tidak Ditemukan"
              }]);
            } else {
              me.empty();
              me.doEvent("onError", [me, {
                status: false,
                message: "Format Data Tidak Sesuai"
              }]);
            }

            me.doEvent("afterLoad", [me, me.getData()]);
            me.procces = false;
            break;
        }
      }
      /**
       * sort data
       * @param  {string} field Sort by this field
       * @param  {boolean} asc  Determine if order is ascending. true=Ascending, false=Descending
       * @deprecated Deprecated, doesn't support ordering in front side
       */

    }, {
      key: "sort",
      value: function sort(field) {
        throw "Deprecated, doesn't support ordering in front side";
      }
      /**
       * Get parameter(s)
       * @return {object} paramters
       */

    }, {
      key: "getParams",
      value: function getParams() {
        return this.params;
      }
      /**
       * Get Stored Data
       * @return {array} expected data
       */

    }, {
      key: "getData",
      value: function getData() {
        return this.data;
      }
      /**
       * Get Stored Raw Datas
       * @return {array} expected data
       */

    }, {
      key: "getRawData",
      value: function getRawData() {
        var me = this,
            ret = [];
        $.each(me.data, function (idx, item) {
          ret.push(item.rawData);
        });
        return ret;
      }
      /**
       * Get only changed data from raw
       * @return {array}  array of record
       */

    }, {
      key: "getChangedData",
      value: function getChangedData() {
        var me = this,
            r = [];

        for (var idx in me.data) {
          if (me.data[idx].changed) r.push($.extend({}, me.data[idx].data, {
            indexRow: parseInt(idx)
          }));
        }

        return r;
      }
      /**
       * Set stored Data
       * @param {object} data replacement for data
       */

    }, {
      key: "setData",
      value: function setData(data) {
        var me = this;
        data = me.type == "json" ? data.rows : data;
        me.empty();
        $.each(data, function (idx, item) {
          var rec = new RecordStore(item);
          rec.commited = true;
          me.data.push(rec);
          me.total_rows++;
        });
        me.doEvent("onLoad", [me, me.data, me.params]);
      }
      /**
       * Change data
       * @param  {Object} data     Updated data
       * @param  {Number} indexRow index data to be changed
       */

    }, {
      key: "replace",
      value: function replace() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var indexRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var me = this;

        for (var key in data) {
          me.data[indexRow].update(key, data[key]);
        }
      }
      /**
       * find the indexOf `field` by value
       * @param {string} field 
       * @param {var} value 
       * @returns {int} index
       */

    }, {
      key: "indexOf",
      value: function indexOf() {
        var field = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        var value = arguments.length > 1 ? arguments[1] : undefined;
        var me = this;

        for (var i = 0; i < me.data.length; i++) {
          if (me.data[i].rawData[field] === value) {
            return i;
          }
        }

        return -1;
      }
    }]);

    return Store;
  }(BaseClass);

  var Select =
  /*#__PURE__*/
  function (_FormItem) {
    _inherits(Select, _FormItem);

    function Select(settings) {
      var _this;

      _classCallCheck(this, Select);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Select).call(this, settings));

      var me = _assertThisInitialized(_assertThisInitialized(_this));

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
          data: null
        },
        size: {
          field: "col-md-8",
          label: "col-md-4"
        }
      }, settings);
      me.id = me.settings.id || Utils.id();
      me.input = $('<select />', {
        id: me.id,
        name: me.s.name,
        class: 'it-edit-input',
        attr: {
          disabled: me.settings.disabled
        },
        val: me.settings.defaultValue
      }); //me.content = $('<div />', { class: 'it-edit' });
      //me.content.append(me.input);

      me.content = $((me.settings.label ? "<div class=\"".concat(me.settings.size.label, "\">") + "<label for=\"".concat(me.id, "-item\" class='it-input-label it-input-label-").concat(me.settings.labelAlign || 'left', "'>").concat(me.settings.label, "</label>") + "</div>" : "") + "<div class=\"".concat(me.settings.size.field, "\"></div>"));
      me.content.last().append(me.input);

      if (me.settings.width) {
        me.content.css({
          'width': me.settings.width
        });
      }

      if (me.settings.withRowContainer) {
        me.content = $('<div/>', {
          class: 'row'
        }).append(me.content);
      }

      me.addEvents(me.settings, ["onLoad", "onChange"]);
      me.input.on("change", function () {
        me.doEvent("onChange", [me, me.val()]);
      }); // If has value of empty text

      if (me.settings.emptyText && !me.settings.autoLoad) {
        me.input.append($('<option/>', {
          val: '',
          text: me.settings.emptyText
        }));
      } //setting store


      me.store = new Store($.extend(true, {}, me.settings.store, {
        // replace autoLoad with false, we need extra event 'afterload'
        // wich is not created at the moment
        autoLoad: false
      }));
      me.store.addEvents({
        // add extra afterload
        beforeLoad: function beforeLoad() {
          me.readyState = false;
        },
        afterLoad: function afterLoad(ev, cls, data) {
          data.forEach(function (obj) {
            me.input.append($('<option/>', {
              val: obj.rawData.key,
              text: obj.rawData.value,
              attr: {
                'data-params': typeof obj.rawData.params !== 'undefined' ? JSON.stringify(obj.rawData.params) : ''
              }
            }));
          });
          me.readyState = true;
          me.doEvent("onLoad", [me]);
        }
      }); // If Autuload

      if (me.settings.autoLoad) {
        me.getDataStore();
      } else me.readyState = true;

      return _this;
    }

    _createClass(Select, [{
      key: "getDisplayValue",
      value: function getDisplayValue() {
        var me = this;
        return me.getSelect().getItem(me.val())[0].innerHTML;
      }
    }, {
      key: "setDataStore",
      value: function setDataStore(store) {
        this.settings.store = store;
        this.dataStore();
      }
    }, {
      key: "getDataStore",
      value: function getDataStore() {
        var me = this;
        var ds = me.settings.store;
        me.input.empty(); // If has value of empty text

        if (me.settings.emptyText) {
          me.input.append($('<option/>', {
            val: '',
            text: me.settings.emptyText
          }));
        }

        me.store.load();
      }
    }, {
      key: "getSelectedIndex",
      value: function getSelectedIndex() {
        return document.getElementById(this.id).selectedIndex;
      }
    }]);

    return Select;
  }(FormItem);

  var CheckBox =
  /*#__PURE__*/
  function (_FormItem) {
    _inherits(CheckBox, _FormItem);

    function CheckBox(settings) {
      var _this;

      _classCallCheck(this, CheckBox);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CheckBox).call(this, settings));

      var me = _assertThisInitialized(_assertThisInitialized(_this)),
          s;

      me.settings = $.extend(true, {
        x: "checkbox",
        id: "",
        // id the classs
        label: "",
        // set label description
        name: "",
        // name for the input
        value: "",
        // value for the input
        readonly: false,
        // set readonly of the input 
        enabled: true // set enabled of the input 

      }, settings);
      s = me.settings;
      me.addEvents(me.settings, ["onChange"]); // set id

      me.id = s.id || Utils.id();
      me.input = $("<input id=\"".concat(me.id, "-item\" ") + "type='checkbox' " + "class='it-edit-input' " + //`name='${s.name || Utils.id()}[${s.value || Utils.id()}]' `+
      "name='".concat(s.name || Utils.id(), "' ") + "".concat(s.allowBlank == false ? "required" : "", " ") + "".concat(s.readonly ? " readonly " : "", " ") + "".concat(s.enabled == false ? " disabled " : "", " ") + "value='".concat(s.value || Utils.id(), "' ") + ">");
      me.input.on("change", function () {
        me.doEvent("onChange", [me, this.checked]);
      }); //wrapper

      me.content = $("<div class='it-edit for-option' />").append(me.input).append("<label for=\"".concat(me.id, "-item\" ") + "class='it-input-label it-input-label-".concat(s.labelAlign || 'left', "'") + ">".concat(s.label, "</label>"));
      me.readyState = true;
      return _this;
    }

    _createClass(CheckBox, [{
      key: "checked",
      get: function get() {
        return this.input.is(":checked");
      },
      set: function set() {
        var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        this.input.prop('checked', v);
      }
    }]);

    return CheckBox;
  }(FormItem);

  var Dialog =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Dialog, _Component);

    /** @param  {object} opt  */
    function Dialog(opt) {
      var _this;

      _classCallCheck(this, Dialog);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Dialog).call(this, opt));

      var me = _assertThisInitialized(_assertThisInitialized(_this));
      /** 
       * Wether is element exists
       * @member {boolean}
       * @name IT.Dialog#elExists
       */


      me.elExist = false;
      /** 
       * Setting for class
       * @member {Object}
       * @name IT.Dialog#settings
       * @property {String} id ID of element
       * @property {String} title title of the window
       * @property {String} iconCls iconCls
       * @property {array} items items
       * @property {boolean} overlay overlay
       * @property {boolean} autoShow autoShow
       * @property {number} width width
       * @property {number} height height
       * @property {boolean} autoHeight autoHeight
       * @property {boolean} cancelable cancelable
       * @property {object} css css
       */

      me.settings = $.extend(true, {
        id: '',
        title: '',
        iconCls: '',
        items: [],
        footers: [],
        overlay: true,
        autoShow: true,
        width: 300,
        height: 100,
        autoHeight: true,
        cancelable: false,
        css: {}
      }, opt);
      /** 
       * ID of class or element
       * @member {boolean}
       * @name IT.Dialog#id
       */

      me.id = me.settings.id || Utils.id();
      me.addEvents(me.settings, ["onShow", "onHide", "onClose"]);
      me.ids = [];
      me.items = {};
      if (me.settings.autoShow) me.show();else me.createElement();
      return _this;
    }
    /**
     * Create HTML Element
     */


    _createClass(Dialog, [{
      key: "createElement",
      value: function createElement() {
        var me = this;
        if (me.elExist) return;
        me.content = $("\n\t\t\t<div class=\"it-dialog\">\n\t\t\t\t<div class=\"it-dialog-container\">\n\t\t\t\t\t<div class=\"it-dialog-header\"></div>\n\t\t\t\t\t<div class=\"it-dialog-content\"></div>\n\t\t\t\t\t<div class=\"it-dialog-footer\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t");

        if (me.settings.title) {
          var dialogTitle = $('<div/>', {
            class: 'it-title',
            html: me.settings.title
          });

          if (me.settings.iconCls) {
            var iconTitle = $('<span/>', {
              class: 'fa fa-' + me.settings.iconCls
            });
            iconTitle.prependTo(dialogTitle);
          }

          me.content.find('.it-dialog-header').append(dialogTitle);
        }

        if (!me.settings.overlay) {
          me.content.addClass("no-overlay");
        }

        $.each(me.settings.items, function (k, el) {
          if (el) {
            if (!el.isClass) el = Utils.createObject(el);
            el.renderTo(me.content.find('.it-dialog-content'));
            me.ids.push(el.getId());
            me.items[el.getId()] = el;
          }
        });
        $.each(me.settings.footers, function (k, el) {
          if (el) {
            if (!el.isClass) el = Utils.createObject(el);
            el.renderTo(me.content.find('.it-dialog-footer'));
            me.ids.push(el.getId());
            me.items[el.getId()] = el;
          }
        });
        me.content.find('.it-dialog-container').css({
          'max-width': me.settings.width
        });
        me.content.find('.it-dialog-content').css($.extend(true, me.settings.css, me.settings.autoHeight ? {
          'min-height': me.settings.height
        } : {
          height: me.settings.height
        }));
        me.content.appendTo('body').hide();
        me.elExist = true;

        if (me.settings.cancelable) {
          me.content.find('.it-dialog-container').click(function (e) {
            e.stopPropagation();
          });
          me.content.click(function () {
            me.close();
          });
        }
      }
    }, {
      key: "getItemCount",
      value: function getItemCount() {
        return this.ids.length;
      }
    }, {
      key: "getItem",
      value: function getItem(id) {
        if (typeof id === "number") id = this.ids[id];
        if (id) return this.items[id] || null;
        return this.items;
      }
      /** show the dialog, crete DOMelement if not exist, then add show() */

    }, {
      key: "show",
      value: function show() {
        var me = this;
        me.createElement();
        me.content.show(0, function () {
          $(this).addClass('dialog-show');
          $(this).find('.it-dialog-container').addClass('dialog-show');
        });
        me.doEvent("onShow", [me, me.id]);
        $(window).resize(function () {
          clearTimeout(window.resizedFinished);
          window.resizedFinished = setTimeout(function () {
            me.setScroll();
          }, 500);
        });
        $(window).trigger("resize");
      }
      /** hide the dialog, adding class display : none */

    }, {
      key: "hide",
      value: function hide() {
        var me = this;
        me.content.find('.it-dialog-container').removeClass('dialog-show').one(Utils.transitionEnd, function () {
          me.content.removeClass('dialog-show');
          me.doEvent("onHide", [me, me.id]);
        });
      }
      /** close the dialog, and remove the DOMelement */

    }, {
      key: "close",
      value: function close() {
        var me = this;
        me.content.find('.it-dialog-container').removeClass('dialog-show').one(Utils.transitionEnd, function () {
          me.content.removeClass('dialog-show').one(Utils.transitionEnd, function () {
            setTimeout(function () {
              me.elExist = false;
              me.content.remove();
              me.doEvent("onClose", [me, me.id]);
            }, 700);
          });
        });
      }
      /** 
       * Detection if the dialog height is wider than height of the window 
       * then automatically make the container dialog has a scroll
       * @private
       */

    }, {
      key: "setScroll",
      value: function setScroll() {
        var me = this,
            container = me.content.find('.it-dialog-container');
        container.height($(window).height() <= me.content.find('.it-dialog-content').height() ? $(window).height() - 50 : 'auto');
      }
    }]);

    return Dialog;
  }(Component);

  var MessageBox =
  /*#__PURE__*/
  function (_Component) {
    _inherits(MessageBox, _Component);

    function MessageBox(settings) {
      var _this;

      _classCallCheck(this, MessageBox);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MessageBox).call(this, settings));

      var me = _assertThisInitialized(_assertThisInitialized(_this));

      me.settings = $.extend(true, {
        id: '',
        type: 'info',
        title: 'Title Here !',
        message: 'Message Here !',
        width: 450,
        css: {},
        buttons: [],
        btnAlign: 'right',
        autoShow: true
      }, settings);
      me.id = me.settings.id || Utils.id();
      var html = "\n\t\t\t<div id=\"".concat(me.id, "\" class=\"it-messagebox\">\n\t\t\t\t<div class=\"it-messagebox-container\">\n\t\t\t\t\t<div class=\"it-messagebox-title message-").concat(me.settings.type, "\">").concat(me.settings.title, "</div>\n\t\t\t\t\t<div class=\"it-messagebox-content\">\n\t\t\t\t\t\t<div class=\"it-messagebox-icon\">\n\t\t\t\t\t\t\t<div class=\"message-icon message-icon-").concat(me.settings.type, "\"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"it-messagebox-text\">\n\t\t\t\t\t\t\t").concat(me.settings.message, "\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"it-messagebox-btn ").concat(me.settings.btnAlign, "\"></div>\n\t\t\t\t</div>\n\t\t\t</div>");
      me.content = $(html);
      me.content.find('.it-messagebox-container').css($.extend(me.settings.css, {
        'max-width': me.settings.width
      }));

      if (me.settings.buttons.length == 0) {
        var btn = new Button({
          text: 'OK',
          handler: function handler() {
            me.hide();
          }
        });
        btn.renderTo(me.content.find('.it-messagebox-btn'));
      } else {
        $.each(me.settings.buttons, function (k, el) {
          el = $.extend({
            xtype: 'button'
          }, el);
          if (typeof el.renderTo !== 'function') el = Utils.createObject(el);
          el.renderTo(me.content.find('.it-messagebox-btn'));
        });
      }

      me.content.appendTo('body').hide();
      if (me.settings.autoShow) me.show();
      return _this;
    }

    _createClass(MessageBox, [{
      key: "show",
      value: function show() {
        var me = this;
        $('input, select, textarea').blur();
        me.content.show(0, function () {
          $(this).addClass('message-show');
          $(this).find('.it-messagebox-container').addClass('message-show');
        });
      }
    }, {
      key: "hide",
      value: function hide() {
        var me = this;
        me.content.find('.it-messagebox-container').removeClass('message-show').one(Utils.transitionEnd, function () {
          me.content.removeClass('message-show').one(Utils.transitionEnd, function () {
            setTimeout(function () {
              me.content.remove();
            }, 300);
          });
        });
      }
    }, {
      key: "close",
      value: function close() {
        this.hide();
      }
    }]);

    return MessageBox;
  }(Component);

  var Tabs =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Tabs, _Component);

    function Tabs(settings) {
      var _this;

      _classCallCheck(this, Tabs);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Tabs).call(this, settings));

      var me = _assertThisInitialized(_assertThisInitialized(_this));

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
      me.content = $("\n\t\t\t<div id=\"".concat(me.id, "\" class=\"it-tabs\">\n\t\t\t<ul class=\"it-tabs-menu ").concat(me.settings.titles.align, "\"></ul>\n\t\t\t<div class=\"it-tabs-overflow\">\n\t\t\t<span class=\"btn-overflow\"><i class=\"fa fa-angle-down\"></i></span>\n\t\t\t<ul class=\"menu-overflow\"></ul>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"it-tabs-container\"></div>\n\t\t\t\t</div>"));
      me.content.css(me.settings.autoHeight ? 'min-height' : 'height', me.settings.height); // Loop judul tab

      me.idsTitle = [];
      $.each(me.settings.titles.items, function (k, v) {
        var id = Utils.id();
        var titleTab = $('<li/>', {
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
      }); // Loop berdasarkan ids untuk membuat konten

      me.ids = [];
      $.each(me.settings.items, function (k, el) {
        if (el) {
          // Buat Div Tab konten
          var itemTab = $('<div/>', {
            class: 'it-tabs-content',
            id: me.idsTitle[k]
          });
          if (!el.isClass) el = Utils.createObject(el);
          el.renderTo(itemTab);
          me.ids.push(el.getId());
          me.items[el.getId()] = el;
          itemTab.appendTo(me.content.find('.it-tabs-container'));
        }
      }); // Event dan Trigger untuk tombol overflow

      me.content.find('.btn-overflow').click(function () {
        $(this).next().toggle();
      });
      return _this;
    }

    _createClass(Tabs, [{
      key: "renderTo",
      value: function renderTo(obj) {
        _get(_getPrototypeOf(Tabs.prototype), "renderTo", this).call(this, obj);

        var me = this;
        $(window).resize(function () {
          me._autoShowMore();
        });

        me._autoShowMore();

        me.setActive(me.settings.defaultIndexActive); // Still Bugs 

        setTimeout(function () {
          me._autoShowMore();
        }, 10);
      }
    }, {
      key: "setActive",
      value: function setActive(index) {
        var cur,
            me = this,
            el = me.content.find('.it-tabs-menu li').eq(index);
        if (el.length < 1) throw 'offset index';
        me.content.find(".tab-active").removeClass("tab-active");
        cur = el.addClass("tab-active");
        me.content.find('#' + cur.data('tab')).addClass('tab-active');
      }
    }, {
      key: "getActive",
      value: function getActive() {
        var el = this.getContent().find('.it-tabs-menu li.tab-active');
        return {
          index: el.index(),
          content: el
        };
      }
    }, {
      key: "_autoShowMore",
      value: function _autoShowMore() {
        var me = this;
        var menuOverflow = me.content.find('.menu-overflow');
        menuOverflow.empty();
        var menu = me.content.find('.it-tabs-menu li');
        menu.show();
        menu.each(function () {
          if ($(this).position().left + $(this).outerWidth() > me.content.width()) {
            $(this).clone(true).appendTo(menuOverflow);
            $(this).hide();
          }
        });
        me.content.find('.it-tabs-overflow').toggle(menuOverflow.children('li').length > 0);
      }
    }, {
      key: "getItemCount",
      value: function getItemCount() {
        return this.ids.length;
      }
    }, {
      key: "getItem",
      value: function getItem(id) {
        if (typeof id === "number") id = this.ids[id];
        if (id) return this.items[id] || null;
        return this.items;
      }
    }]);

    return Tabs;
  }(Component);

  var Flex =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Flex, _Component);

    function Flex(params) {
      var _this;

      _classCallCheck(this, Flex);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Flex).call(this));

      var me = _assertThisInitialized(_assertThisInitialized(_this));

      me.settings = $.extend(true, {
        // Object.assign in deep
        id: '',
        title: "",
        iconTitle: "",
        direction: 'row',
        wrap: '',
        //nowrap | wrap | wrap-reverse
        justifyContent: '',
        css: {},
        alignItems: '',
        //flex-start | flex-end | center | baseline | stretch. Default: stretch
        alignContent: '',
        //flex-start | flex-end | center | space-between | space-around | stretch. Default: stretch
        items: []
      }, params);
      me.id = me.settings.id || Utils.id();
      me.content = $('<div />', {
        id: me.id,
        class: 'it-flex'
      });
      me.content.css(me.settings.css || {});
      me.content.addClass('it-flex-dir dir-' + me.settings.direction);
      me.content.addClass('it-flex-wrap wrap-' + me.settings.wrap);
      me.content.addClass('it-flex-jc jc-' + me.settings.justifyContent);
      me.content.addClass('it-flex-ai ai-' + me.settings.alignItems);
      me.content.addClass('it-flex-ac ac-' + me.settings.alignContent);

      if (me.settings.title) {
        var title = $('<div/>', {
          class: 'it-title',
          html: me.settings.title
        });
        title.prepend($('<span/>', {
          class: 'fa' + (me.settings.iconTitle ? ' fa-' + me.settings.iconTitle : "")
        }));
        me.content.append(title);
      }

      $.each(me.settings.items, function (k, el) {
        if (el) {
          if (typeof el.renderTo !== 'function') el = Utils.createObject(el);
          if (typeof el.settings.flex !== 'undefined') el.content.addClass('it-flex-item');
          el.renderTo(me.content);
        }
      });
      return _this;
    }

    return Flex;
  }(Component);

  var Grid =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Grid, _Component);

    /** @param {object} opt */
    function Grid(settings) {
      var _this;

      _classCallCheck(this, Grid);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Grid).call(this, settings));

      var me = _assertThisInitialized(_assertThisInitialized(_this));
      /** 
       * Setting for class
       * @member {Object}
       * @name IT.Grid#settings
       * @property {String} id id the classs
       * @property {enum} type : [row, colomn]
       * @property {string} columnRule any 12 bootstrap grid system. ex : "col-sm-12", "col-md-8"
       * @property {object} css style for this item
       */


      me.settings = $.extend(true, {
        id: '',
        columnRule: '',
        rowContainer: '',
        css: {},
        items: []
      }, settings); // set id

      me.id = me.settings.id || Utils.id();

      if (me.settings.columnRule) {
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

      me.ids = [];
      me.items = {}; // Set CSS ke objek

      me.content.css(me.settings.css); // Looping semua yang ada di items

      $.each(me.settings.items, function (k, el) {
        if (el) {
          if (typeof el.renderTo !== 'function') el = Utils.createObject(el);
          el.renderTo(me.content);
          me.ids.push(el.getId());
          me.items[el.getId()] = el;
        }
      }); // Berikan Container

      if (me.settings.columnRule == '' && me.settings.rowContainer == 'fluid') {
        me.content = $('<div/>', {
          class: 'container-fluid'
        }).append(me.content);
      } else if (me.settings.columnRule == '' && me.settings.rowContainer == 'standar') {
        me.content = $('<div/>', {
          class: 'container'
        }).append(me.content);
      }

      return _this;
    }

    _createClass(Grid, [{
      key: "getItemCount",
      value: function getItemCount() {
        return this.ids.length;
      }
    }, {
      key: "getItem",
      value: function getItem(id) {
        if (typeof id === "number") id = this.ids[id];
        if (id) return this.items[id] || null;
        return this.items;
      }
    }]);

    return Grid;
  }(Component);

  var HTML =
  /*#__PURE__*/
  function (_Component) {
    _inherits(HTML, _Component);

    /** @param {object} settings */
    function HTML(settings) {
      var _this;

      _classCallCheck(this, HTML);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(HTML).call(this, settings));

      var me = _assertThisInitialized(_assertThisInitialized(_this));
      /** 
       * Setting for class
       * @member {Object}
       * @name IT.HTML#settings
       * @property {string} id id the classs
       * @property {string} url if url given, HTML will load data from url then append it content to this content
       * @property {string} content content to be shown
       * @property {object} css style for this item
       * @property {string} class append this string to attribute class
       */


      me.settings = $.extend(true, {
        id: '',
        url: '',
        content: '',
        css: {},
        data: {},
        class: ''
      }, settings);
      me.id = me.settings.id || Utils.id();
      me.content = $('<div/>', {
        id: me.id
      });
      if (me.settings.class) me.content.addClass(me.settings.class);
      me.content.css(me.settings.css);
      if (me.settings.url) me.content.load(me.settings.url);else {
        var length = Object.keys(me.settings.data).length;

        if (length) {
          me.settings.content = me.templateReplacer(me.settings.content, me.settings.data);
        }

        me.content.html(me.settings.content);
      }
      return _this;
    }
    /**
     * set the desire content to HTML
     * @param {string|selector}  html    the content that'll be replaced to
     * @param {Boolean} replace replace mode, if set true, before appending, this content will be empty before
     */


    _createClass(HTML, [{
      key: "setContent",
      value: function setContent(html) {
        var replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (replace) this.content.empty();

        if (typeof html === 'string') {
          if (Object.keys(this.settings.data).length) {
            html = me.templateReplacer(this.settings.content, this.settings.data);
          }

          this.content.append(html);
        } else html.appendTo(this.content);
      }
      /**
       * simple template replacer
       * @param {string|selector} 
       * @param {Object} 
       */

    }, {
      key: "templateReplacer",
      value: function templateReplacer(template, data) {
        return template.trim().replace(/\{\{([\w\.]*)\}\}/g, function (str, key) {
          var keys = key.split("."),
              v = data[keys.shift()];

          for (var i = 0, l = keys.length; i < l; i++) {
            v = v[keys[i]];
          }

          return typeof v !== "undefined" && v !== null ? v : "";
        });
      }
    }]);

    return HTML;
  }(Component);

  var DataTable =
  /*#__PURE__*/
  function (_Component) {
    _inherits(DataTable, _Component);

    function DataTable(settings) {
      var _this;

      _classCallCheck(this, DataTable);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DataTable).call(this, settings));

      var me = _assertThisInitialized(_assertThisInitialized(_this));
      /** 
       * Setting for class
       * @member {Object}
       * @name IT.DataTable#settings
       * @property {string} id ID of element
       */


      me.settings = $.extend(true, {
        id: "",
        cls: 'it-datatable',
        width: '100%',
        height: '',
        cellEditing: true,
        enableFixedHeader: true,
        wrap: false,
        paging: true,
        store: {
          type: 'json',
          params: {
            start: 0,
            limit: 20
          }
        },
        columns: [{}],
        customHeader: ""
      }, settings);
      me.id = me.settings.id || Utils.id();
      me.params = {};
      me.selectedRow = null;
      me.selectedColumn = null;
      me.editors = [];
      me.paging = {
        page: 1,
        page_count: 0,
        total_rows: 0
      };
      me.addEvents(me.settings, ["onItemClick", "onItemDblClick", "onLoad", "onChangePage"]);
      me.createComponent();
      /**
       * store data
       * @member {boolean}
       * @name IT.DataTable#store
       * @see IT.Store
       */

      if (!me.settings.store.isClass) {
        var cstmStore =
        /*#__PURE__*/
        function (_Store) {
          _inherits(cstmStore, _Store);

          function cstmStore() {
            _classCallCheck(this, cstmStore);

            return _possibleConstructorReturn(this, _getPrototypeOf(cstmStore).apply(this, arguments));
          }

          _createClass(cstmStore, [{
            key: "load",
            value: function load(opt) {
              var readyState = true;
              var thse = this;
              thse.doEvent("beforeLoad");
              me.editors.forEach(function (e) {
                if (e && e.isClass) readyState = readyState && !!e.readyState;
              });
              if (!readyState) setTimeout(function () {
                thse.load.call(thse, opt);
              }, 1000);else _get(_getPrototypeOf(cstmStore.prototype), "load", this).call(this, opt);
            }
          }]);

          return cstmStore;
        }(Store);

        me.store = new cstmStore(me.settings.store);
        me.store.addEvents({
          beforeLoad: function beforeLoad() {
            me.content.find(".it-datatable-wrapper").animate({
              scrollTop: 0
            }, "slow");
            me.content.find('.it-datatable-loading-overlay').addClass('loading-show');
          },
          afterLoad: function afterLoad(event, store, storeData, params) {
            me.content.find('.it-datatable-loading-overlay').removeClass('loading-show');
            me.assignData(store);
            me.doEvent("onLoad", [me, store]);
            me.selectedRow = null;
            me.selectedColumn = null;
          },
          onEmpty: function onEmpty(event, store, storeData, params) {
            me.assignData(store);
            me.doEvent("onLoad", [me, store]);
            me.content.find('.it-datatable-loading-overlay').removeClass('loading-show');
          }
        });
        cstmStore = null;
        me.params = me.store.params;
      }

      return _this;
    }
    /**
     * Create element content
     */


    _createClass(DataTable, [{
      key: "createComponent",
      value: function createComponent() {
        var me = this,
            s = me.settings; //content .it-datatable

        me.content = $('<div />', {
          id: me.id,
          class: s.cls
        }).width(s.width).height(s.height); // wrapper

        var wrapper = $("<div class=\"it-datatable-wrapper\"/>");
        var fixHeader = $("<div class=\"it-datatable-fixed-header\"/>");
        var table = $("<table width='100%' />");
        var thead = $("<thead />");
        var tbody = $("<tbody />");
        me.content.append(wrapper.append(table.append(thead))); //create header

        if (s.customHeader) thead.append($(s.customHeader));else {
          var col,
              tr = $("<tr/>");

          for (var i = 0; i < s.columns.length; i++) {
            col = s.columns[i];
            tr.append($("<th />", {
              css: {
                // to precise width
                "min-width": col.width,
                "width": col.width
              }
            }).append(col.header));

            if (col.editor && col.editor.store && (col.editor.store.type == "ajax" || col.editor.store.type == "json")) {
              me.editors.push(Utils.createObject($.extend(true, {}, col.editor, {
                width: col.width
              })));
            } else me.editors.push(col.editor);
          }

          thead.append(tr);
        }

        if (s.enableFixedHeader) {
          me.content.append(fixHeader.append(table.clone()));
        }

        table.append(tbody);

        if (s.paging) {
          me.content.append("\n\t\t\t\t<div class=\"it-datatable-pagination\" >\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li><button class=\"it-datatable-icon\" data-page=\"first\"><span class=\"fa fa-step-backward\"></span></button></li>\n\t\t\t\t\t\t<li><button class=\"it-datatable-icon\" data-page=\"back\"><span class=\"fa fa-chevron-left\"></span></button></li>\n\t\t\t\t\t\t<li> \n\t\t\t\t\t\t\t<input type=\"text\" class=\"it-datatable-pagination-current\" value=\"1\"> /\n\t\t\t\t\t\t \t<span class=\"it-datatable-pagination-page\">0</span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li><button class=\"it-datatable-icon\" data-page=\"next\"><span class=\"fa fa-chevron-right\"></span></button></li>\n\t\t\t\t\t\t<li><button class=\"it-datatable-icon\" data-page=\"last\"><span class=\"fa fa-step-forward\"></span></button></li>\n\t\t\t\t\t\t<li >\n\t\t\t\t\t\t\tMenampilkan\n\t\t\t\t\t\t\t<span class='it-datatable-pagination-show'>0</span> \n\t\t\t\t\t\t\tdari\n\t\t\t\t\t\t\t<span class='it-datatable-pagination-count'>0</span> \n\t\t\t\t\t\t\tData\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t\t\t<div class='it-datatable-pagination-info'></div>\n\t\t\t\t</div>\n\t\t\t");
          me.content.find(".it-datatable-pagination .it-datatable-icon").click(function () {
            if (me.getDataChanged().length) {
              var msg = new MessageBox({
                type: 'question',
                title: 'Konfirmasi',
                width: 400,
                message: 'Perubahan data belum di simpan. Yakin akan berpindah halaman ?',
                buttons: [{
                  text: 'Ya',
                  handler: function handler() {
                    me.setPage($(this).data("page"));
                  }
                }, {
                  text: 'Tidak',
                  handler: function handler() {
                    msg.close();
                  }
                }]
              });
            } else me.setPage($(this).data("page"));
          });
          me.content.find(".it-datatable-pagination .it-datatable-pagination-current").change(function () {
            me.setPage($(this).val());
          }); // Loading Inline

          var loadingInline = $("\n\t\t\t\t<div class=\"it-datatable-loading-overlay\">\n\t\t\t\t\t<div class=\"it-loading-rolling\"></div>\n\t\t\t\t</div>\n\t\t\t");
          me.content.append(loadingInline);
        }
      }
      /**
       * Assign Data from store
       * @param  {IT.Store} store 
       */

    }, {
      key: "assignData",
      value: function assignData(store) {
        var me = this,
            storeData = store.getData();

        if (storeData.length) {
          me.content.find("table").animate({
            scrollTop: 0
          }, "slow");
        }

        me.content.find("tbody").empty();
        var start = me.params.start;
        var limit = me.params.limit;
        var last_data = start + limit < store.total_rows ? start + limit : store.total_rows;
        var data_show = store.total_rows > 0 ? start + 1 + "/" + last_data : "0";
        var page_count = Math.ceil(store.total_rows / limit);
        me.paging = Object.assign({}, me.paging, {
          start: start,
          limit: limit,
          page_count: page_count,
          total_rows: store.total_rows
        });
        me.content.find('.it-datatable-pagination-show').html(data_show);
        me.content.find('.it-datatable-pagination-count').html(store.total_rows);
        me.content.find('.it-datatable-pagination-page').html(page_count);

        if (start == 0) {
          me.content.find('.it-datatable-pagination-current').val(1);
        }

        if (storeData.length) {
          for (var indexRow = 0; indexRow < storeData.length; indexRow++) {
            //let curRecord = storeData[indexRow];
            me.addRow(storeData[indexRow]);
          }
        }
      }
      /**
       * Overide renderTo
       * @override
       * @param  {Element} parent Element to be placed
       */

    }, {
      key: "renderTo",
      value: function renderTo(parent) {
        _get(_getPrototypeOf(DataTable.prototype), "renderTo", this).call(this, parent);

        var me = this;
        me.content.find('.it-datatable-wrapper').scroll(function () {
          me.content.find('.it-datatable-fixed-header').scrollLeft($(this).scrollLeft());
        });
      }
      /**
       * [getDataChanged description]
       * @return {array} array of object
       */

    }, {
      key: "getDataChanged",
      value: function getDataChanged() {
        var me = this,
            r = [];

        for (var key in me.store.data) {
          if (me.store.data[key].isChanged()) r.push(me.store.data[key].getChanged());
        }

        return r;
      }
    }, {
      key: "setPage",
      value: function setPage() {
        var to = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var me = this;

        if (me.store.getData().length) {
          switch (to) {
            case 'first':
              if (me.paging.page != 1) {
                me.paging.page = 1;
                me.loadPage(1);
              }

              break;

            case 'last':
              if (me.paging.page != me.paging.page_count) {
                me.paging.page = me.paging.page_count;
                me.loadPage(me.paging.page_count);
              }

              break;

            case 'next':
              if (me.paging.page < me.paging.page_count) {
                me.paging.page++;
                me.loadPage(me.paging.page);
              }

              break;

            case 'back':
              if (me.paging.page > 1) {
                me.paging.page--;
                me.loadPage(me.paging.page);
              }

              break;

            default:
              if (to >= 1 && to <= me.paging.page_count) {
                me.paging.page = to;
                me.loadPage(to);
              } else {
                alert("Invalid page");
                me.content.find(".it-datatable-pagination-current").val(me.paging.page);
                throw "Invalid page";
              }

              break;
          }
        }
      }
    }, {
      key: "loadPage",
      value: function loadPage(page) {
        var me = this;
        var start = (page - 1) * me.paging.limit;
        me.content.find(".it-datatable-pagination .it-datatable-pagination-current").val(page);
        me.store.load({
          params: {
            start: start,
            limit: me.paging.limit
          }
        });
      }
    }, {
      key: "getSelectedRecords",
      value: function getSelectedRecords() {
        var me = this;
        return me.selectedRow === null ? null : me.store.data[me.selectedRow];
      }
    }, {
      key: "addRow",
      value: function addRow() {
        var curRecord = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var me = this;
        var row_element = $("<tr>");

        var _loop = function _loop(indexCol) {
          var editor = me.editors[indexCol],
              current_col = me.settings.columns[indexCol],
              field = current_col.dataIndex,
              value = curRecord.get(field);

          if (editor) {
            editor = editor.isClass ? editor : Utils.createObject($.extend(true, {}, current_col.editor, {
              width: current_col.width
            }));
          }

          var render = current_col.data || current_col.renderer || (editor && editor.store ? editor.store.getRawData() : null) || [],
              html = Utils.findData(value, render),
              td = $("<td />", {
            html: $("<div />", {
              html: html == "" ? value : html
            }),
            valign: current_col.valign || "top",
            align: current_col.align || "left",
            class: "" + (me.settings.wrap ? "wrap" : "")
          });

          if (editor && editor.className == "checkbox") {
            td.find("div").empty();
            editor.addEvents({
              onChange: function onChange() {
                curRecord.update(field, editor.checked);
                td[curRecord.isChanged(field) ? "addClass" : "removeClass"]("it-datatable-changed");
              }
            });
            editor.checked = !!value;
            editor.renderTo(td.find("div"));
          }

          td.on('click', function () {
            me.selectedRow = td.parent().index();
            me.selectedColumn = td.index();
            me.content.find("tbody tr").removeClass('it-datatable-selected');
            td.parent().addClass('it-datatable-selected');

            if (editor && editor.className !== "checkbox" && current_col.editor.editable && !td.hasClass("it-datatable-editing") && !curRecord.isLocked(field)) {
              td.find("div").empty();
              td.addClass("it-datatable-editing");
              editor.val(curRecord.getChanged(field) || curRecord.get(field));
              editor.input.on("blur", function () {
                if (editor.validate()) {
                  curRecord.update(field, editor.val());
                  editor.input.off();
                  editor.content.detach();
                  td.removeClass("it-datatable-editing");
                  td.find("div").html(Utils.findData(curRecord.getChanged(field) || curRecord.get(field), render));
                  td[curRecord.isChanged(field) ? "addClass" : "removeClass"]("it-datatable-changed");
                }
              });
              editor.renderTo(td.find("div"));
              editor.input.focus();
            }
          }).on("dblclick", function (el) {
            me.doEvent("onItemDblClick", [me, me.getSelectedRecords()]);
          });
          row_element.append(td);
        };

        for (var indexCol = 0; indexCol < me.settings.columns.length; indexCol++) {
          _loop(indexCol);
        }

        me.content.find("tbody").append(row_element);
      }
    }, {
      key: "removeRow",
      value: function removeRow() {
        var indexRow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
        var me = this;
        indexRow = indexRow < 0 ? me.selectedRow : indexRow;
        me.content.find("tbody>tr").eq(indexRow).remove();
        me.selectedRow = null;
        me.selectedColumn = null;
      }
    }]);

    return DataTable;
  }(Component);

  var itFramework = {
    // **** Start: Component ****/
    // Form
    Form: Form,
    Button: Button,
    TextBox: TextBox,
    Select: Select,
    CheckBox: CheckBox,
    // Toolbar
    Toolbar: Toolbar,
    // Dialog
    Dialog: Dialog,
    MessageBox: MessageBox,
    // Tabs
    Tabs: Tabs,
    // Layouts
    Flex: Flex,
    Grid: Grid,
    // Raw HTML
    HTML: HTML,
    // **** End: UI ****/
    // **** Start: Data Management ****/
    RecordStore: RecordStore,
    Store: Store,
    // Data Table
    DataTable: DataTable //** End: Data Management ****/

  };

  return itFramework;

}());
