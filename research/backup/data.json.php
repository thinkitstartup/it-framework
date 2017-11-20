<?php

	$result=new stdClass();
	$client=mysqli_connect("127.0.0.1", "root", "", "pendassd17");
	$sql="SELECT CONCAT(nama_lengkap,' ',member_id) nama, IF(RAND()>0.5,'L','P') sex FROM members  where type='2' limit ".$_REQUEST["start"].",".$_REQUEST["limit"];
	$result->rows=array();
	$qry=mysqli_query($client,$sql);
	while($qry && $row=mysqli_fetch_assoc($qry)){
		$result->rows[]=$row;
	}
	$sql="select member_id jml from members where type='2' ";
	$qry=mysqli_query($client,$sql);
	$result->total_rows=mysqli_num_rows($qry);
	$result->success=true;
	header("Content-type: application/json");
	echo json_encode($result);
	mysqli_close($client);
?>