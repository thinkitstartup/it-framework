<?php

	$result = new stdClass();
	$result->success = true;

	//$i =rand(65,(65+26-5));
	$i=65;
	$Data = array(
		"".chr($i++)=>"Islam",
		"".chr($i++)=>"Kristen",
		"".chr($i++)=>"Protestan",
		"".chr($i++)=>"Hindu",
		"".chr($i++)=>"Budha",
	);
	//sleep(2);
	$result->rows = array();
	foreach ($Data as $key=>$value) {
		$result->rows[] = array(
			"key"=>$key,
			"value"=>$key . ". " .$value
		);
	}
	$result->total_rows = count($result->rows);
	header("Content-type: application/json");
	echo json_encode($result);
?>