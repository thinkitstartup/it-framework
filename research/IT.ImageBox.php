<!DOCTYPE html>
<html lang="en">
<head>
	<title>IT Framework - ImageBox</title>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

	<!-- Dependecies -->
	<link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css" />
	<script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
	<script type="text/javascript" src="bower_components/inputmask/dist/min/jquery.inputmask.bundle.min.js"></script>
	<script type="text/javascript" src="bower_components/cropit/dist/jquery.cropit.js"></script>

	<!-- ThinkIT -->
	<link rel="stylesheet" href="../dist/it-framework.min.css?dc=<?php echo time();?>" />
	<script type="text/javascript" src="../src/js/it-framework-all.js?dc=<?php echo time();?>"></script>
    <script type="text/javascript" src="http://localhost:8080/livereload.js"></script>
</head>
<body>

	<div 
		id="mainRender"
		style="border: solid 1px black; width:100%; max-width: 800px; min-height: 200px; margin: 20px auto auto; padding: 20px"></div>
	
	<button id="enableCropper"> Enable Cropper </button>
	<button id="disableCropper"> Disable Cropper </button>
	<button id="changePicture"> Change Picture </button>
	<button id="export"> Export </button>

	<script type="text/javascript" defer>
		$(function(){
			let imageBox = new IT.ImageBox({
				cropper: false,
				size: {
					width: 200,
					height: 200,
				}
			});
			imageBox.renderTo($('#mainRender'));

			$('#enableCropper').on('click', () => {
				imageBox.setIsCropper(true);
			});

			$('#disableCropper').on('click', () => {
				imageBox.setIsCropper(false);
			});

			$('#changePicture').on('click', () => {
				imageBox.setImageSrc('picture.jpg');
			});

			$('#export').on('click', () => {
				console.info(imageBox.getExport());
			});

		});
	</script>
</body>
</html>