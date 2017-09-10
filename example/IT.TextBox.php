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
		style="width: 500px;height: 200px;margin: 20px auto auto;padding: 20px;background: grey"
	></div>
	<div 
		id="secondRender" 
		style="width: 500px;height: 200px;margin: 20px auto auto;padding: 20px;background: blue"
	></div>


	<script type="text/javascript" defer>
		$(function(){
			
			//IDR Currency
			var a = IT.Utils.createObject({
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
					autoGroup: !0
				}
			});
			a.renderTo($("#mainRender"));
			a.val(1000000);
			a.addEvents({
				selector:a.input,
				blur:function(){
					console.info(a.val())
				}
			})
			


			setTimeout(function(){
				$('#mainRender').empty();
				setTimeout(function(){
					a.renderTo($('#secondRender'));
				},3000);
			},3000);
		});
	</script>
</body>
</html>