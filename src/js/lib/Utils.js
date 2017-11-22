/**
 * Class Utils, all the members should static
 * @type {function}
 * @extends IT.BaseClass
 * @depend IT.BaseClass
 */
IT.Utils = class extends IT.BaseClass{
	/**
	 * createObject
	 * @param  {object} opt option for the class
	 * @return {class} function class
	 */
	static createObject(opt) {
		let xtype = opt.xtype||opt.x;
		let map = {
			button 		: "Button",
			toolbar		: "Toolbar",
			html		: "HTML",
			flex		: "Flex",
			panel		: "Panel",
			
			form		: "Form",
			textbox		: "TextBox",
			text		: "TextBox",
			checkbox	: "CheckBox",
			select  	: "Select",
			imagebox	: "ImageBox",

			grid		: "Grid",
			datatable	: "DataTable",
			tabs    	: "Tabs"
		}
		if(!IT[map[xtype]]) throw "Class IT."+map[xtype]+" not found";
		return map[xtype] && IT[map[xtype]]? new IT[map[xtype]](opt) : null;
	}
	/**
	 * create template literal
	 * @param  {string}    strings base template
	 * @param  {...object} keys    [object to be parsed]
	 * @return {template}            template
	 */
	static template(strings, ...keys) {
		return (function(...values) {
			var dict = values[values.length - 1] || {};
			var result = [strings[0]];
			keys.forEach(function(key, i) {
				var value = Number.isInteger(key) ? values[key] : dict[key];
				result.push(value, strings[i + 1]);
			});
			return result.join('');
		});
	}
	/**
	 * create random id with prefix "IT-"
	 * @return {string} string random id 
	 */
	static id(){
		var text="IT-";
		var possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for(var i=0; i<5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}
	/**
	 * check if value's in money format
	 * @param  {string}  value text to be checked
	 * @return {boolean}       return true if string is money
	 */
	static isMoney(value){
		var m = value.replace( /[$,]/g, "" ).replace(/\./g, "").replace(/,/g, ".").replace(/\%/g, "");
		return ! isNaN(m);
	}
	/**
	 * check if value's in date format
	 * @param  {string}  value text to be checked
	 * @return {boolean}       return true if string is date
	 */	
	static isDate(value){
		var d = new Date(value);
		return ! isNaN(d);
	}
	/**
	 * Empty Function
	 */
	static emptyFn(){
		//console.info("Empty function");
	}


	static findData(value,fromStore,opt=null){
		let v = value,
			dta = fromStore.getData ? fromStore.getData() : fromStore;
		opt = $.extend(true,{
			field:"key",
			look:"value"
		},opt||{}) ;
		if(dta.length){
			for (let i =0;i<dta.length;i++) {
				let el = dta[i];
				if(el[opt.field]==value){
					v = el[opt.look];
					break;
				}
			}
		}
		return v;
	}
}