<?php

	$filename = "BIO17_0101002D.DBF";

	$start = isset($_REQUEST["start"])?$_REQUEST["start"]:0;
	$limit = isset($_REQUEST["limit"])?$_REQUEST["limit"]:20;


	$result = new stdClass();
	$result->success = false;
	if(file_exists($filename)){
		if($dbfBio=dbase_open($filename, 0)){
			for($a=1;$a<=dbase_numrecords($dbfBio);$a++){
				$rowBio=dbase_get_record_with_names($dbfBio,$a);
				unset($rowBio['deleted']);
				$DtaFilter[]=$rowBio;
				$arIdUn[]=$rowBio["KD_PROP"].$rowBio["KD_RAYON"].$rowBio["KD_SEK"]."_".$rowBio["PARALEL"]."_".$rowBio["ABSEN"];
			}
			dbase_close($dbfBio);
		}
		array_multisort($arIdUn, SORT_ASC, $DtaFilter);

		for ($i=0;$i<count($DtaFilter);$i++){
			if($i>=$start && $i < ($start+$limit)){
				if (isset($arrNmUsul[($i+1)])){
					$DtaFilter[$i]["NM_PES_USUL"]=$arrNmUsul[($i+1)];
				}
				$result->rows[]=$DtaFilter[$i];
			}
		}
		$result->total_rows=count($DtaFilter);
		$result->success = true;
	}
	header("Content-type: application/json");
	echo json_encode($result);
?>