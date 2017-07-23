var IT= IT || {};;/**
 * BaseClass for every Class Instance
 * @type {class}
 */
IT.BaseClass = class {

	/** just a constructor */
	constructor(){
	}
};IT.Component = class extends IT.BaseClass{
	constructor(){
		let iniadalahvariableyangsangatpanjang = "How are you doing may mate !!!";
		console.info(iniadalahvariableyangsangatpanjang);
	}
}