<!DOCTYPE html>
<html lang="en">
<head>
	<title>IT Framework</title>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

	<!-- Dependecies -->
	<link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css" />
	<script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
	<script type="text/javascript" src="bower_components/inputmask/dist/min/jquery.inputmask.bundle.min.js"></script>
	<script type="text/javascript" src="bower_components/selectize/dist/js/standalone/selectize.min.js"></script>

	<!-- ThinkIT -->
	<link rel="stylesheet" href="../dist/it-framework.min.css?dc=<?php echo time();?>" />
	<script type="text/javascript" src="../src/js/it-framework-all.js?dc=<?php echo time();?>"></script>
    <script type="text/javascript" src="http://localhost:8080/livereload.js"></script>
</head>
<body>

	<div 
		id="mainRender"
		style="border: solid 1px black; width:100%; max-width: 800px; min-height: 200px; margin: 20px auto auto; padding: 20px"
	></div>
	<div>
		<center>
			<button id='render'>Render to HTML</button>
			<button id='dialog'>As item of dialog</button>
		</center>
	</div>
	<script type="text/javascript" defer>
		$(function(){
			/*
			var config = {
				x:"form",
				items: [{
					x: "checkbox",
					label: "This is checkbox"
				},{
					x: "checkbox",
					label: "This is checkbox 2"
				},{
					x:"grid",
					items:[{
						x:"grid",
						type:"column",
						columnRule: "col-sm-6",
						items:[{
							x: "checkbox",
							label: "This is checkbox"
						}]
					},{
						x:"grid",
						type:"column",
						columnRule: "col-sm-6",
						items:[{
							x: "checkbox",
							label: "This is checkbox"
						}]
					}]
				}]
			};
			*/
			//render to html
			$("#render").click(()=>{
				var checkbox = new IT.CheckBox({
					label:"Membaca",
					value:"baca",
					name:"hobby[]",
					onChange:function(e,a,b){
						console.info("holla amigos : ", a, b);
					}
				});
				var checkbox2 = new IT.CheckBox({
					label:"Renang",
					value:"renang",
					name:"hobby[]"
				});

				var form = new IT.Form({
					x:"form",
					url: "http://localhost/simpeg/resources/it-framework/example/datajson/request.php",
					target:"_blank",
					items: [checkbox,checkbox2,{
						x:"button",
						text:"Check Value",
						handler:function(){
							console.info(checkbox.val());
							console.info(checkbox.checked);
							setTimeout(function(){
								checkbox.checked = !checkbox.checked
							},3000);
						}
					}]
				});
				form.renderTo($("#mainRender"));


				var form2 = new IT.Form({
					x:"form",
					items:[{
						x:"text",
						label:"hallo"
					}]
				});
				form2.renderTo($("#mainRender"));
			});
			$('#render').click();

			//as item of dialog
			$("#dialog").click(()=>{
				var dialog = new IT.Dialog({
					title: 'TEST',
					width: 500,
					cancelable: true,
					css: {padding: 10},
					items:[config]
				});
			});
		});
	</script>
</body>
</html>