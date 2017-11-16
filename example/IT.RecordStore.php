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
	<script type="text/javascript" defer>
		$(function(){
			var record = new IT.RecordStore({
				nama:"egy",
				sex:"L",
				alamat:"Rumah"
			});
			
			console.info(record.isChanged());
			record.update("nama","egy");
			console.info(record.isChanged());

			console.info(record.changed);
			console.info(record.getChanged());

			//console.info(record.isChanged);
			//console.info(record.rawData);
		});
	</script>
</body>
</html>