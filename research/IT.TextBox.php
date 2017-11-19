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
		style="border: solid 1px black;width: 500px;height: 200px;margin: 20px auto auto;padding: 20px"
	></div>
	<div>
		<center>
			<button id='render'>Render to HTML</button>
			<button id='dialog'>As item of dialog</button>
		</center>
	</div>
	<script type="text/javascript" defer>
		$(function(){
			var config = {
				x:"textbox",
				type:"mask",
				label:"Please Input",
				placeholder:"Please Input",
				allowBlank:false,
				info:{
					prepend:"Rp. ",
					append:"-,."
				},
				maskSettings:{
					groupSeparator: ".",
					radixPoint: "",
					alias: "numeric",
					placeholder: "0",
					autoGroup: !0,
					digits: 2
				}
			};


			//render to html
			$("#render").click(()=>{
				var obj = IT.Utils.createObject(config);
				obj.renderTo($("#mainRender"));
			});

			//as item of dialog
			$("#dialog").click(()=>{
				var dialog = new IT.Dialog({
					title: 'TEST',
					width: 500,
					css: {padding: 10},
					items:[config]
				});
			});
		});
	</script>
</body>
</html>