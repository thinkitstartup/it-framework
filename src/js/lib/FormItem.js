/**
 * base class for form item
 * @extends IT.Component
 * @type IT.FormItem
 * @param {Object} opt setting for class
 */
IT.FormItem = class extends IT.Component {
	/** @param  {object} opt  */
	constructor(opt){
		super(opt);
	}
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
	val(value) {
		if (typeof value === "undefined")
			return this.input.val(); 
		else return this.input.val(value);
	}

	/** 
	 * if state is true, mark the input with border red
	 * @param {Boolean} state pass true to make this item invalid
	 */
	setInvalid(state=true){
		this.input[state?"addClass":"removeClass"]("invalid");
	}

	/** return true if valid */
	validate(){
		return !(!this.settings.allowBlank && this.val()==""); 
	}

	/** 
	 * whether set this item readonly or not
	 * @param {Boolean} state pass true to make this item readonly
	 */
	setReadonly(state=false){
		this.input.attr('readonly', state)
			[state?"addClass":"removeClass"]('input-readonly');
	}
	/** 
	 * whether set this item enabled or not
	 * @param {Boolean} state pass true to make this item invalid
	 */
	setEnabled(state=false){
		this.input.attr('disabled', !state)
			[!state?"addClass":"removeClass"]('input-disabled');
	}
}