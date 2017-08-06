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

    <style type="text/css">
    	body{
			line-height: 100%;
			font-family: Aller;
			font-size: 13px;
			font-weight: normal;
			-webkit-font-smoothing: antialiased;
    	}
    </style>
</head>
<body>
	<center>See console !!</center>
	<script type="text/javascript" defer>
		$(function(){

			var store = new IT.Store({
				type: 'json',
				url: "data.json",
				//autoLoad:true,
				params:{
					start:0,
					limit:20
				},
				afterLoad:function(a){
					let idx= 0;
					console.info("rawData",a.getData()[idx].rawData);
					a.replace({
						nama:"okhas"
					},idx);
					console.info("isChanged",a.getData()[idx].isChanged());
					console.info("getChanged",a.getData()[idx].getChanged());
					console.info("total_rows",a.total_rows);
					console.info("rawData",a.getData()[idx].rawData);

					a.setData([
						{nama:"arief",sex:"L"},
					]);
					console.info("isChanged",a.getData()[idx].isChanged());
					console.info("getChanged",a.getData()[idx].getChanged());
					console.info("total_rows",a.total_rows);
					console.info("rawData",a.getData()[idx].rawData);
					

					console.info("type : array");
					console.info("===============================================>");
					store2.load();
				}
			});
			var store2 = new IT.Store({
				type: 'array',
				data:[
					{nama:"arief",sex:"L"},
					{nama:"ronald",sex:"L"},
					{nama:"wati",sex:"P"},
				],
				afterLoad:function(a){
					let idx= 0;
					console.info("rawData",a.getData()[idx].rawData);
					a.replace({
						nama:"okhas"
					},idx);
					console.info("isChanged",a.getData()[idx].isChanged());
					console.info("getChanged",a.getData()[idx].getChanged());
					console.info("total_rows",a.total_rows);
					console.info("rawData",a.getData()[idx].rawData);

					a.setData([
						{nama:"arief",sex:"L"},
					]);
					console.info("isChanged",a.getData()[idx].isChanged());
					console.info("getChanged",a.getData()[idx].getChanged());
					console.info("total_rows",a.total_rows);
					console.info("rawData",a.getData()[idx].rawData);
				}
			});
			console.info("type : json");
			store.load();

		});
	</script>
</body>
</html>