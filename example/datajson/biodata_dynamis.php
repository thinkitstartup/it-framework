<?php

	$filename = "BIODATA.DBF";

	$start = isset($_REQUEST["start"])?$_REQUEST["start"]:0;
	$limit = isset($_REQUEST["limit"])?$_REQUEST["limit"]:20;

	$listagama = array(
		"A"=>"Islam",
		"B"=>"Kristen",
		"C"=>"Protestan",
		"D"=>"Hindu",
		"E"=>"Budha"
	);

	$result = new stdClass();
	$result->success = false;
	if(file_exists($filename)){
		if($dbfBio=dbase_open($filename, 0)){
			for($a=1;$a<=dbase_numrecords($dbfBio);$a++){
				$rowBio=cleanObj(dbase_get_record_with_names($dbfBio,$a));
				unset($rowBio['deleted']);

				$rowBio["kd_agama"] = array_keys($listagama)[rand(0,4)];
				//$rowBio["sex"] = array("L","P",null)[rand(0,2)];
				//$rowBio["sex"] = null;

				$DtaFilter[]=$rowBio;
				$arIdUn[]=$rowBio["kd_prop"].$rowBio["kd_rayon"].$rowBio["kd_sek"]."_".$rowBio["paralel"]."_".$rowBio["absen"];
			}
			dbase_close($dbfBio);
		}
		array_multisort($arIdUn, SORT_ASC, $DtaFilter);

		for ($i=0;$i<count($DtaFilter);$i++){
			if($i>=$start && $i < ($start+$limit)){
				if (isset($arrNmUsul[($i+1)])){
					$DtaFilter[$i]["nm_pes_usul"]=$arrNmUsul[($i+1)];
				}
				$result->rows[]=$DtaFilter[$i];
			}
		}
		$result->total_rows=count($DtaFilter);
		$result->success = true;
	}
	//sleep(6);
	header("Content-type: application/json");
	echo json_encode($result);

	function cleanObj($row){
		$r = array();
		foreach($row as $key=>$val)
			$r[strtolower($key)]=trim($val);
		return $r;
	}
?>