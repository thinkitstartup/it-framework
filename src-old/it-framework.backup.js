var IT = IT || {};

var base_url = base_url || "";

var base_events = [ "blur", "change", "click", "dblclick", "focus", "hover", "keydown", "keypress", "keyup", "show", "hide" ];

var transitionEnd = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";

var animationEnd = "webkitAnimationEnd oanimationend msAnimationEnd animationend";

(function(t) {
    t.fn.serializeObject = function() {
        var e = {};
        var n = function(n, s) {
            var i = e[s.name];
            if (typeof i !== "undefined" && i !== null) {
                if (t.isArray(i)) i.push(s.value); else e[s.name] = [ i, s.value ];
            } else e[s.name] = s.value;
        };
        t.each(this.serializeArray(), n);
        return e;
    };
})(jQuery);

IT.BaseClass = class {
    constructor(t) {
        let e = this;
        e._id = "";
        e.settings = t || {};
    }
    get className() {
        return this.classname || this.settings.xtype || this.settings.x || undefined;
    }
    get isClass() {
        return true;
    }
    addEvents(t, e = []) {
        let n = this;
        if (e.length == 0) {
            Object.keys(t).forEach(n => typeof t[n] == "function" ? e.push(n) : null);
        }
        let s = t.selector || $(n);
        e.forEach(e => s.on(e, t[e] || IT.Utils.emptyFn));
    }
    doEvent(t, e) {
        $(this).trigger(t, e);
    }
    clearEvents(t = {}) {
        let e = t.selector || $(this).off();
    }
};

IT.Component = class extends IT.BaseClass {
    constructor(t) {
        super(t);
        let e = this;
        e.content = null;
    }
    renderTo(t) {
        if (this.content.appendTo) {
            this.content.appendTo(t);
        }
    }
    get id() {
        return this._id;
    }
    set id(t) {
        this._id = t;
    }
    getId() {
        return this.id;
    }
    getContent() {
        return this.content;
    }
    getSetting() {
        return this.settings;
    }
};

IT.Button = class extends IT.Component {
    constructor(t) {
        super(t);
        let e = this;
        e.settings = $.extend(true, {
            id: "",
            buttonClass: "",
            iconClass: "",
            enable: true,
            enableDropdown: true,
            text: "Tombol",
            items: [],
            css: {}
        }, t);
        e.id = e.settings.id || IT.Utils.id();
        e.enable = e.settings.enable;
        e.addEvents(e.settings, [ "onClick" ]);
        let n = $("<a/>", {
            id: e.id,
            html: e.settings.text,
            class: "it-btn " + e.settings.buttonClass,
            css: e.settings.css
        });
        n.click(function(t) {
            if (e.enable) {
                if (typeof e.settings.handler === "function") e.settings.handler.call();
                e.doEvent("onClick", [ e, e.id ]);
                t.stopPropagation();
            }
        });
        if (e.settings.iconClass) {
            let t = $("<span/>", {
                class: "fa fa-" + e.settings.iconClass,
                html: "&nbsp;"
            });
            n.prepend(t);
        }
        e.content = n;
        if (!e.settings.enable) {
            e.setEnable(false);
        }
        if (e.settings.items.length) {
            let t = $("<div/>", {
                class: "it-btn-group"
            });
            t.append(e.content);
            let n = new IT.Button({
                iconClass: "angle-down",
                buttonClass: e.settings.buttonClass + " btn-dropdown ",
                text: "",
                handler: function() {
                    e.content.find(".menu-group").toggle();
                    s.removeClass("menu-reverse");
                    if (s.offset().top + s.outerHeight() > $(window).height()) {
                        s.addClass("menu-reverse");
                    }
                }
            });
            n.setEnable(e.settings.enableDropdown);
            n.renderTo(t);
            let s = $("<ul/>", {
                class: "menu-group"
            });
            $.each(e.settings.items, function(t, e) {
                if (e) {
                    let t = $("<li/>", {
                        class: "clearfix"
                    });
                    if (typeof e === "string") {
                        e = IT.Utils.createObject({
                            xtype: "html",
                            content: $("<div/>", {
                                class: "menu-group-separator"
                            })
                        });
                    } else if (!e.isClass) {
                        e = $.extend(true, {
                            xtype: "button"
                        }, e);
                        e = IT.Utils.createObject(e);
                    }
                    e.renderTo(t);
                    t.appendTo(s);
                }
            });
            t.append(s);
            e.content = t;
        }
    }
    renderTo(t) {
        super.renderTo(t);
        if (this.settings.items.length) {
            $(document).click(function(t) {
                if (!$(t.target).closest(".menu-group").length) {
                    $(".menu-group").hide();
                }
            });
        }
    }
    setEnable(t) {
        this.enable = t;
        this.content[this.enable ? "removeClass" : "addClass"]("btn-disabled");
    }
    setText(t) {
        let e = this;
        e.content.html(t);
    }
};

IT.FormItem = class extends IT.Component {
    constructor(t) {
        super(t);
        let e = this;
        e._readyState = false;
        e.addEvents(e.settings, [ "stateChange" ]);
        e.readyState = true;
    }
    get readyState() {
        return this._readyState;
    }
    set readyState(t) {
        this._readyState = t;
        this.doEvent("stateChange", t);
    }
    val(t) {
        if (typeof t === "undefined") return this.input.val(); else return this.input.val(t);
    }
    setInvalid(t = true) {
        if (this.input) this.input[t ? "addClass" : "removeClass"]("invalid");
    }
    validate() {
        return !(!this.settings.allowBlank && this.val() == "");
    }
    setReadonly(t = false) {
        if (this.input) this.input.attr("readonly", t)[t ? "addClass" : "removeClass"]("input-readonly");
    }
    setEnabled(t = false) {
        if (this.input) this.input.attr("disabled", !t)[!t ? "addClass" : "removeClass"]("input-disabled");
    }
};

IT.CheckBox = class extends IT.FormItem {
    constructor(t) {
        super(t);
        let e = this, n;
        e.settings = $.extend(true, {
            x: "checkbox",
            id: "",
            label: "",
            name: "",
            value: "",
            readonly: false,
            enabled: true
        }, t);
        n = e.settings;
        e.addEvents(e.settings, [ "onChange" ]);
        e.id = n.id || IT.Utils.id();
        e.input = $(`<input id="${e.id}-item" ` + `type='checkbox' ` + `class='it-edit-input' ` + `name='${n.name || IT.Utils.id()}' ` + `${n.allowBlank == false ? `required` : ""} ` + `${n.readonly ? ` readonly ` : ""} ` + `${n.enabled == false ? ` disabled ` : ""} ` + `value='${n.value || IT.Utils.id()}' ` + `>`);
        e.input.on("change", function() {
            e.doEvent("onChange", [ e, this.checked ]);
        });
        e.content = $("<div class='it-edit for-option' />").append(e.input).append(`<label for="${e.id}-item" ` + `class='it-input-label it-input-label-${n.labelAlign || "left"}'` + `>${n.label}</label>`);
        e.readyState = true;
    }
    get checked() {
        return this.input.is(":checked");
    }
    set checked(t = true) {
        this.input.prop("checked", t);
    }
};

IT.RecordStore = class extends IT.BaseClass {
    constructor(t) {
        super();
        let e = this;
        e.commited = false;
        e.rawData = t, e.changed = {}, e.field = Object.keys(t);
        e.locked = [];
    }
    isChanged(t = null) {
        if (t) {
            return t in this.changed;
        } else return Object.keys(this.changed).length > 0;
    }
    update(t, e) {
        let n = this;
        if (n.rawData.hasOwnProperty(t)) {
            if (n.rawData[t] == e) {
                if (n.changed.hasOwnProperty(t)) {
                    delete n.changed[t];
                    return true;
                }
            } else {
                n.changed[t] = e;
                return true;
            }
        } else {
            console.error("Field " + t + " is not exists");
        }
        return false;
    }
    getChanged(t = null) {
        let e = this;
        if (t) {
            return e.isChanged(t) ? e.changed[t] : null;
        } else return !e.isChanged() ? null : Object.assign({}, e.rawData, e.changed);
    }
    getRawData() {
        return this.rawData;
    }
    get(t, e) {
        return this.rawData[t];
    }
    isLocked(t) {
        return $.inArray(t, this.locked) > -1;
    }
};

IT.Store = class extends IT.BaseClass {
    constructor(t) {
        super(t);
        let e = this;
        e.settings = $.extend(true, {
            type: "json",
            url: "",
            data: [],
            autoLoad: false,
            params: {
                start: 0,
                limit: 20
            }
        }, t);
        e.params = e.settings.params;
        e.data = [];
        e.total_rows = 0;
        e.procces = false;
        e.addEvents(e.settings, [ "beforeLoad", "afterLoad", "onLoad", "onError", "onEmpty" ]);
        if (e.settings.autoLoad) e.load();
    }
    empty() {
        let t = this;
        t.total_rows = 0;
        t.data = [];
        t.doEvent("onEmpty", [ t, t.getData(), t.params ]);
    }
    load(t = {}) {
        let e = this;
        switch (e.settings.type) {
          case "ajax":
          case "json":
            e.settings.type = "json";
            var n = $.extend(e.settings.params, t.params);
            e.params = n;
            e.empty();
            $.ajax({
                dataType: e.settings.type,
                type: "POST",
                url: e.settings.url,
                data: n,
                beforeSend: function(t, n) {
                    e.procces = true;
                    e.total_rows = 0;
                    let s = e.doEvent("beforeLoad", [ e, t, n ]);
                    return typeof s == "undefined" ? true : s;
                },
                success: function(t) {
                    if (typeof t.rows != "undefined" && typeof t.total_rows != "undefined") {
                        $.each(t.rows, (t, n) => {
                            let s = new IT.RecordStore(n);
                            s.commited = true;
                            e.data.push(s);
                        });
                        e.total_rows = t.total_rows;
                        e.doEvent("onLoad", [ e, e.getData(), e.params ]);
                    } else e.doEvent("onError", [ e, {
                        status: false,
                        message: "Format Data Tidak Sesuai"
                    } ]);
                },
                error: function(t, n, s) {
                    e.doEvent("onError", [ e, {
                        status: n,
                        message: s
                    } ]);
                },
                complete: function() {
                    e.procces = false;
                    e.doEvent("afterLoad", [ e, e.getData() ]);
                }
            });
            break;

          case "array":
            e.total_rows = 0;
            e.procces = true;
            let s = e.doEvent("beforeLoad", [ e, e.data || [], null ]);
            if (typeof s == "undefined" ? true : s) {
                if (typeof e.settings.data != "undefined") {
                    $.each(e.settings.data, (t, n) => {
                        let s = new IT.RecordStore(n);
                        s.commited = true;
                        e.data.push(s);
                        e.total_rows++;
                    });
                    e.doEvent("onLoad", [ e, e.getData(), null ]);
                } else e.doEvent("onError", [ e, {
                    status: false,
                    message: "Data JSON '" + e.settings.url + "' Tidak Ditemukan"
                } ]);
            } else {
                e.empty();
                e.doEvent("onError", [ e, {
                    status: false,
                    message: "Format Data Tidak Sesuai"
                } ]);
            }
            e.doEvent("afterLoad", [ e, e.getData() ]);
            e.procces = false;
            break;
        }
    }
    sort(t, e = true) {
        throw "Deprecated, doesn't support ordering in front side";
    }
    getParams() {
        return this.params;
    }
    getData() {
        return this.data;
    }
    getRawData() {
        let t = this, e = [];
        $.each(t.data, (t, n) => {
            e.push(n.rawData);
        });
        return e;
    }
    getChangedData() {
        let t = this, e = [];
        for (let n in t.data) {
            if (t.data[n].changed) e.push($.extend({}, t.data[n].data, {
                indexRow: parseInt(n)
            }));
        }
        return e;
    }
    setData(t) {
        let e = this;
        t = e.type == "json" ? t.rows : t;
        e.empty();
        $.each(t, (t, n) => {
            let s = new IT.RecordStore(n);
            s.commited = true;
            e.data.push(s);
            e.total_rows++;
        });
        e.doEvent("onLoad", [ e, e.data, e.params ]);
    }
    getSetting() {
        return this.settings;
    }
    replace(t = {}, e = 0) {
        let n = this;
        for (let s in t) {
            n.data[e].update(s, t[s]);
        }
    }
};

IT.DataTable = class extends IT.Component {
    constructor(t) {
        super(t);
        let e = this;
        e.settings = $.extend(true, {
            id: "",
            cls: "it-datatable",
            width: "100%",
            height: "",
            cellEditing: true,
            enableFixedHeader: true,
            wrap: false,
            paging: true,
            store: {
                type: "json",
                params: {
                    start: 0,
                    limit: 20
                }
            },
            columns: [ {} ],
            customHeader: ""
        }, t);
        e.id = e.settings.id || IT.Utils.id();
        e.params = {};
        e.selectedRow = null;
        e.selectedColumn = null;
        e.editors = [];
        e.paging = {
            page: 1,
            page_count: 0,
            total_rows: 0
        };
        e.addEvents(e.settings, [ "onItemClick", "onItemDblClick", "onLoad", "onChangePage" ]);
        e.createComponent();
        if (!e.settings.store.isClass) {
            class t extends IT.Store {
                load(t) {
                    let n = true;
                    let s = this;
                    s.doEvent("beforeLoad");
                    e.editors.forEach(t => {
                        if (t && t.isClass) n = n && !!t.readyState;
                    });
                    if (!n) setTimeout(() => {
                        s.load.call(s, t);
                    }, 1e3); else super.load(t);
                }
            }
            e.store = new t(e.settings.store);
            e.store.addEvents({
                beforeLoad: function() {
                    e.content.find(".it-datatable-wrapper").animate({
                        scrollTop: 0
                    }, "slow");
                    e.content.find(".it-datatable-loading-overlay").addClass("loading-show");
                },
                afterLoad: function(t, n, s, i) {
                    e.content.find(".it-datatable-loading-overlay").removeClass("loading-show");
                    e.assignData(n);
                    e.doEvent("onLoad", [ e, n ]);
                    e.selectedRow = null;
                    e.selectedColumn = null;
                },
                onEmpty: function(t, n, s, i) {
                    e.assignData(n);
                    e.doEvent("onLoad", [ e, n ]);
                    e.content.find(".it-datatable-loading-overlay").removeClass("loading-show");
                }
            });
            t = null;
            e.params = e.store.params;
        }
    }
    createComponent() {
        let t = this, e = t.settings;
        t.content = $("<div />", {
            id: t.id,
            class: e.cls
        }).width(e.width).height(e.height);
        let n = $(`<div class="it-datatable-wrapper"/>`);
        let s = $(`<div class="it-datatable-fixed-header"/>`);
        let i = $(`<table width='100%' />`);
        let a = $(`<thead />`);
        let o = $(`<tbody />`);
        t.content.append(n.append(i.append(a)));
        if (e.customHeader) a.append($(e.customHeader)); else {
            let n, s = $(`<tr/>`);
            for (let i = 0; i < e.columns.length; i++) {
                n = e.columns[i];
                s.append($(`<th />`, {
                    css: {
                        "min-width": n.width,
                        width: n.width
                    }
                }).append(n.header));
                if (n.editor && n.editor.store && (n.editor.store.type == "ajax" || n.editor.store.type == "json")) {
                    t.editors.push(IT.Utils.createObject($.extend(true, {}, n.editor, {
                        width: n.width
                    })));
                } else t.editors.push(n.editor);
            }
            a.append(s);
        }
        if (e.enableFixedHeader) {
            t.content.append(s.append(i.clone()));
        }
        i.append(o);
        if (e.paging) {
            t.content.append(`\n\t\t\t\t<div class="it-datatable-pagination" >\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li><button class="it-datatable-icon" data-page="first"><span class="fa fa-step-backward"></span></button></li>\n\t\t\t\t\t\t<li><button class="it-datatable-icon" data-page="back"><span class="fa fa-chevron-left"></span></button></li>\n\t\t\t\t\t\t<li> \n\t\t\t\t\t\t\t<input type="text" class="it-datatable-pagination-current" value="1"> /\n\t\t\t\t\t\t \t<span class="it-datatable-pagination-page">0</span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li><button class="it-datatable-icon" data-page="next"><span class="fa fa-chevron-right"></span></button></li>\n\t\t\t\t\t\t<li><button class="it-datatable-icon" data-page="last"><span class="fa fa-step-forward"></span></button></li>\n\t\t\t\t\t\t<li >\n\t\t\t\t\t\t\tMenampilkan\n\t\t\t\t\t\t\t<span class='it-datatable-pagination-show'>0</span> \n\t\t\t\t\t\t\tdari\n\t\t\t\t\t\t\t<span class='it-datatable-pagination-count'>0</span> \n\t\t\t\t\t\t\tData\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t\t\t<div class='it-datatable-pagination-info'></div>\n\t\t\t\t</div>\n\t\t\t`);
            t.content.find(".it-datatable-pagination .it-datatable-icon").click(function() {
                if (t.getDataChanged().length) {
                    let e = new IT.MessageBox({
                        type: "question",
                        title: "Konfirmasi",
                        width: 400,
                        message: "Perubahan data belum di simpan. Yakin akan berpindah halaman ?",
                        buttons: [ {
                            text: "Ya",
                            handler: function() {
                                t.setPage($(this).data("page"));
                            }
                        }, {
                            text: "Tidak",
                            handler: function() {
                                e.close();
                            }
                        } ]
                    });
                } else t.setPage($(this).data("page"));
            });
            t.content.find(".it-datatable-pagination .it-datatable-pagination-current").change(function() {
                t.setPage($(this).val());
            });
            let e = $(`\n\t\t\t\t<div class="it-datatable-loading-overlay">\n\t\t\t\t\t<div class="it-loading-rolling"></div>\n\t\t\t\t</div>\n\t\t\t`);
            t.content.append(e);
        }
    }
    assignData(t) {
        let e = this, n = t.getData();
        if (n.length) {
            e.content.find("table").animate({
                scrollTop: 0
            }, "slow");
        }
        e.content.find("tbody").empty();
        let s = e.params.start;
        let i = e.params.limit;
        let a = s + i < t.total_rows ? s + i : t.total_rows;
        let o = t.total_rows > 0 ? s + 1 + "/" + a : "0";
        let l = Math.ceil(t.total_rows / i);
        e.paging = Object.assign({}, e.paging, {
            start: s,
            limit: i,
            page_count: l,
            total_rows: t.total_rows
        });
        e.content.find(".it-datatable-pagination-show").html(o);
        e.content.find(".it-datatable-pagination-count").html(t.total_rows);
        e.content.find(".it-datatable-pagination-page").html(l);
        if (s == 0) {
            e.content.find(".it-datatable-pagination-current").val(1);
        }
        if (n.length) {
            for (let t = 0; t < n.length; t++) {
                e.addRow(n[t]);
            }
        }
    }
    renderTo(t) {
        super.renderTo(t);
        let e = this;
        e.content.find(".it-datatable-wrapper").scroll(function() {
            e.content.find(".it-datatable-fixed-header").scrollLeft($(this).scrollLeft());
        });
    }
    getDataChanged() {
        let t = this, e = [];
        for (let n in t.store.data) {
            if (t.store.data[n].isChanged()) e.push(t.store.data[n].getChanged());
        }
        return e;
    }
    setPage(t = 1) {
        let e = this;
        if (e.store.getData().length) {
            switch (t) {
              case "first":
                if (e.paging.page != 1) {
                    e.paging.page = 1;
                    e.loadPage(1);
                }
                break;

              case "last":
                if (e.paging.page != e.paging.page_count) {
                    e.paging.page = e.paging.page_count;
                    e.loadPage(e.paging.page_count);
                }
                break;

              case "next":
                if (e.paging.page < e.paging.page_count) {
                    e.paging.page++;
                    e.loadPage(e.paging.page);
                }
                break;

              case "back":
                if (e.paging.page > 1) {
                    e.paging.page--;
                    e.loadPage(e.paging.page);
                }
                break;

              default:
                if (t >= 1 && t <= e.paging.page_count) {
                    e.paging.page = t;
                    e.loadPage(t);
                } else {
                    alert("Invalid page");
                    e.content.find(".it-datatable-pagination-current").val(e.paging.page);
                    throw "Invalid page";
                }
                break;
            }
        }
    }
    loadPage(t) {
        let e = this;
        let n = (t - 1) * e.paging.limit;
        e.content.find(".it-datatable-pagination .it-datatable-pagination-current").val(t);
        e.store.load({
            params: {
                start: n,
                limit: e.paging.limit
            }
        });
    }
    getSelectedRecords() {
        let t = this;
        return !t.selectedRow ? null : t.store.data[t.selectedRow];
    }
    addRow(t = {}) {
        let e = this;
        let n = $("<tr>");
        for (let s = 0; s < e.settings.columns.length; s++) {
            let i = e.editors[s], a = e.settings.columns[s], o = a.dataIndex, l = t.get(o);
            if (i) {
                i = i.isClass ? i : IT.Utils.createObject($.extend(true, {}, a.editor, {
                    width: a.width
                }));
            }
            let d = a.data || a.renderer || (i && i.store ? i.store.getRawData() : null) || [], r = IT.Utils.findData(l, d), c = $("<td />", {
                html: $("<div />", {
                    html: r == "" ? l : r
                }),
                valign: a.valign || "top",
                align: a.align || "left",
                class: "" + (e.settings.wrap ? "wrap" : "")
            });
            if (i && i.className == "checkbox") {
                c.find("div").empty();
                i.addEvents({
                    onChange: function() {
                        t.update(o, i.checked);
                        c[t.isChanged(o) ? "addClass" : "removeClass"]("it-datatable-changed");
                    }
                });
                i.checked = !!l;
                i.renderTo(c.find("div"));
            }
            c.on("click", function() {
                e.selectedRow = c.parent().index();
                e.selectedColumn = c.index();
                e.content.find("tbody tr").removeClass("it-datatable-selected");
                c.parent().addClass("it-datatable-selected");
                if (i && i.className !== "checkbox" && a.editor.editable && !c.hasClass("it-datatable-editing") && !t.isLocked(o)) {
                    c.find("div").empty();
                    c.addClass("it-datatable-editing");
                    i.val(t.getChanged(o) || t.get(o));
                    i.input.on("blur", function() {
                        if (i.validate()) {
                            t.update(o, i.val());
                            i.input.off();
                            i.content.detach();
                            c.removeClass("it-datatable-editing");
                            c.find("div").html(IT.Utils.findData(t.getChanged(o) || t.get(o), d));
                            c[t.isChanged(o) ? "addClass" : "removeClass"]("it-datatable-changed");
                        }
                    });
                    i.renderTo(c.find("div"));
                    i.input.focus();
                }
            });
            n.append(c);
        }
        e.content.find("tbody").append(n);
    }
    removeRow(t = -1) {
        let e = this;
        t = t < 0 ? e.selectedRow : t;
        e.content.find("tbody>tr").eq(t).remove();
        e.selectedRow = null;
        e.selectedColumn = null;
    }
};

IT.Dialog = class extends IT.Component {
    constructor(t) {
        super(t);
        let e = this;
        e.elExist = false;
        e.settings = $.extend(true, {
            id: "",
            title: "",
            iconCls: "",
            items: [],
            overlay: true,
            autoShow: true,
            width: 300,
            height: 100,
            autoHeight: true,
            cancelable: false,
            css: {}
        }, t);
        e.id = e.settings.id || IT.Utils.id();
        if (e.settings.autoShow) e.show(); else e.createElement();
    }
    createElement() {
        let t = this;
        if (t.elExist) return;
        t.content = $(`\n\t\t\t<div class="it-dialog">\n\t\t\t\t<div class="it-dialog-container">\n\t\t\t\t\t<div class="it-dialog-content"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t`);
        if (t.settings.title) {
            let e = $("<div/>", {
                class: "it-title",
                html: t.settings.title
            });
            if (t.settings.iconCls) {
                let n = $("<span/>", {
                    class: "fa fa-" + t.settings.iconCls
                });
                n.prependTo(e);
            }
            t.content.find(".it-dialog-container").prepend(e);
        }
        if (!t.settings.overlay) {
            t.content.addClass("no-overlay");
        }
        $.each(t.settings.items, function(e, n) {
            if (n) {
                if (!n.isClass) n = IT.Utils.createObject(n);
                if (n) n.renderTo(t.content.find(".it-dialog-content")); else console.warn("Xtype: undefined", obj);
            }
        });
        t.content.find(".it-dialog-container").css({
            "max-width": t.settings.width
        });
        t.content.find(".it-dialog-content").css($.extend(true, t.settings.css, t.settings.autoHeight ? {
            "min-height": t.settings.height
        } : {
            height: t.settings.height
        }));
        t.content.appendTo("body").hide();
        t.elExist = true;
        if (t.settings.autoShow) {
            t.show();
        } else t.createElement();
        if (t.settings.cancelable) {
            t.content.find(".it-dialog-container").click(function(t) {
                t.stopPropagation();
            });
            t.content.click(function() {
                t.close();
            });
        }
    }
    show() {
        let t = this;
        t.createElement();
        t.content.show(0, function() {
            $(this).addClass("dialog-show");
            $(this).find(".it-dialog-container").addClass("dialog-show");
        });
        $(window).resize(function() {
            t._autoScrollContainer();
        });
        setTimeout(function() {
            t._autoScrollContainer();
        }, 50);
    }
    hide() {
        let t = this;
        t.content.find(".it-dialog-container").removeClass("dialog-show").one(transitionEnd, function() {
            t.content.removeClass("dialog-show");
        });
    }
    close() {
        let t = this;
        t.content.find(".it-dialog-container").removeClass("dialog-show").one(transitionEnd, function() {
            t.content.removeClass("dialog-show").one(transitionEnd, function() {
                setTimeout(() => {
                    t.elExist = false;
                    t.content.remove();
                }, 300);
            });
        });
    }
    _autoScrollContainer() {
        let t = this.content.find(".it-dialog-container");
        let e = $(window).height();
        let n = e - (t.offset().top + t.outerHeight());
        if (n <= 20) {
            t.css({
                "overflow-y": "scroll",
                height: e - 30
            });
        } else {
            t.css({
                "overflow-y": "initial",
                height: "auto"
            });
        }
    }
};

IT.Flex = class extends IT.Component {
    constructor(t) {
        super();
        let e = this;
        e.settings = $.extend(true, {
            id: "",
            title: "",
            iconTitle: "",
            direction: "row",
            wrap: "",
            justifyContent: "",
            css: {},
            alignItems: "",
            alignContent: "",
            items: []
        }, t);
        e.id = e.settings.id || IT.Utils.id();
        e.content = $("<div />", {
            id: e.id,
            class: "it-flex"
        });
        e.content.css(e.settings.css || {});
        e.content.addClass("it-flex-dir dir-" + e.settings.direction);
        e.content.addClass("it-flex-wrap wrap-" + e.settings.wrap);
        e.content.addClass("it-flex-jc jc-" + e.settings.justifyContent);
        e.content.addClass("it-flex-ai ai-" + e.settings.alignItems);
        e.content.addClass("it-flex-ac ac-" + e.settings.alignContent);
        if (e.settings.title) {
            let t = $("<div/>", {
                class: "it-title",
                html: e.settings.title
            });
            t.prepend($("<span/>", {
                class: "fa" + (e.settings.iconTitle ? " fa-" + e.settings.iconTitle : "")
            }));
            e.content.append(t);
        }
        $.each(e.settings.items, function(t, n) {
            if (n) {
                if (typeof n.renderTo !== "function") n = IT.Utils.createObject(n);
                if (typeof n.settings.flex !== "undefined") n.content.addClass("it-flex-item");
                n.renderTo(e.content);
            }
        });
    }
};

IT.Form = class extends IT.Component {
    constructor(t) {
        super(t);
        let e = this;
        e.settings = $.extend(true, {
            id: "",
            url: "",
            items: []
        }, t);
        e.id = e.settings.id || IT.Utils.id();
        let n = $("<div />", {
            id: e.id,
            class: "container-fluid"
        });
        let s = 0, i;
        $.each(e.settings.items, function(t, e) {
            if (e) {
                if (!e.isClass) e = IT.Utils.createObject(e);
                if (!e.noRow) {
                    i = $("<div/>", {
                        class: "row form-row"
                    });
                    e.renderTo(i);
                    n.append(i);
                } else {
                    e.renderTo(n);
                }
                s++;
            }
        });
        e.content = $("<form />", {
            name: IT.Utils.id(),
            class: "it-form",
            action: e.settings.url,
            target: e.settings.target
        });
        e.content.append(n);
    }
};

IT.Grid = class extends IT.Component {
    constructor(t) {
        super(t);
        let e = this;
        e.settings = $.extend(true, {
            id: "",
            columnRule: "",
            rowContainer: "",
            css: {},
            items: []
        }, t);
        e.id = e.settings.id || IT.Utils.id();
        if (e.settings.columnRule) {
            e.content = $("<div />", {
                id: e.id,
                class: e.settings.columnRule
            });
        } else {
            e.content = $("<div/>", {
                id: e.id,
                class: "row"
            });
        }
        e.content.css(e.settings.css);
        $.each(e.settings.items, function(t, n) {
            if (n) {
                if (typeof n.renderTo !== "function") n = IT.Utils.createObject(n);
                n.renderTo(e.content);
            }
        });
        if (e.settings.columnRule == "" && e.settings.rowContainer == "fluid") {
            e.content = $("<div/>", {
                class: "container-fluid"
            }).append(e.content);
        } else if (e.settings.columnRule == "" && e.settings.rowContainer == "standar") {
            e.content = $("<div/>", {
                class: "container"
            }).append(e.content);
        }
    }
};

IT.HTML = class extends IT.Component {
    constructor(t) {
        super(t);
        let e = this;
        e.settings = $.extend(true, {
            id: "",
            url: "",
            content: "",
            css: {},
            class: ""
        }, t);
        e.id = e.settings.id || IT.Utils.id();
        e.content = $("<div/>", {
            id: e.id
        });
        if (e.settings.class) e.content.addClass(e.settings.class);
        e.content.css(e.settings.css);
        if (e.settings.url) e.content.load(e.settings.url); else e.content.html(e.settings.content);
    }
    setContent(t, e = false) {
        if (e) this.content.empty();
        if (typeof t == "string") this.content.append(t); else t.appendTo(this.content);
    }
};

IT.ImageBox = class extends IT.Component {
    constructor(t) {
        super(t);
        let e = this;
        e.settings = $.extend(true, {
            id: "",
            src: "",
            size: {
                width: 300,
                height: 100
            },
            cropper: false,
            cropperSettings: {
                smallImage: "allow"
            }
        }, t);
        e.id = e.settings.id || IT.Utils.id();
        e.imagebox = `\n\t\t\t<div class="it-imagebox">\n\t\t\t\t<a href="javascript:void(0);" class="it-imagebox-chooser it-btn btn-primary">\n\t\t\t\t\t<span class="fa fa-picture-o"></span> &nbsp; Pilih Sumber Gambar\n\t\t\t\t</a>\n\t\t\t\t<input type="file" class="cropit-image-input">\n\t\t\t\t<div class="cropit-preview"></div>\n\t\t\t\t<div class="hide-this">\n\t\t\t\t\t<div class="image-size-label">Zoom</div>\n\t\t\t\t\t<input type="range" class="cropit-image-zoom-input" value="0">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t`;
        e.reloadObject();
    }
    reloadObject() {
        var t = this;
        t.content = $(t.imagebox);
        t.content.find(".cropit-preview").width(t.settings.size.width).height(t.settings.size.height);
        if (t.isCropper()) {
            t.content.find(".hide-this").removeClass("it-hide");
            t.content.find(".it-imagebox-chooser").click(function() {
                t.content.find(".cropit-image-input").click();
            });
            t.content.cropit($.extend(true, t.settings.cropperSettings));
            if (t.settings.src != "") t.content.cropit("imageSrc", t.settings.src);
        } else {
            t.content.find(".it-imagebox-chooser").hide();
            t.content.find(".hide-this").addClass("it-hide");
            t.content.find(".cropit-preview").append($("<img/>", {
                class: "it-imagebox-picture",
                src: t.settings.src
            }));
        }
    }
    renderTo(t) {
        super.renderTo(t);
        this._render = t;
    }
    isCropper() {
        return this.settings.cropper;
    }
    setIsCropper(t) {
        let e = this;
        let n = e.settings.cropper;
        e.settings.cropper = t;
        if (n != e.settings.cropper) {
            e.content.remove();
            e.reloadObject();
            e.renderTo(e._render);
        }
    }
    setImageSrc(t) {
        let e = this;
        if (e.isCropper()) {
            e.content.cropit("imageSrc", t);
        } else {
            e.content.find("img").attr("src", t);
        }
    }
    getExport() {
        let t = "This is not cropper.";
        if (this.isCropper()) {
            t = this.content.cropit("export");
        }
        return t;
    }
};

IT.MessageBox = class extends IT.Component {
    constructor(t) {
        super(t);
        let e = this;
        e.settings = $.extend(true, {
            id: "",
            type: "info",
            title: "Title Here !",
            message: "Message Here !",
            width: 450,
            css: {},
            buttons: [],
            btnAlign: "right",
            autoShow: true
        }, t);
        e.id = e.settings.id || IT.Utils.id();
        var n = `\n\t\t\t<div id="${e.id}" class="it-messagebox">\n\t\t\t\t<div class="it-messagebox-container">\n\t\t\t\t\t<div class="it-messagebox-title message-${e.settings.type}">${e.settings.title}</div>\n\t\t\t\t\t<div class="it-messagebox-content">\n\t\t\t\t\t\t<div class="it-messagebox-icon">\n\t\t\t\t\t\t\t<div class="message-icon message-icon-${e.settings.type}"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="it-messagebox-text">\n\t\t\t\t\t\t\t${e.settings.message}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="it-messagebox-btn ${e.settings.btnAlign}"></div>\n\t\t\t\t</div>\n\t\t\t</div>`;
        e.content = $(n);
        e.content.find(".it-messagebox-container").css($.extend(e.settings.css, {
            "max-width": e.settings.width
        }));
        if (e.settings.buttons.length == 0) {
            let t = new IT.Button({
                text: "OK",
                handler: function() {
                    e.hide();
                }
            });
            t.renderTo(e.content.find(".it-messagebox-btn"));
        } else {
            $.each(e.settings.buttons, function(t, n) {
                n = $.extend({
                    xtype: "button"
                }, n);
                if (typeof n.renderTo !== "function") n = IT.Utils.createObject(n);
                n.renderTo(e.content.find(".it-messagebox-btn"));
            });
        }
        e.content.appendTo("body").hide();
        if (e.settings.autoShow) e.show();
    }
    show() {
        let t = this;
        $("input, select, textarea").blur();
        t.content.show(0, function() {
            $(this).addClass("message-show");
            $(this).find(".it-messagebox-container").addClass("message-show");
        });
    }
    hide() {
        let t = this;
        t.content.find(".it-messagebox-container").removeClass("message-show").one(transitionEnd, function() {
            t.content.removeClass("message-show").one(transitionEnd, function() {
                setTimeout(() => {
                    t.content.remove();
                }, 300);
            });
        });
    }
    close() {
        this.hide();
    }
};

IT.Select = class extends IT.FormItem {
    constructor(t) {
        super(t);
        let e = this, n;
        e.settings = $.extend(true, {
            id: "",
            value: "",
            emptyText: "",
            format: null,
            defaultValue: "",
            autoLoad: true,
            allowBlank: true,
            disabled: false,
            withRowContainer: false,
            width: 200,
            store: {
                url: "",
                type: "array",
                data: null
            },
            size: {
                field: "col-md-8",
                label: "col-md-4"
            }
        }, t);
        e.id = e.settings.id || IT.Utils.id();
        e.input = $("<select />", {
            id: e.id,
            name: e.id,
            class: "it-edit-input",
            attr: {
                disabled: e.settings.disabled
            },
            val: e.settings.defaultValue
        });
        e.content = $((e.settings.label ? `<div class="${e.settings.size.label}">` + `<label for="${e.id}-item" class='it-input-label it-input-label-${e.settings.labelAlign || "left"}'>${e.settings.label}</label>` + `</div>` : "") + `<div class="${e.settings.size.field}"></div>`);
        e.content.last().append(e.input);
        if (e.settings.width) {
            e.content.css({
                width: e.settings.width
            });
        }
        if (e.settings.withRowContainer) {
            e.content = $("<div/>", {
                class: "row"
            }).append(e.content);
        }
        e.addEvents(e.settings, [ "onLoad", "onChange" ]);
        e.input.on("change", function() {
            e.doEvent("onChange", [ e, e.val() ]);
        });
        if (e.settings.emptyText && !e.settings.autoLoad) {
            e.input.append($("<option/>", {
                val: "",
                text: e.settings.emptyText
            }));
        }
        e.store = new IT.Store($.extend(true, {}, e.settings.store, {
            autoLoad: false
        }));
        e.store.addEvents({
            beforeLoad: function() {
                e.readyState = false;
            },
            afterLoad: function(t, n, s) {
                s.forEach(t => {
                    e.input.append($("<option/>", {
                        val: t.rawData.key,
                        text: t.rawData.value,
                        attr: {
                            "data-params": typeof t.rawData.params !== "undefined" ? JSON.stringify(t.rawData.params) : ""
                        }
                    }));
                });
                e.readyState = true;
            }
        });
        if (e.settings.autoLoad) {
            e.getDataStore();
        } else e.readyState = true;
    }
    getDisplayValue() {
        let t = this;
        return t.getSelect().getItem(t.val())[0].innerHTML;
    }
    setDataStore(t) {
        this.settings.store = t;
        this.dataStore();
    }
    getDataStore() {
        let t = this;
        let e = t.settings.store;
        t.input.empty();
        if (t.settings.emptyText) {
            t.input.append($("<option/>", {
                val: "",
                text: t.settings.emptyText
            }));
        }
        t.store.load();
    }
    val(t) {
        if (typeof t === "undefined") return this.input.val(); else return this.input.val(t);
    }
};

IT.Selectize = class extends IT.FormItem {
    constructor(t) {
        super(t);
        let e = this, n;
        e.settings = $.extend(true, {
            id: "",
            value: "",
            emptyText: "",
            format: null,
            defaultValue: "",
            autoLoad: true,
            allowBlank: true,
            disabled: false,
            width: 200,
            store: {
                url: "",
                type: "array",
                data: null
            },
            selectize: {
                allowEmptyOption: true
            }
        }, t);
        e.id = e.settings.id || IT.Utils.id();
        e.input = $("<select />", {
            id: e.id,
            name: e.id,
            attr: {
                disabled: e.settings.disabled
            },
            val: e.settings.defaultValue
        });
        e.content = $("<div />", {
            class: "it-edit"
        });
        e.content.append(e.input);
        e.input.selectize(e.settings.selectize);
        if (e.settings.width) {
            e.content.css({
                width: e.settings.width
            });
        }
        if (e.settings.style) {
            e.content.css(e.settings.style);
        }
        e.addEvents(e.settings, [ "onLoad", "onChange" ]);
        e.getSelect().on("change", function() {
            e.doEvent("onChange", [ e, e.val() ]);
        });
        if (e.settings.emptyText && !e.settings.autoLoad) {
            e.getSelect().addOption({
                value: "",
                text: e.settings.emptyText
            });
            e.getSelect().setValue("");
        }
        e.store = new IT.Store($.extend(true, {}, e.settings.store, {
            autoLoad: false
        }));
        e.store.addEvents({
            beforeLoad: function() {
                e.readyState = false;
            },
            afterLoad: function(t, n, s) {
                s.forEach(t => e.getSelect().addOption({
                    value: t.rawData.key,
                    text: t.rawData.value,
                    params: typeof t.rawData.params !== "undefined" ? JSON.stringify(t.rawData.params) : ""
                }));
                e.readyState = true;
            }
        });
        if (e.settings.autoLoad) {
            e.getDataStore();
        } else e.readyState = true;
    }
    getDisplayValue() {
        let t = this;
        return t.getSelect().getItem(t.val())[0].innerHTML;
    }
    setDataStore(t) {
        this.settings.store = t;
        this.dataStore();
    }
    getDataStore() {
        let t = this;
        let e = t.settings.store;
        let n = t.getSelect();
        n.clearOptions();
        if (t.settings.emptyText) {
            n.addOption({
                value: "",
                text: t.settings.emptyText
            });
            n.setValue("");
        }
        t.store.load();
    }
    getSelect() {
        return this.input[0].selectize;
    }
    val(t) {
        if (typeof t === "undefined") return this.getSelect().getValue(); else return this.getSelect().setValue(t);
    }
};

IT.Tabs = class extends IT.Component {
    constructor(t) {
        super(t);
        let e = this;
        e.settings = $.extend(true, {
            id: "",
            titles: {
                align: "left",
                items: []
            },
            items: [],
            defaultIndexActive: 0,
            height: 100,
            autoHeight: false
        }, t);
        e.id = e.settings.id || IT.Utils.id();
        e.ids = [];
        e.content = $(`\n\t\t\t<div id="${e.id}" class="it-tabs">\n\t\t\t\t<ul class="it-tabs-menu ${e.settings.titles.align}"></ul>\n\t\t\t\t<div class="it-tabs-overflow">\n\t\t\t\t\t<span class="btn-overflow"><i class="fa fa-angle-down"></i></span>\n\t\t\t\t\t<ul class="menu-overflow"></ul>\n\t\t\t\t</div>\n\t\t\t\t<div class="it-tabs-container"></div>\n\t\t\t</div>`);
        e.content.css(e.settings.autoHeight ? "min-height" : "height", e.settings.height);
        $.each(e.settings.titles.items, function(t, n) {
            let s = IT.Utils.id();
            let i = $("<li/>", {
                class: "it-tabs-link",
                html: n,
                attr: {
                    "data-tab": s,
                    "data-index": t
                }
            });
            i.appendTo(e.content.find(".it-tabs-menu"));
            i.click(function() {
                e.setActive($(this).data("index"));
            });
            e.ids.push(s);
        });
        $.each(e.settings.items, function(t, n) {
            if (n) {
                let s = $("<div/>", {
                    class: "it-tabs-content",
                    id: e.ids[t]
                });
                if (!n.isClass) n = IT.Utils.createObject(n);
                n.renderTo(s);
                s.appendTo(e.content.find(".it-tabs-container"));
            }
        });
        e.content.find(".btn-overflow").click(function() {
            $(this).next().toggle();
        });
    }
    renderTo(t) {
        super.renderTo(t);
        let e = this;
        $(window).resize(function() {
            e._autoShowMore();
        });
        e._autoShowMore();
        e.setActive(e.settings.defaultIndexActive);
        setTimeout(() => {
            e._autoShowMore();
        }, 10);
    }
    setActive(t) {
        let e, n = this, s = n.content.find(".it-tabs-menu li").eq(t);
        if (s.length < 1) throw "offset index";
        n.content.find(".tab-active").removeClass("tab-active");
        e = s.addClass("tab-active");
        n.content.find("#" + e.data("tab")).addClass("tab-active");
    }
    getActive() {
        let t = this.getContent().find(".it-tabs-menu li.tab-active");
        return {
            index: t.index(),
            content: t
        };
    }
    _autoShowMore() {
        let t = this;
        let e = t.content.find(".menu-overflow");
        e.empty();
        let n = t.content.find(".it-tabs-menu li");
        n.show();
        n.each(function() {
            if ($(this).position().left + $(this).outerWidth() > t.content.width()) {
                $(this).clone(true).appendTo(e);
                $(this).hide();
            }
        });
        t.content.find(".it-tabs-overflow").toggle(e.children("li").length > 0);
    }
};

IT.TextBox = class extends IT.FormItem {
    constructor(t) {
        super(t);
        let e = this, n;
        e.settings = $.extend(true, {
            x: "textbox",
            type: "text",
            cols: 19,
            rows: 5,
            maskSettings: {},
            id: "",
            label: "",
            name: "",
            withRowContainer: false,
            allowBlank: true,
            value: "",
            placeholder: "",
            readonly: false,
            enabled: true,
            length: {
                min: 0,
                max: -1
            },
            size: {
                field: "col-sm-8",
                label: "col-sm-4"
            },
            info: {
                prepend: "",
                append: ""
            }
        }, t);
        n = e.settings;
        e.id = n.id || IT.Utils.id();
        if (n.label == "") n.size.field = "col";
        switch (n.type) {
          case "textarea":
            e.input = $(`<textarea style='resize: none;' id="${e.id}-item" ` + `class='it-edit-input' ` + `${n.allowBlank == false ? `required` : ""} ` + `cols='${n.cols}' ` + `rows='${n.rows}' ` + `${n.readonly ? ` readonly ` : ""} ` + `${n.enabled == false ? ` disabled ` : ""} ` + `name='${e.settings.name || IT.Utils.id()}' ` + `${n.length.min > 0 ? `minlength='${n.length.min}'` : ""} ` + `${n.length.max > 0 ? `maxlength='${n.length.max}'` : ""} ` + `>${n.value ? `${n.value}` : ""}</textarea>`);
            break;

          case "text":
          case "mask":
            e.input = $(`<input id="${e.id}-item" ` + `type='text' ` + `class='it-edit-input' ` + `name='${e.settings.name || IT.Utils.id()}' ` + `${n.length.min > 0 ? `minlength='${n.length.min}'` : ""} ` + `${n.length.max > 0 ? `maxlength='${n.length.max}'` : ""} ` + `${n.allowBlank == false ? `required` : ""} ` + `${n.readonly ? ` readonly ` : ""} ` + `${n.enabled == false ? ` disabled ` : ""} ` + `${n.placeholder ? `placeholder='${n.placeholder}'` : ""} ` + `${n.value ? `value='${n.value}'` : ""} ` + `>`);
            if (n.type == "mask") e.input.inputmask(n.maskSettings || {});
            break;

          default:
            throw "input type unknown";
            break;
        }
        e.input.on("focus change blur", function(t) {
            e.setInvalid(!e.validate());
        });
        e.input.on("keypress", function(t) {
            if (t.which == 13) $(this).blur();
        });
        let s = $("<div class='it-edit' />").append(e.input);
        n.info.prepend && s.prepend($("<div />", {
            class: "it-edit-item",
            html: n.info.prepend
        }));
        n.info.append && s.append($("<div />", {
            class: "it-edit-item",
            html: n.info.append
        }));
        e.content = $((n.label ? `<div class="${n.size.label}">\n\t\t\t<label for="${e.id}-item" class='it-input-label it-input-label-${n.labelAlign || "left"}'> ${n.label} </label>\n\t\t</div>` : "") + `<div class="${n.size.field}"></div>`);
        e.content.last().append(s);
        if (n.withRowContainer) {
            e.content = $("<div/>", {
                class: "row"
            }).append(e.content);
        }
        e.readyState = true;
    }
};

IT.Toolbar = class extends IT.Component {
    constructor(t) {
        super();
        let e = this, n;
        e.settings = $.extend(true, {
            id: "",
            position: "top",
            items: []
        }, t);
        e.id = e.settings.id || IT.Utils.id();
        e.content = $(`\n\t\t\t<div id="${e.id}" class="it-toolbar toolbar-${e.settings.position} clearfix">\n\t\t\t\t<ul class="it-toolbar-left"></ul>\n\t\t\t\t<ul class="it-toolbar-right"></ul>\n\t\t\t</div>\n\t\t`);
        e.ids = [];
        e.items = {};
        $.each(e.settings.items, function(t, n) {
            if (n) {
                let t = $("<li/>");
                if (!n.isClass) n = IT.Utils.createObject(n);
                n.renderTo(t);
                e.content.find(`.it-toolbar-${n.getSetting().align || "left"}`).append(t);
                e.ids.push(n.getId());
                e.items[n.getId()] = n;
            }
        });
    }
    getItemCount() {
        return this.ids.length;
    }
    getItem(t) {
        if (t) return this.items[t] || null;
        return this.items;
    }
};

IT.Utils = class extends IT.BaseClass {
    static createObject(t) {
        let e = t.xtype || t.x;
        let n = {
            button: "Button",
            toolbar: "Toolbar",
            html: "HTML",
            flex: "Flex",
            panel: "Panel",
            form: "Form",
            textbox: "TextBox",
            text: "TextBox",
            checkbox: "CheckBox",
            select: "Select",
            imagebox: "ImageBox",
            grid: "Grid",
            datatable: "DataTable",
            tabs: "Tabs"
        };
        if (!IT[n[e]]) throw "Class IT." + n[e] + " not found";
        return n[e] && IT[n[e]] ? new IT[n[e]](t) : null;
    }
    static template(t, ...e) {
        return function(...n) {
            var s = n[n.length - 1] || {};
            var i = [ t[0] ];
            e.forEach(function(e, a) {
                var o = Number.isInteger(e) ? n[e] : s[e];
                i.push(o, t[a + 1]);
            });
            return i.join("");
        };
    }
    static id() {
        var t = "IT-";
        var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var n = 0; n < 5; n++) t += e.charAt(Math.floor(Math.random() * e.length));
        return t;
    }
    static isMoney(t) {
        var e = t.replace(/[$,]/g, "").replace(/\./g, "").replace(/,/g, ".").replace(/\%/g, "");
        return !isNaN(e);
    }
    static isDate(t) {
        var e = new Date(t);
        return !isNaN(e);
    }
    static emptyFn() {}
    static findData(t, e, n = null) {
        let s = t, i = e.getData ? e.getData() : e;
        n = $.extend(true, {
            field: "key",
            look: "value"
        }, n || {});
        if (i.length) {
            for (let e = 0; e < i.length; e++) {
                let a = i[e];
                if (a[n.field] == t) {
                    s = a[n.look];
                    break;
                }
            }
        }
        return s;
    }
};