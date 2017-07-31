/**
 * DataTable element
 * @extends IT.DataTable
 * @type IT.DataTable
 * @class IT.DataTable
 * @param {Object} opt setting for class
 * @see IT.Component#settings
 */
IT.DataTable = class extends IT.Component {
	/** @param  {object} opt  */
	constructor(opt){
		super(opt);
		let me = this;	
		
		/** 
		 * Setting for class
		 * @member {Object}
		 * @name IT.DataTable#settings
		 * @property {string} id ID of element
		 */
		me.settings = $.extend({
			id: '',
			cls: 'it-grid',
			width: '100%',
			height: 'auto',
			top: 0,
			bottom: 0,
			cellEditing: true,
			sort: "local",
			wrap: false,
			store: {
				type: 'json',
				params:{
					start: 0,
					limit: 20,
					orderBy: '',
					sortBy: ''
				}
			},
			columns: [{}]
		}, opt);

		var store = new IT.Store();
		/** 
		 * ID of class or element
		 * @member {boolean}
		 * @name IT.Dialog#id
		 */
		me.id = me.settings.id || IT.Utils.id();

		var lastRow = null;
	}
}