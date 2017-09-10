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
}