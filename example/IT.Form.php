<!DOCTYPE html>
<html lang="en">
<head>
	<title>IT Framework - Form</title>
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

	<script type="text/javascript" defer>
		$(function(){
			let dialog = new IT.Dialog({
				title: 'Testing Form',
				width: 800,
				items:[{
					xtype: 'form',
					items:[ // *** Start :: Form

						// Line 1
						{
							xtype: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							css: { width: '100%', },
							items: [{
								xtype: 'imagebox',
								size: { width: 150, height: 150 },
								cropper: true
							}]
						},

						// Line 2
						{
							xtype: 'grid',
							columnRule: 'col-md-12',
							items:[{
								xtype: 'grid',
								items:[{
									xtype: 'grid',
									columnRule: 'col',
									items:[{
										xtype: 'text',
										label: 'NIP Lama',
										withRowContainer: true,
										size: { label: "col", field: "col-md-8" }
									}]
								}, {
									xtype: 'grid',
									columnRule: 'col',
									items:[{
										xtype: 'text',
										label: 'NIP Baru',
										withRowContainer: true,
										size: { label: "col", field: "col-md-8" }
									}]
								}]
							}]
						},

						// Line 3
						{ 
							x: "text", 
							label: "Nama Pegawai", 
							size: { label:"col", field:"col-md-10" }
						},

						// Line 4
						{
							xtype: 'grid',
							columnRule: 'col-md-12',
							items:[{
								xtype: 'grid',
								items:[{
									xtype: 'grid',
									columnRule: 'col',
									items:[{
										xtype: 'text',
										label: 'Gelar Depan',
										withRowContainer: true,
										size: { label: "col", field: "col-md-8" }
									}]
								}, {
									xtype: 'grid',
									columnRule: 'col',
									items:[{
										xtype: 'text',
										label: 'Gelar Belakang',
										withRowContainer: true,
										size: { label: "col", field: "col-md-8" }
									}]
								}]
							}]
						},

						// Line 5
						{
							xtype: 'grid',
							columnRule: 'col-md-12',
							items:[{
								xtype: 'grid',
								items:[{
									xtype: 'grid',
									columnRule: 'col',
									items:[{
										xtype: 'text',
										label: 'Tempat Lahir',
										withRowContainer: true,
										size: { label: "col", field: "col-md-8" }
									}]
								}, {
									xtype: 'grid',
									columnRule: 'col',
									items:[{
										xtype: 'text',
										label: 'Tanggal Lahir',
										withRowContainer: true,
										size: { label: "col", field: "col-md-8" }
									}]
								}]
							}]
						},

						// Line 6
						{
							xtype: 'grid',
							columnRule: 'col-md-12',
							items:[{
								xtype: 'grid',
								items:[{
									xtype: 'grid',
									columnRule: 'col',
									items:[{
										x:"select",
										width: 0,
										label: "Jenis Kelamin",
										withRowContainer: true,
										store:{
											type:"array",
											data:[
												{ key:"L", value:"Laki-laki" },
												{ key:"P", value:"Perempuan" },
											]
										}
									}]
								}, {
									xtype: 'grid',
									columnRule: 'col',
									items:[	{
										x:"select",
										width: 0,
										label: "Taspen",
										withRowContainer: true,
										store:{
											type:"array",
											data:[
												{ key:1, value:"Sudah" },
												{ key:2, value:"Belum" },
											]
										}
									}]
								}]
							}]
						},		

						// Line 7
						{
							xtype: 'grid',
							columnRule: 'col-md-12',
							items:[{
								xtype: 'grid',
								items:[{
									xtype: 'grid',
									columnRule: 'col',
									items:[{
										xtype: 'text',
										label: 'No Karpeg',
										withRowContainer: true,
										size: { label: "col", field: "col-md-8" }
									}]
								}, {
									xtype: 'grid',
									columnRule: 'col',
									items:[]
								}]
							}]
						},

						// Line 8
						{
							xtype: 'grid',
							columnRule: 'col-md-12',
							items:[{
								xtype: 'grid',
								items:[{
									xtype: 'grid',
									columnRule: 'col',
									items:[{
										xtype: 'text',
										label: 'NPWP',
										withRowContainer: true,
										size: { label: "col", field: "col-md-8" }
									}]
								}, {
									xtype: 'grid',
									columnRule: 'col',
									items:[]
								}]
							}]
						},

						// Line 9
						{
							xtype: 'grid',
							columnRule: 'col-md-12',
							items:[{
								xtype: 'grid',
								items:[{
									xtype: 'grid',
									columnRule: 'col',
									items:[{
										xtype: 'text',
										label: 'Telp',
										withRowContainer: true,
										size: { label: "col", field: "col-md-8" }
									}]
								}, {
									xtype: 'grid',
									columnRule: 'col',
									items:[{
										xtype: 'text',
										label: 'Handphone',
										withRowContainer: true,
										size: { label: "col", field: "col-md-8" }
									}]
								}]
							}]
						},

						// Line 10
						{
							xtype: 'grid',
							columnRule: 'col-md-12',
							items:[{
								xtype: 'grid',
								items:[{
									xtype: 'grid',
									columnRule: 'col',
									items:[{
										xtype: 'text',
										label: 'Kode Pos',
										withRowContainer: true,
										size: { label: "col", field: "col-md-8" }
									}]
								}, {
									xtype: 'grid',
									columnRule: 'col',
									items:[{
										xtype: 'text',
										label: 'Alamat',
										withRowContainer: true,
										size: { label: "col", field: "col-md-8" }
									}]
								}]
							}]
						},

					] // *** End :: Form
				},{
					x:"toolbar",
					position:'bottom',
					items:[{
						x:'button',
						id:'btn-save',
						text:'Simpan',
						align:'right'
					},{
						x:'button',
						id:'btn-close',
						text:'Tutup',
						align:'right',
						handler:function(){
							dialog.hide();
						}
					}]
				}],
				onShow: function() {
					
				}
			});
			dialog.onShow(function(){
				alert("a");
			});
		});
	</script>
</body>
</html>