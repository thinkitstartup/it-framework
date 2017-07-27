IT.FormItem = class extends IT.Component {
	constructor(opt){
		super(opt);
	}
	//getter setter for value
	val(v) {
		if (typeof v === "undefined")
			return this.input.val(); 
		else return this.input.val(v);
	}

	// if state is true, mark the input with border red
	setInvalid(state=true){
		this.input[state?"addClass":"removeClass"]("invalid");
	}

	// return true if valid
	validate(){
		return !(!this.opt.allowBlank && this.val()==""); 
	}
}