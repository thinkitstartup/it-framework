<!DOCTYPE html>
<html lang="en">
<head>
	<title>IT Framework Play</title>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

	<!-- Dependecies -->
	<link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css" />
	<script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
	<script type="text/javascript" src="bower_components/inputmask/dist/min/jquery.inputmask.bundle.min.js"></script>
	<script type="text/javascript" src="bower_components/selectize/dist/js/standalone/selectize.min.js"></script>

	<!-- ThinkIT -->
	<link rel="stylesheet" href="../dist/it-framework.min.css" />
	<script type="text/javascript" src="../dist/it-framework.min.js?dc=<?php echo time();?>"></script>
    <script type="text/javascript" src="http://localhost:8080/livereload.js"></script>
</head>

<body>

<script type="text/javascript">
	$(function(){
		var dialog = new IT.Dialog({
			title: 'Ini Dialog Box',
			width: 500,
			css: {padding: 10},
			items:[{
				xtype:"form",
				items:[{
					x:"textbox",
					type:"mask",
					label:"masukan nama",
					placeholder:"masukan nama",
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
					},

				},
					/*
				{
					x:"grid",
					type:"row",
					rowContainer:"fluid",
					items:[{
						x:"grid",
						type:"column",
						columnRule:'col-sm-4',
						items:[{					
							x:"html",
							content:"Hobby",		
						}]
					},
					
					 {
						x:"grid",
						type:"column",
						columnRule:'col-sm-8',
						items:[{
							x:"checkbox",
							label:"Renang",
						},{
							x:"checkbox",
							label:"Lari",
						}]
					}
					]
				}
				*/
				]
			}]	
		});
	});
</script>	
</body>
</html>