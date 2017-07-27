// * Name Spacing
var IT = (IT) ? IT: {} ;
function createObject(...opt) {
	let xtype = opt[0].xtype||opt[0].x;
	let map = {
		// no need add IT namespace
		button 	: "Button",
		toolbar	: "Toolbar",
		html	: "HTML",
		flex	: "Flex",
		panel	: "Panel",

		
		form	: "Form",
		textbox	: "TextBox",
		checkbox: "CheckBox",
		select  : "Select",


		grid	: "Grid",
		tabs    : "Tabs"
	}
	return map[xtype] ? new IT[map[xtype]](...opt) : null;
}


// Watch the order of include, Class declarations are not hoisted
// http://2ality.com/2015/02/es6-classes-final.html#class-declarations-are-not-hoisted


//Base
//@koala-append "components/common.js"
//@koala-append "components/baseclass.js"
//@koala-append "components/utils.js"
//

//component
//@koala-append "components/listener.js"

//@koala-append "components/component.js"

//form
//@koala-append "components/formitem.js"
//@koala-append "components/textbox.js"
//@koala-append "components/checkbox.js"
//@koala-append "components/select.js"


//@koala-append "components/datatable.js"
//@koala-append "components/event.js"
//@koala-append "components/store.js"
//@koala-append "components/menu.js"
//@koala-append "components/toolbar.js"
//@koala-append "components/button.js"
//@koala-append "components/dialog.js"
//@koala-append "components/tabs.js"
//@koala-append "components/messagebox.js"
//@koala-append "components/column.js"
//@koala-append "components/html.js"
//@koala-append "components/imagebox.js"
//@koala-append "components/panel.js"
//@koala-append "components/flex.js"
//@koala-append "components/grid.js"
//@koala-append "components/form.js"
//@koala-append "extra.js"