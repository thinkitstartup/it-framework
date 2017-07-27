/**
 * Default Component CLass
 * @type {object}
 */
IT.Component = class extends IT.BaseClass {
	constructor(opt) {
		super(opt);
		let me = this;
		me._id = "";
		me.settings = {};
		me.content = null;
	}
	/**
	 * Render this Element to parentEl
	 * @param  {selector} parentEl selector for parent
	 */
	renderTo(parentEl) {
		if(this.content.appendTo)
			this.content.appendTo(domEl);
	}


	/**
	 * ID of component
	 * @name IT.Component#id
	 * @member {string}
	 */
	get id() {
		return this._id;
	}
	set id(id) {
		this._id = id;
	}

	/**
	 * get ID
	 * @return {string} Component ID
	 */
	getId() { return this.id; }

	/**
	 * get Content  selector 
	 * @return {selector} content
	 */
	getContent() { return this.content; }

	/**
	 * get generated settings
	 * @return {object}
	 */
	getSetting(){ return this.settings; }
}