<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//ES" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Player HTML 5</title>
<link rel="icon" id="favicon" type="image/png" href="favicon.png">
<link href="css/print.css" rel="stylesheet" type="text/css" media="print" />
<link href="css/screen.css" rel="stylesheet" type="text/css" media="screen" />
<link href="css/styles.css" rel="stylesheet" type="text/css" />
<link href="css/ie.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="js/swfobject.js"></script>
<script type="text/javascript" src="js/flashPlayer.js"></script>
<script type="text/javascript" src="js/utilities.js"></script>
<script type="text/javascript" src="js/player.js"></script>
<script type="text/javascript">
	var elements = {
		player_track_list_arrows: "player_track_list_arrows",
		player_init: "player_init",
		player_play: "player_play",
		player_end: "player_end",
		player_cover: "player_cover",
		player_time: "player_time",
		player_track_name: "player_track_name",
		player_back_track: "player_back_track",
		player_loader_track: "player_loader_track",
		player_front_track: "player_front_track",
		player_dial_track: "player_dial_track",
		player_track_time: "player_track_time",
		player_track_replay: "player_track_replay",
		player_speaker: "player_speaker",
		player_volume_bar: "player_volume_bar",
		player_back_volume: "player_back_volume",
		player_front_volume: "player_front_volume",
		player_dial_volume: "player_dial_volume",
		player_container: "player_container",
		player_arrow_left: "player_arrow_left",
		player_arrow_right: "player_arrow_right",
		player_track_list: "player_track_list",
		player_track_back: "player_track_back",
		
		flash_swf: "player.swf",
		flash_id: "mymovie",
		flash_width: "1100",
		flash_height: "60",
		flash_player: "10",
		flash_bg: "#000000",
		flash_content: "flashContent"
	}
	
	var type = true;
	
	<?php
		if(isset($_GET['type'])){
			if($_GET['type'] == "true"){
				?>
				type = true;
				<?php
			}else if($_GET['type'] == "false"){
				?>
				type = false;
				<?php
			}
		}else{
			?>
			type = true;
			<?php
		}
	?>
	var player = new playerAudioVideo(elements,"player","tracks.xml",type);
	
	function flashIsLoaded(){
		player.setElements();
	}
	function soundCompleted(){
		//player.finishTrack(e);
	}
	function soundLoading(){
		player.progressTrack();
	}
	
</script>
</head>
<body>
<div id="flashContent"></div>
<!--<audio controls="controls">
  <source src="tracks/ahora_estas_tu.ogg" type="audio/ogg" />
  <source src="tracks/ahora_estas_tu.mp3" type="audio/mpeg" />
	Tu navegador no soporta este reproductor de audio
</audio>-->
<div id="player">
<a href="#" id="player_track_list_arrows">K</a>
<div id="content_player">
	<div id="left_buttons">
    	<a href="#" id="player_init">B</a>
        <a href="#" id="player_play">D</a>
        <a href="#" id="player_end">A</a>
    </div>
    <div id="cover"><img src="images/cover.jpg" alt="Track actual" id="player_cover" /></div>
    <div id="content_bars">
        <div id="player_time"></div>
        <div id="player_track_name"></div>
        <div id="player_back_track"></div>
        <div id="player_loader_track"></div>
        <div id="player_front_track"></div>
        <div id="player_dial_track"></div>
    </div>
    <div id="player_track_time"></div>
    <div id="player_track_replay">
    	<a href="#">F</a>
        <a href="#" class="replay">G</a>
    </div>
    <div id="content_volume">
    	<div id="player_speaker">H</div>
        <div id="player_volume_bar">
            <div id="player_back_volume"></div>
            <div id="player_front_volume"></div>
            <div id="player_dial_volume"></div>
        </div>
    </div>
</div>
<div id="player_container">
	<div id="player_arrow_left">C</div>
	<div id="player_arrow_right">D</div>
	<div id="player_track_list"></div>
</div>
<div id="player_track_back">&nbsp;</div>
</div>
</body>
</html>