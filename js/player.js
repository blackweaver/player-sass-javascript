/* Ajax */

function nuevoAjax(){ 
	var xmlhttp = false;
	try { 
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); 
		
	}catch(e){ 
		try	{ 
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
		} 
		catch(E) { 
			xmlhttp = false; 
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest != "undefined") {
		xmlhttp = new XMLHttpRequest(); 
	} 
	return xmlhttp; 
}


function playerAudio(e,box,url,position,html5,play_start,show_box){

	var root = this;
	
	this.ajax = null;
	this.ajax_method = "GET";

	this.xml_track = url;
		
	this.turn = true;

	this.status_replay = this.status_random = this.playing = this.statusLoading = this.trackbar_status = false;

	this.remain = play_start;
	this.statusprogress = true;
	this.current_track = this.old_current = 0;
	this.general_volume = this.current_volume = 0.5;
	this.statusplay = this.statusBoxClik = true;
	this.timer = this.timerNext = 0;
	this.tracks = this.tracks_backup = this.tracksExternal = new Array();
	this.mousePos = new Object();

	this.track = this.video = null;

	this.flash = false;
	this.fplayer = null;
	this.timerFlash = 0;

	this.satus_arrow = true;
	this.position = false;
	this.closed = show_box;
	this.many = this.empty = false;
	this.margin_box = 5;
	this.lengthName = 60;
	this.tracksTemporary = new Object();

	this.bodys;
	this.player;
	this.player_init;
	this.player_play;
	this.player_end;
	this.player_content_cover;
	this.player_cover_small;
	this.player_cover;
	this.player_preloader;
	this.player_time;
	this.player_track_name;
	this.player_cover_info;
	this.player_track_icons;
	this.player_cover_name;
	this.player_cover_artist;
	this.player_back_track;
	this.player_loader_track;
	this.player_dial_track;
	this.player_track_time;
	this.player_track_replay;
	this.player_speaker;
	this.player_volume_bar;
	this.player_back_volume;
	this.player_front_volume;
	this.player_dial_volume;
	this.btn_delete;
	this.counter_tracks;
	this.counter = null;
	this.btn_save;
	this.btn_new_playlist;
	this.container_video;

	this.player_track_list_arrows;
	this.player_container;
	this.player_track_list;
	this.player_track_back;
	
	this.container_scroll;
	this.scrollbar;
	this.status_scrollbar = true;
	this.track_w;
	this.playlist_w;
	this.scrollbar_w;
	this.track_h;
	this.playlist_h;
	this.scrollbar_h;

	this.current_track_drag = new Object();
	this.elementDrag = this.current_block = null;

	this.dragtracks = null;

	this.ready = function(){}

	function loadBody(){
		root.ready();
		try{
			if(!html5 || !document.createElement('audio').canPlayType('audio/mpeg')){
				document.getElementById("no_exist").innerHTML = "test";
			}
			document.createElement("canvas").getContext("2d");
			document.getElementById(box).style.display = "block";
			root.loadNewPlaylist();
		}catch(event){
			document.getElementById(box).style.display = "block";
			root.flash = true;
			root.placeFlash();
		}
		
		placeContainer();
		
	}

	try{
		window.attachEvent("onload",loadBody);
	}
	catch(e){
		try {
			window.addEventListener("DOMContentLoaded",loadBody, false);
		}
		catch(e){
			window.onload = loadBody;
		}
	}

	this.loadNewPlaylist = function(param,url,callback){
		
		param || ( param = {} );
		url || ( url = null );
		callback || ( callback = null );

		if(url) this.xml_track = url;

	   if(!this.turn){
		   this.resetPlayer();
	   }

		this.tracks = this.tracks_backup = new Array();
		
		if(this.ajax){
			this.ajax.abort();
		}
		
		this.ajax = nuevoAjax();
		this.ajax.onreadystatechange = function() {
			if(root.ajax.readyState == 4){
				if(root.ajax.responseText){
					var data = JSON.parse(root.ajax.responseText);
					parseData(data);
				}
			}
		}
		this.ajax.open(this.ajax_method, this.xml_track + "webservices.php?action=player_load_contents&type=" + param.type + "&id=" + param.id,false);
		this.ajax.send();
		
		function parseData(data){
			
			if(data.status == "OK"){
				if(data.tracks.length > 0){
					
					for(var i=0;i<data.tracks.length;i++){
						
						var audio = new Object();
						audio.lenght = data.tracks[i].track_length;
						audio.name = data.tracks[i].name;
						audio.type = data.tracks[i].type;
						audio.idtrack = data.tracks[i].idtrack;
						audio.album = data.tracks[i].album;
						audio.artist = data.tracks[i].artist;
						audio.cover = data.tracks[i].cover;
						audio.idalbum = data.tracks[i].idalbum;
						audio.id = i;
						
						root.tracks.push(audio);
						
					}
					
					root.tracks_backup = root.tracks.slice();
					root.setElements();
					if(param.autoplay){
						root.activePlayer(true);
					}
					
					root.ajax = null;
					if(root.turn){
					   root.resetPlayer();
				   	}
				}else{
					showHideAlert(".alert-danger",LAN_PLAYLIST_EMPTY);
				}

			}else{
				showHideAlert(".alert-danger",data.error);
			}
		}
		root.turn = false;
	}

	this.placeFlash = function(){
		document.getElementById(e.flash_content).style.borderTop = "solid 1px #ee3a43";
		this.fplayer = new flashPlayer();
		var so = new SWFObject(e.flash_swf, e.flash_id, e.flash_width, e.flash_height, e.flash_player, e.flash_bg);
       so.write(e.flash_content);
	}

	this.setElements = function(){

		var root = this;

		this.bodys = document.getElementsByTagName("body")[0];
		this.player = document.getElementById(e.player);
		this.player_track_list_arrows = document.getElementById(e.player_track_list_arrows);
		this.player_init = document.getElementById(e.player_init);
		this.player_play = document.getElementById(e.player_play);
		this.player_end = document.getElementById(e.player_end);
		this.player_content_cover = document.getElementById(e.player_content_cover);
		this.player_cover_small = document.getElementById(e.player_cover_small);
		this.player_cover = document.getElementById(e.player_cover);
		this.player_preloader = document.getElementById(e.player_preloader);
		this.player_time = document.getElementById(e.player_time);
		this.player_cover_info = document.getElementById(e.player_cover_info);
		this.player_track_name = document.getElementById(e.player_track_name);
		this.player_track_icons = document.getElementById(e.player_track_icons);
		this.player_cover_name = document.getElementById(e.player_cover_name);
		this.player_cover_artist = document.getElementById(e.player_cover_artist);
		this.player_back_track = document.getElementById(e.player_back_track);
		this.player_loader_track = document.getElementById(e.player_loader_track);
		this.player_front_track = document.getElementById(e.player_front_track);
		this.player_dial_track = document.getElementById(e.player_dial_track);
		this.player_track_time = document.getElementById(e.player_track_time);
		this.player_track_replay = document.getElementById(e.player_track_replay);
		this.player_speaker = document.getElementById(e.player_speaker);
		this.player_volume_bar = document.getElementById(e.player_volume_bar);
		this.player_back_volume = document.getElementById(e.player_back_volume);
		this.player_front_volume = document.getElementById(e.player_front_volume);
		this.player_dial_volume = document.getElementById(e.player_dial_volume);
		this.btn_delete = document.getElementById(e.btn_delete);
		this.counter_tracks = document.getElementById(e.counter_tracks);
		this.btn_save = document.getElementById(e.btn_save);
		this.btn_new_playlist = document.getElementById(e.btn_new_playlist);
		this.player_container = document.getElementById(e.player_container);
		this.player_track_list = document.getElementById(e.player_track_list);
		this.player_track_back = document.getElementById(e.player_track_back);

		this.container_scroll = document.getElementById(e.container_scroll);
		this.scrollbar = document.getElementById(e.scrollbar);

		this.player_play.className = '';
		this.playing = false;
		this.player_track_list.style.left = "0";
		this.current_track = this.old_current = 0;
		
		if(getOS() == "Android" || getOS() == "iOS") {
			root.track = document.getElementById("mp3");
			root.track.type= 'audio/mpeg';
			root.track.play();
		}
		
		if(position == "portrait") this.position = true;

		while(this.player_track_list.firstChild) {
			this.player_track_list.removeChild(this.player_track_list.firstChild);
		}

		for(var i=0;i<this.tracks.length;i++){
			this.addTrack(this.player_track_list,i);
		}

		this.setCorrectId();
		
		this.getNewTrack(this.current_track,root.remain);

		if(this.player_volume_bar){
			this.player_front_volume.style.width = this.getVolumeWidth(this.general_volume) + "px";
			this.player_dial_volume.style.left = getOffset(this.player_back_volume).x + getSize(this.player_front_volume).w - getSize(this.player_dial_volume).w / 2 + "px";
		}

		this.player_dial_track.style.left = getOffset(this.player_front_track).x + getSize(this.player_front_track).w + "px";

		this.player_track_replay.getElementsByTagName("a")[0].className = 'switch';
		this.player_track_replay.getElementsByTagName("a")[1].className = 'switch';

		this.player_play.onclick = function(){
			if(root.tracks.length > 0){
				root.player_play_f();
			}
			return false;
		}

		this.player_init.onclick = function(){
			if(root.tracks.length > 1){
				root.player_init_f();
			}
			//resetPlayTrack();
			return false;
		}

		this.player_end.onclick = function(){
			if(root.tracks.length > 1){
				root.player_end_f();
			}
			//resetPlayTrack();
			return false;
		}

		this.player_track_replay.getElementsByTagName("a")[0].onclick = function(){
			if(root.tracks.length > 2){
				if(root.status_random){
					root.getRandom(false);
				}else{
					if(root.tracks.length > 1){
						root.getRandom(true);
					}
				}
			}
			return false;
		}

		this.player_track_replay.getElementsByTagName("a")[1].onclick = function(){
			if(root.tracks.length > 0){
				if(root.status_replay){
					this.className = 'switch';
					root.status_replay = false;
				}else{
					this.className = '';
					root.player_end.className = '';
					root.status_replay = true;
				}
				root.setArrowsTrack(root.current_track - 1);
			}
			return false;
		}

		if(getOS() == "iOS"){
			this.player_speaker.style.visibility = "hidden";
		}else{
			this.player_speaker.onclick = function(){
				if(root.statusplay){
					if(root.tracks.length > 0){
						if(root.track.volume == 0){
							this.className = '';
							root.track.volume = root.current_volume = root.general_volume;
							if(root.player_volume_bar){
								root.player_front_volume.style.width = root.getVolumeWidth(root.current_volume) + "px";
								root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + root.getVolumeWidth(root.current_volume) - getSize(root.player_dial_volume).w + "px";
							}
						}else{
							this.className = 'switch';
							root.track.volume = root.current_volume = 0;
							if(root.player_volume_bar){
								root.player_front_volume.style.width = "0px";
								root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + "px";
							}
						}
						if(root.flash){ root.fplayer.setVolume(root.track.volume); }
					}
				}
				return false;
			}
		}

		if(this.player_volume_bar){
			this.player_back_volume.onmousedown = this.player_front_volume.onmousedown = function(e){
				e = e || window.event;
				root.settingVolumeBar(e);
				document.onmousemove = function(e){
					root.settingVolumeBar(e);
				}
				root.mouseUp();
				return false;
			}

			this.player_dial_volume.onmousedown = function(e){
				e = e || window.event;
				if(root.tracks.length > 0){
					root.player_speaker.className = '';
					document.onmousemove = function(e){
						e = e || window.event;
						root.mousePos = mouseCoords(e);
						if(root.mousePos.x - getSize(root.player_dial_volume).w / 2 >= getOffset(root.player_back_volume).x && root.mousePos.x <= getOffset(root.player_back_volume).x + getSize(root.player_back_volume).w - getSize(root.player_dial_volume).w / 2){
							root.player_dial_volume.style.left = root.mousePos.x - getSize(root.player_dial_volume).w / 2 + "px";
							root.player_front_volume.style.width = root.mousePos.x - getOffset(root.player_back_volume).x + "px";
							root.track.volume = root.getVolume(root.mousePos.x - getOffset(root.player_back_volume).x,getSize(root.player_back_volume).w);
							root.current_volume = root.track.volume;
							root.player_speaker.className = '';
							if(root.flash){
								root.track.volume = root.fplayer.setVolume(root.current_volume);
							}
						}else if(root.mousePos.x - getSize(root.player_dial_volume).w / 2 < getOffset(root.player_back_volume).x){
							root.player_speaker.className = 'switch';
							root.track.volume = 0;
							root.current_volume = root.track.volume;
							if(root.flash){
								root.fplayer.setVolume(root.track.volume);
							}
							root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + "px";
						}
					}
					root.mouseUp();
				}
				return false;
			}
		}

		this.player_loader_track.onmousedown = this.player_front_track.onmousedown = function(e){
			e = e || window.event;
			root.settingBars(e);
			document.onmousemove = function(e){
				root.settingBars(e);
			}
			root.mouseUp();
			return false;
		}

		this.player_dial_track.onmousedown = function(e){
			e = e || window.event;
			if(root.tracks.length > 0){
				root.track.pause();
				root.trackbar_status = true;
				document.onmousemove = function(e){
					e = e || window.event;
					root.mousePos = mouseCoords(e);
					if(root.playing){
						if(root.mousePos.x - getSize(root.player_dial_track).w / 2 >= getOffset(root.player_loader_track).x && root.mousePos.x <= getOffset(root.player_loader_track).x + getSize(root.player_loader_track).w - getSize(root.player_dial_track).w / 2){
							root.player_dial_track.style.left = root.mousePos.x - getSize(root.player_dial_track).w / 2 + "px";
							root.player_front_track.style.width = root.mousePos.x - getOffset(root.player_back_track).x + "px";
							root.track.currentTime = root.getDialUp(root.mousePos.x - getOffset(root.player_back_track).x,getSize(root.player_back_track).w);
							if(root.flash){
								root.track.currentTime = root.fplayer.setCurrentTime(root.track.currentTime);
								root.fplayer.setVolume(root.current_volume);
							}
						}else if(root.mousePos.x - getSize(root.player_dial_track).w / 2 < getOffset(root.player_back_track).x){
							root.track.currentTime = 0;
							root.player_dial_track.style.left = getOffset(root.player_back_track).x + "px";
							if(root.flash){
								root.fplayer.setCurrentTime(root.track.currentTime);
							}
						}
					}
				}
				root.mouseUp();
			}
			return false;
		}

		if(this.btn_delete){
			this.btn_delete.onclick = function(){
				if(root.tracks.length > 0){
					root.resetPlayer();
					resetPlayTrack();
					//AdobeEdge.getComposition('play_pause').getStage().play('ini');
				}
			}
		}

		if(this.btn_save){
			this.btn_save.status = false;
			this.btn_save.className = "switch";

			this.btn_save.onclick = function(){
				if(this.status){
					savePlaylist();
					this.className = "switch";
					this.status = false;
				}
			}
		}

		if(this.btn_new_playlist){
			this.btn_new_playlist.onclick = function(){
				addPlaylist();
			}
		}

		window.onresize = function(){

			var pos_dial = 0;

			if(!root.position){
				if(root.tracks.length > 0){
					root.track_w = getSize(root.player_track_list.getElementsByTagName("div")[0]).w;
					root.playlist_w = (root.track_w + root.margin_box) * root.tracks.length + root.margin_box;
					root.scrollbar_w = getSize(root.player_container).w * (getSize(root.player_container).w / root.playlist_w);

					if(getSize(root.player_container).w < root.playlist_w){
						root.player_container.style.bottom = root.player_track_back.style.bottom = getSize(root.player).h + getSize(root.container_scroll).h + "px";
						root.setEventScroll();
					}else{
						root.player_container.style.bottom = root.player_track_back.style.bottom = getSize(root.player).h + "px";
						root.container_scroll.onmousedown = null;
						root.container_scroll.style.display = "none";
						if(document.onmousemove) document.onmousemove = null;
					}

					if(getOffset(root.scrollbar).x > getOffset(root.container_scroll).x + getSize(root.container_scroll).w - getSize(root.scrollbar).w){
						root.scrollbar.style.left = getOffset(root.container_scroll).x + getSize(root.container_scroll).w - getSize(root.scrollbar).w + "px";
					}
					root.movePlaylist();

					if(root.track.duration > 0){
						pos_dial = (getSize(root.player_back_track).w * root.track.currentTime) / root.track.duration;
					}
				}
			}

			root.player_front_track.style.width = pos_dial + getSize(root.player_dial_track).w + "px";

			if(root.player_volume_bar){
				root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + getSize(root.player_front_volume).w - getSize(root.player_dial_volume).w / 2 + "px";
			}

			if(!root.position){
				root.player_dial_track.style.left = getOffset(root.player_front_track).x + getSize(root.player_front_track).w + "px";
				root.player_track_list.style.width = root.playlist_w;
			}

			root.player_loader_track.style.width = "0";

		}

		document.onkeydown = function(e){
			if(keypress(e) == 32){
				//root.player_play_f();
			}else if(keypress(e) == 37){
				//root.player_init_f();
			}else if(keypress(e) == 38){
				//root.turnVolume(5);
			}else if(keypress(e) == 39){
				//root.player_end_f();
			}else if(keypress(e) == 40){
				//root.turnVolume(-5);
			}
		}

		if(this.player_track_list_arrows){
			this.player_track_list_arrows.onclick = function(){
				root.closeOpenPlaylist();
				return false;
			}
		}

		this.dragtracks = new dragAndDropTracks();
		
		//this.openPlaylist();
		setEvents();

	}
	
	this.settingBars = function(e){
		if(root.tracks.length > 0){
			root.mousePos = mouseCoords(e);
			if(root.playing){
				if(root.mousePos.x - getSize(root.player_dial_track).w / 2 >= getOffset(root.player_back_track).x && root.mousePos.x <= getOffset(root.player_back_track).x + getSize(root.player_back_track).w - getSize(root.player_dial_track).w / 2){
					root.player_dial_track.style.left = root.mousePos.x - getSize(root.player_dial_track).w / 2 + "px";
					root.player_front_track.style.width = root.mousePos.x - getOffset(root.player_back_track).x + "px";
					root.track.currentTime = root.getDialUp(root.mousePos.x - getOffset(root.player_back_track).x,getSize(root.player_back_track).w);
					if(root.flash){
						if(root.track.duration > 0){
							root.track.currentTime = root.fplayer.setCurrentTime(root.track.currentTime);
						}
						root.fplayer.setVolume(root.current_volume);
					}
				}else if(root.mousePos.x - getSize(root.player_dial_track).w / 2 < getOffset(root.player_back_track).x){
					root.track.currentTime = 0;
					root.player_dial_track.style.left = getOffset(root.player_back_track).x + "px";
					if(root.flash){
						root.fplayer.setCurrentTime(root.track.currentTime);
					}
				}
			}
		}
	}
	
	this.settingVolumeBar = function(e){
		if(root.tracks.length > 0){
			root.mousePos = mouseCoords(e);
			if(root.mousePos.x - getSize(root.player_dial_volume).w / 2 >= getOffset(root.player_back_volume).x && root.mousePos.x <= getOffset(root.player_back_volume).x + getSize(root.player_back_volume).w - getSize(root.player_dial_volume).w / 2){
				root.player_dial_volume.style.left = root.mousePos.x - getSize(root.player_dial_volume).w / 2 + "px";
				root.player_front_volume.style.width = root.mousePos.x - getOffset(root.player_back_volume).x + "px";
				root.track.volume = root.getVolume(root.mousePos.x - getOffset(root.player_back_volume).x,getSize(root.player_back_volume).w);
				root.current_volume = root.track.volume;
				root.player_speaker.className = '';
				if(root.flash){
					root.track.volume = root.fplayer.setVolume(root.current_volume);
				}
			}else if(root.mousePos.x - getSize(root.player_dial_volume).w / 2 < getOffset(root.player_back_volume).x){
				root.player_speaker.className = 'switch';
				root.track.volume = 0;
				root.current_volume = root.track.volume;
				if(root.flash){
					root.fplayer.setVolume(root.track.volume);
				}
				root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + "px";
			}
		}
	}

	this.closePlaylist = function(){
		var bt = this.player_track_list_arrows;
		root.closed = true;
		bt.className = '';
		root.player_container.style.display = root.player_track_back.style.display = root.container_scroll.style.display = root.player_content_cover.style.display = "none";
	}

	this.openPlaylist = function(){
		var bt = this.player_track_list_arrows;
		root.closed = false;
		bt.className = 'switch';
		root.player_container.style.display = root.player_track_back.style.display = root.player_content_cover.style.display = "block";
		if(root.position){
			if(getSize(root.player_container).w < getSize(root.player_track_list).w){
				root.container_scroll.style.display = "block";
			}
			if(root.player_track_list.childNodes.length > 0){
				root.setWidthPlaylist(root.player_track_list.childNodes[0]);
			}
		}
	}

	this.closeOpenPlaylist = function(){
		if(root.closed){
			this.openPlaylist();
		}else{
			this.closePlaylist();
		}
	}


	/* Cleaning player */

	this.resetPlayer = function(){
		this.current_track = 0;
		if(root.timer) clearTimeout(root.timer);
		this.clearTrack();
		this.player_track_time.innerHTML = this.player_time.innerHTML = formatTime(0);
		this.player_track_name.innerHTML = "";
		this.player_cover_name.innerHTML = "";
		this.player_cover_artist.innerHTML = "";
		this.player_cover_info.setAttribute('rel','');
		this.player_cover_info.setAttribute('rev','');
		this.player_track_icons.style.display = "none";
		this.player_cover.style.height = "auto";
		this.player_cover.src = URL_TEMPLATES + "images/cover_empty.jpg";
		this.player_cover_small.src = URL_TEMPLATES + "images/cover_empty.jpg";
		
		this.player_play.className = 'switchmute';
		this.player_front_volume.className = 'switchmute';
		this.player_speaker.className = 'switchmute';
		this.player_time.className = 'switchmute';
		this.player_track_time.className = 'switchmute';
		this.btn_new_playlist.className = 'switchmute';
		showNewPlaylist(false);
		
		this.player_preloader.className = "";
		this.player_track_replay.getElementsByTagName("a")[0].className = 'switch';
		this.player_track_replay.getElementsByTagName("a")[1].className = 'switch';
		if(this.btn_delete) this.btn_delete.className = 'switch';
		if(this.btn_save){
			this.btn_save.className = 'switch';
			this.btn_save.status = false;
		}
		if(this.counter_tracks) this.counter_tracks.style.display = "none";

		if(this.video) this.video.style.display = "none";

		this.status_random = false;

		this.tracks = this.tracks_backup = this.tracksExternal = new Array();

		if(!this.tracks.length){
			while(this.player_track_list.firstChild) {
				this.player_track_list.removeChild(this.player_track_list.firstChild);
			}
			this.player_track_back.getElementsByTagName("p")[0].style.display = "block";
		}
		this.reSetPlaylist();
		this.setArrowsTrack(0);
		
		try{
			AdobeEdge.getComposition('play_pause').getStage().play('ini');
		}catch(e){}
		
	}


	this.activePlayer = function(play,trackNumber){
		trackNumber || ( trackNumber = 0 );
		this.current_track = trackNumber;
		(play)? this.getNewTrack(this.current_track,true) : this.getNewTrack(this.current_track,false);
		if(this.btn_delete) this.btn_delete.className = '';
		if(this.counter_tracks) this.counter_tracks.style.display = "block";
		this.player_play.className = '';
		//AdobeEdge.getComposition("play_pause").getStage().play("end");
		this.player_front_volume.className = '';
		this.player_speaker.className = '';
		this.player_time.className = '';
		this.player_track_time.className = '';
		this.btn_new_playlist.className = '';
		showNewPlaylist(true);
	}


	this.setArrowsTrack = function(current){
		
		current = current || 0;
		
		if(!current){
			root.player_init.className = 'switch';
		}else{
			root.player_init.className = '';
		}
		if(current < root.tracks.length - 1 || root.status_replay){
			root.player_end.className = '';
		}else{
			root.player_end.className = 'switch';
		}
		
		if(root.tracks.length < 2){
			root.player_end.className = 'switch';
		}
		
	}


	this.turnVolume = function(vol){
		if(this.player_volume_bar){
			var w = getSize(root.player_front_volume).w + vol;
			if(w >= 0) root.player_front_volume.style.width = w + "px";
			root.player_dial_volume.style.left = getOffset(root.player_back_volume).x - getSize(root.player_dial_volume).w / 2 + getSize(root.player_front_volume).w + "px";

			if(getOffset(root.player_dial_volume).x <= getOffset(root.player_back_volume).x){

				root.track.volume = 0;
				root.current_volume = root.track.volume;
				root.player_speaker.className = 'switch';

				if(root.flash){
					root.track.volume = root.fplayer.setVolume(0);
				}

				root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + "px";
				root.player_front_volume.style.width = "0";

			}else if(getOffset(root.player_dial_volume).x > getOffset(root.player_back_volume).x + getSize(root.player_back_volume).w - getSize(root.player_dial_volume).w){
				root.track.volume = 1;
				root.current_volume = root.track.volume;
				root.player_speaker.className = '';
				if(root.flash){
					root.track.volume = root.fplayer.setVolume(1);
				}

				root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + getSize(root.player_back_volume).w - getSize(root.player_dial_volume).w + "px";
				root.player_front_volume.style.width = getSize(root.player_back_volume).w + "px";
			}else{
				root.track.volume = root.getVolume(getSize(root.player_front_volume).w,getSize(root.player_back_volume).w);
				root.current_volume = root.track.volume;
				root.player_speaker.className = '';
				if(root.flash){
					root.track.volume = root.fplayer.setVolume(root.current_volume);
				}
			}
		}
	}


	this.clearTrack = function(){
		if(this.track){
			this.track.pause();
			this.playing = false;
			if(root.timer) clearTimeout(root.timer);
			if(this.flash){
				if(root.timerFlash) clearTimeout(root.timerFlash);
				this.fplayer.getTrack("",false);
				this.track = null;
			}else{
				if(this.player_preloader) this.player_preloader.className = "";
				if(getOS() == "unknown"){
					this.track.removeEventListener("progress", root.progressTrack);
					this.track.removeEventListener("ended", root.finishTrack);
					this.track.removeEventListener("loadeddata", root.loadedTrack);
					this.track.removeEventListener("canplaythrough", root.startTrack);
					this.track.src = "https://s3.amazonaws.com/kuack-catalogo/empty.mp3";
					//this.track = null;
				}else{
					this.track.src = "";
					root.track.play();
				}
			}
			this.player_front_track.style.display = "none";
			this.player_front_track.style.width = this.player_loader_track.style.width = "0px";
			this.player_dial_track.style.left = getOffset(this.player_front_track).x + "px";
		}
	}


	this.getURLtrack = function(id,type){

		this.statusplay = false;
		
		var typeTrack = 1;
		if(type == "mp4"){
			typeTrack = 2;
		}

		if(root.player_preloader){
			if(root.remain){
				if(type == "mp3"){
					root.player_preloader.className = "loading";
				}
			}
		}

		if(this.ajax){
			this.ajax.abort();
		}
		
		this.ajax = nuevoAjax();
		this.ajax.onreadystatechange = function() {
			if(root.ajax.readyState == 4){
				if(root.ajax.responseText){
					var data = JSON.parse(root.ajax.responseText);
					parseData(data);
				}
			}
		}
		this.ajax.open(this.ajax_method, this.xml_track + "webservices.php?action=get_track&idcontent=" + id + "&idtipo=" + typeTrack,false);
		this.ajax.send();
		
		function parseData(data) {
			
			if(data.status == "OK"){
				
				root.statusplay = true;
				
				if(root.tracks.length > 0){
					
					//var url_track = root.xml_track + "getTrack.php?track_key=" + data.track_key;
					var url_track = data.signedUrl; 
	
					if(root.flash){
						if(root.tracks[root.current_track - 1].type == "mp3"){
							root.track.src = url_track;
							root.track.duration = root.tracks[root.current_track - 1].lenght / 1000;
						}else{
							root.createFlashVideo(url_track);
						}
						root.fplayer.getTrack(url_track,root.remain);
						if(root.remain){
							root.playing = true;
							root.player_play.className = 'switch';
							//AdobeEdge.getComposition("play_pause").getStage().play("ini");
							root.timer = setTimeout(root.showTime,1000);
							root.player_track_time.innerHTML = formatTime(root.track.duration);
							root.changeFavicon(true);
						}
						root.timerFlash = setTimeout(root.updateFlash,1000);
					}else{
						
						if(root.tracks[root.current_track - 1].type == "mp3"){
							root.track = document.getElementById("mp3");
							root.track.type= 'audio/mpeg';
							root.track.src = url_track;
							root.player_cover.style.height = "auto";
							root.removeHTML5Video();
						}else{
							root.createHTML5Video(url_track,root.tracks[root.current_track - 1].cover);
							root.player_cover.style.height = "0";
						}
						
						if(getOS() == "Android" || getOS() == "iOS"){
							root.startTrack();
							root.track.addEventListener("ended", root.finishTrack);
							root.track.addEventListener("progress", root.progressTrack);
							root.track.addEventListener("loadeddata", root.loadedTrack);
						}else{
							root.track.addEventListener("ended", root.finishTrack);
							root.track.addEventListener("progress", root.progressTrack);
							root.track.addEventListener("loadeddata", root.loadedTrack);
							root.track.addEventListener("canplaythrough", root.startTrack);
						}
	
						root.statusprogress = true;
		
					}
					root.track.active = true;
					root.statusLoading = true;
					
					lastTrack = root.tracks[root.current_track - 1].idtrack;
					lastAlbum = root.tracks[root.current_track - 1].idalbum;
	
					root.player_dial_track.style.left = getOffset(root.player_back_track).x + "px";
					root.player_front_track.style.width = "0";
					root.player_track_time.innerHTML = formatTime(0);
					if(root.tracks[root.current_track - 1].name.length > 35){
						root.player_track_name.innerHTML = root.tracks[root.current_track - 1].name.slice(0,32) + "... <br /><span>" + root.tracks[root.current_track - 1].artist.slice(0,32) + " ...</span>";
						root.player_cover_name.innerHTML = root.tracks[root.current_track - 1].name.slice(0,32) + "...";
						root.player_cover_artist.innerHTML = root.tracks[root.current_track - 1].artist.slice(0,32) + "...";
					}else{
						root.player_track_name.innerHTML = root.tracks[root.current_track - 1].name + " <br /><span>" + root.tracks[root.current_track - 1].artist + " </span>";
						root.player_cover_name.innerHTML = root.tracks[root.current_track - 1].name;
						root.player_cover_artist.innerHTML = root.tracks[root.current_track - 1].artist;
					}
					if(root.player_cover) root.player_cover.src = root.tracks[root.current_track - 1].cover;
					if(root.player_cover_small) root.player_cover_small.src = root.tracks[root.current_track - 1].cover;
	
					var audio = root.tracks[root.current_track - 1];
					var content_data = audio.lenght + "|" + audio.name + "|" + audio.type + "|" + audio.idtrack + "|" + audio.album + "|" + audio.artist + "|" + audio.cover + "|" + audio.idalbum;
	
					root.player_track_icons.style.display = "block";
					root.player_cover_info.setAttribute('title',content_data);
					root.track.setAttribute('title',audio.name);
					
					if(audio.type == "mp3"){
						root.player_cover_info.setAttribute('rel','audio');
					}else{
						root.player_cover_info.setAttribute('rel','video');
					}
					root.player_cover_info.setAttribute('rev',audio.idtrack);
	
					if(root.remain){
						if(root.timer){
							clearTimeout(root.timer);
						}
						root.timer = setTimeout(root.showTime,1000);
					}
	
					root.ajax = null;
				}
			}else{
				showHideAlert(".alert-danger",data.error);
			}
			
		}
				
	}


	this.getNewTrack = function(track,play){
		play = play || false;
		root.remain = play;
		this.current_track = track;
		this.statusplay = false;
		if(this.current_track < this.tracks.length){

			root.clearTrack();
			
			function startNext(){
				root.statusplay = true;
				if(root.tracks.length > 0){
					if(root.flash){
						root.track = new Object();
						root.track.duration = 0;

						root.track.pause = function(){
							root.fplayer.getPlay(false);
						}
						root.track.play = function(){
							root.fplayer.getPlay(true);
						}

						root.getURLtrack(root.tracks[root.current_track - 1].idtrack,root.tracks[root.current_track - 1].type);

					}else{
						root.getURLtrack(root.tracks[root.current_track - 1].idtrack,root.tracks[root.current_track - 1].type);
					}
				}
				
				if(root.position && root.status_random == false){
					for(var i=0;i<root.player_track_list.childNodes.length;i++){
						if(i == root.current_track - 1){
							root.player_container.scrollTop = getOffset(root.player_track_list.childNodes[i]).y - getPageScroll().y;
						}
					}
				}
			}

			if(root.timerNext) clearTimeout(root.timerNext);
			root.timerNext = setTimeout(startNext,400);

			this.setSelected(this.tracks[this.current_track].id);
			this.current_track++;

		}else{
			this.current_track = 0;
			if(this.status_replay){
				this.getNewTrack(this.current_track,true);
			}else{
				this.getNewTrack(this.current_track,false);
			}
		}
	}


	this.removeHTML5Video = function(){
		if(this.video){
			this.video.style.display = "none";
			this.video = null;
		}
	}


	this.createHTML5Video = function(url,poster){

		this.removeHTML5Video();

		this.video = document.getElementById("mp4");
		this.video.style.display = "block";
		this.video.src = url;
		this.video.poster = poster;
		document.getElementById("mp4_ogg").src = url;
		document.getElementById("mp4_mp4").src = url;

		this.track = this.video;
	}

	this.createFlashVideo = function(url){
		alert("Necesito cargar un HTML con el video en flash");
	}

	this.startTrack = function(e){
		if(root.remain){
			root.player_play_f();
			root.remain = false;
		}
	}

	this.progressTrack = function(){
		if(root.flash){
			root.player_loader_track.style.width = (getSize(root.player_back_track).w * root.fplayer.getLoaded()) / 100 + "px";
		}else{
			try{
				root.player_loader_track.style.width = (getSize(root.player_back_track).w * this.buffered.end(0)) / this.duration + "px";
				if(this.buffered.end(0) && root.statusprogress){
					if(getOS() == "unknown"){
						root.startTrack();
					}
					root.statusprogress = false;
				}
			}catch(e){}
		}
	}

	this.finishTrack = function(e){
		if(root.tracks[root.current_track - 1].type == "mp4"){
			root.bodys.removeChild(root.container_video);
		}
		root.playing = false;
		root.track.currentTime = 0;
		root.player_play.className = "";
		AdobeEdge.getComposition("play_pause").getStage().play("end");
		root.player_dial_track.style.left = getOffset(root.player_back_track).x + "px";
		root.player_front_track.style.width = "0";
		if(root.timer){
			clearTimeout(root.timer);
		}
		if(root.timerFlash){
			clearTimeout(root.timerFlash);
		}
		root.getNewTrack(root.current_track,true);
		root.setArrowsTrack(root.current_track);
		
		resetPlayTrack();
	}

	this.loadedTrack = function(e){
		root.player_track_time.innerHTML = formatTime(root.track.duration);
		root.player_time.innerHTML = formatTime(root.track.currentTime);
		root.track.volume = root.current_volume;
		if(getOS() == "unknown") if(root.player_preloader) root.player_preloader.className = "";
	}

	this.updateFlash = function(){
		var duration = root.fplayer.getDuration() / 1000;
		root.track.currentTime = root.fplayer.getCurrentTime() / 1000;
		root.track.volume = root.fplayer.getVolume();
		if(duration <= 0){
			root.timerFlash = setTimeout(root.updateFlash,100);
			root.player_track_time.innerHTML = duration;
		}else{
			clearTimeout(root.timerFlash);
			root.track.duration = duration;
		}
		root.player_track_time.innerHTML = formatTime(root.track.duration);
		root.player_time.innerHTML = formatTime(root.track.currentTime);
	}

	this.showTime = function(){
		try{
			var pos_dial = 0;
			if(root.flash){
				root.track.currentTime = root.fplayer.getCurrentTime() / 1000;
			}
			root.player_time.innerHTML = formatTime(root.track.currentTime);
			root.player_track_time.innerHTML = formatTime(root.track.duration);
			if(root.track.duration > 0 && root.track.currentTime > 0){
				this.player_front_track.style.display = "block";
				if(root.player_preloader) root.player_preloader.className = "";
				pos_dial = (getSize(root.player_back_track).w * root.track.currentTime) / root.track.duration;
				if(getOffset(root.player_dial_track).x < getOffset(root.player_back_track).x + getSize(root.player_back_track).w - getSize(root.player_dial_track).w){
					root.player_dial_track.style.left = getOffset(root.player_back_track).x + pos_dial + "px";
					root.player_front_track.style.width = pos_dial + getSize(root.player_dial_track).w + "px";
				}else{
					root.player_dial_track.style.left = getOffset(root.player_back_track).x + getSize(root.player_back_track).w - getSize(root.player_dial_track).w;
					root.player_front_track.style.width = getSize(root.player_back_track).w + "px";
				}
			}

			if(root.flash){
				if(Math.round(root.track.currentTime) >= Math.round(root.track.duration) && root.track.duration != 0){
					root.finishTrack();
				}
			}
		}catch(event){}

		root.timer = setTimeout(root.showTime,1000);
	}


	this.getDialUp = function(w,total){
		var pos_dial = (this.track.duration * w) / total;
		return pos_dial;
	}

	this.getVolume = function(w,total){
		var volume = w / total;
		return volume;
	}

	this.getVolumeWidth = function(volume){
		var w = (getSize(this.player_back_volume).w * volume) / 1;
		return w;
	}

	this.player_play_f = function(){
		if(this.statusplay){
			if(this.playing){
				this.playing = false;
				this.track.pause();
				clearTimeout(this.timer);
				this.player_play.className = '';
				AdobeEdge.getComposition("play_pause").getStage().play("end");
				console.log("Pausa");
				root.changeFavicon(false);
				resetPlayTrack();
			}else{
				this.playing = true;
				this.track.play();
				this.player_play.className = 'switch';
				AdobeEdge.getComposition('play_pause').getStage().play('ini');
				console.log("Reproduce");
				this.timer = setTimeout(root.showTime,1000);
				this.player_track_time.innerHTML = formatTime(this.track.duration);
				root.changeFavicon(true);
				//console.log("IDETEMA: " + this.tracks[this.current_track - 1].idtrack);
				machLabels(this.tracks[this.current_track - 1].idtrack,this.tracks[this.current_track - 1].idalbum);
			}
		}
	}


	/* ############################################ BOTH ############################################ */

	this.mouseUp = function(){
		document.onmouseup = function(e){
			var interval = 0;

			try{
				if(root.trackbar_status){
					if(!root.flash){
						root.track.play();
					}
					root.trackbar_status = false;
				}
			}catch(e){}


			function activeBox(){
				root.statusLoading = true;
			}
			
			if(root.counter){
				root.bodys.removeChild(root.counter);
				root.counter = null;
			}

			if(root.current_block){
				if(root.current_track_drag.num != null){
					interval = setTimeout(activeBox,400);
					if(root.current_block.amount == "multiply"){
						root.insertMultiplyTracks();
					}else{
						root.insertTrack(root.current_block,root.current_track_drag.num);
					}
				}else{
					if(root.empty){
						root.insertMultiplyTracks();
					}
				}
				if(root.current_block.amount == "multiply"){
					var parent = root.current_block.parentNode;
					parent.removeChild(root.current_block);
					root.tracksTemporary = null;
				}
			}
			root.current_block = root.elementDrag = null;
			
			root.player.className = root.player_container.className = "";

			root.status_scrollbar = true;

			document.onmousemove = null;
			
			clearRecreate();
			
			return false;
		}
	}


	this.insertMultiplyTracks = function(){
		
		for(var i=root.current_block.childNodes.length - 1;i>=0;i--){
			this.current_block.childNodes[i].style.position = "relative";
			this.current_block.childNodes[i].style.top = this.current_block.childNodes[i].style.left = "auto";
			this.current_block.childNodes[i].style.margin = this.margin_box + "px";
			this.current_block.childNodes[i].style.marginRight = "0px";
			this.tracksTemporary = this.tracksExternal[i];
			this.insertTrack(this.current_block.childNodes[i],this.current_track_drag.num,true);
		}
		if(this.empty){
			this.activePlayer(false);
			this.empty = false;
			try{
				AdobeEdge.getComposition("play_pause").getStage().play("end");
			}catch(event){
				console.log("Lac triangle");
			}
		}
		this.dragtracks.resetList(); 
		if(document.all){
			if(!window.addEventListener){
				IEPNGFix.update();
			}
		}
	}


	/* ############################################ PLAYLIST ############################################ */


	this.addTrack = function(container,pos){

		var box = document.createElement("div");

		box.lenght = root.tracks[pos].lenght;
		box.name = root.tracks[pos].name;
		box.type = root.tracks[pos].type;
		box.idtrack = root.tracks[pos].idtrack;
		box.album = root.tracks[pos].album;
		box.artist = root.tracks[pos].artist;
		box.cover = root.tracks[pos].cover;
		box.idalbum = root.tracks[pos].idalbum;

		box.status = false;
		box.className = "player_box_track";
		box.onmousedown = function(e){
			if(root.statusBoxClik){
				if(root.tracks.length > 1){
					e = e || window.event;
					this.status = true;
					root.many = false;
					root.elementDrag = this;
					document.onmousemove = function(ev){ root.moveBox(ev) };
				}
				root.mouseUp();
			}
			return false;
		}

		/* ------------- */

		var box_link = document.createElement("a");
		if(root.tracks[pos].type == "mp3"){
			box_link.setAttribute('href','#');
		}else{
			box_link.setAttribute('href','#');
		}
		box_link.onclick = function(){
			if(root.statusBoxClik){

				var statusrand = false;
				if(root.statusLoading){
					root.changeFavicon(true);
					if(root.status_random){
						statusrand = true;
						root.getRandom(false);
					}
					for(var i=0;i<root.tracks.length;i++){
						if(this.parentNode.id == root.tracks[i].id){
							//if(getOS() == "Android" || getOS() == "iOS") root.track.play();
							resetPlayTrack();
							root.getNewTrack(i,true);
							break;
						}
					}
					if(!root.status_random && statusrand){
						root.getRandom(true);
					}
				}
			}
			return false;
		}

		box.appendChild(box_link);

		var bt_close = document.createElement("div");
		bt_close.className = "bt_close";
		bt_close.onclick = function(event){
			event = event || window.event;
			if(root.statusBoxClik){
				root.statusBoxClik = false;
			    if(event.stopPropagation) {
					event.stopPropagation();
			    }else{
					// IE variant
					event.cancelBubble = true
				}
				var block = this.parentNode.parentNode;

				//Elimino el track cerrado (también de los array, principal y respaldo)
				root.removeTrack(block,this);
			}
			return false;
		}

		box_link.appendChild(bt_close);

			var box_icon = document.createElement("div");
			box_icon.className = "icon";
			box_link.appendChild(box_icon);

			var box_p = document.createElement("p");
			box_link.appendChild(box_p);

			var box_span = document.createElement("span");
			box_p.appendChild(box_span);
				var content_name = "";
				if(root.tracks[pos].name.length > 15){
					content_name+= root.tracks[pos].name.slice(0,root.lengthName) + "...";
				}else{
					content_name+= root.tracks[pos].name;
				}
				var box_text = document.createTextNode(content_name);
				box_span.appendChild(box_text);

			var content_artist = "";
			if(root.tracks[pos].artist.length > 15){
				content_artist+= root.tracks[pos].artist.slice(0,root.lengthName) + "...";
			}else{
				content_artist+= root.tracks[pos].artist;
			}
			var box_text_artist = document.createTextNode(content_artist);
			box_p.appendChild(box_text_artist);

		container.appendChild(box);
		this.player_track_back.getElementsByTagName("p")[0].style.display = "none";

		if(!this.position){
			this.setWidthPlaylist(box);
		}
		
		root.setArrowsTrack(root.current_track - 1);

	}


	this.getPositionElement = function(parent,child){
		for(var i=0;i<parent.childNodes.length;i++){
			if(child.id == parent.childNodes[i].id){
				return i;
				break;
			}
		}
	}

	this.removeTrack = function(block,btclose){
		btclose || ( btclose = null );
		var parent = block.parentNode;
		var nodeSelected = block.className.search("player_selected_track");
		var position = root.getPositionElement(parent,block);

		var statusrand = false;

		if(this.status_random){
			statusrand = true;
			this.getRandom(false);
		}

		for(var k=0;k<root.tracks.length;k++){
			if(root.tracks[k].id == block.id){
				root.tracksTemporary = root.tracks[k];
				root.tracks.splice(k,1);
				break;
			}
		}

		function fade(){
			console.log("remueve");
			parent.removeChild(block);
			if(root.tracks.length > 0){
				root.setCorrectId();
				if(btclose){
					if(nodeSelected > -1){
						if(position == 0 && root.tracks.length > 0){
							if(root.playing){
								root.getNewTrack(position,true);
							}else{
								root.getNewTrack(position,false);
							}
						}else if(position > 0){
							if(root.playing){
								root.getNewTrack(position - 1,true);
							}else{
								root.getNewTrack(position - 1,false);
							}
						}
					}else if(position < root.current_track - 1){
						root.current_track = root.current_track - 1;
					}
					root.setArrowsTrack(root.current_track - 1);
				}

				/* Enable save boton */
				if(root.btn_save){
					root.btn_save.status = true;
					root.btn_save.className = "";
				}

			}else{
				if(root.counter_tracks) root.counter_tracks.style.display = "none";
				root.resetPlayer();
			}
			
			root.setCurrentTrack(root.current_track);

			if(root.tracks.length < 3){
				root.player_track_replay.getElementsByTagName("a")[0].className = "switch";
			}else{
				if(!root.status_random && statusrand){
					root.getRandom(true);
				}
			}

			root.statusBoxClik = true;

		}

		if(btclose){
			fade();
			root.reSetPlaylist();
			/*fadeElement(block,100,0,false,function(){
				fade();
				root.reSetPlaylist();
			});*/
		}else{
			fade();
		}
	}


	this.moveExternalBox = function(ev){
		ev = ev || window.event;
		root.mousePos = mouseCoords(ev,root.player_container);
		root.statusLoading = false;

		var selected = false;

		if(root.elementDrag.status){
			root.elementDrag.id = "";
			root.bodys.appendChild(root.elementDrag);
			root.current_block = root.elementDrag;
		}

		var arrayBlocks = root.player_track_list.childNodes;

		if(root.current_block){
			root.current_block.style.top = (mouseCoords(ev).y - (getSize(root.current_block).h / 2)) + "px";
			root.current_block.style.left = (mouseCoords(ev).x - (getSize(root.current_block).w / 2)) + "px";
			root.counter.style.top = root.current_block.style.top;
			root.counter.style.left = root.current_block.style.left;

			root.current_block.style.position = "absolute";
			
			for(var i=0;i<arrayBlocks.length;i++){
				if(detectCollision(arrayBlocks[i],root.current_block,root.player_container,getOffset(root.player_track_list).x,root.player_container.scrollTop * -1)){
					root.current_track_drag.num = i;
					if(arrayBlocks[i].className.indexOf("player_selected_track") > -1 && !selected){
						arrayBlocks[i].className = "player_box_track player_selected_track border_left";
					}else{
						arrayBlocks[i].className = "player_box_track border_left";
					}
				}else{
					if(arrayBlocks[i].className.indexOf("player_selected_track") > -1 && !selected){
						arrayBlocks[i].className = "player_box_track player_selected_track";
					}else{
						arrayBlocks[i].className = "player_box_track";
					}
				}
			}
			
			
			/*if(detectCollision(root.player_container,root.current_block,root.player_container,getOffset(root.player_container).x * -1,(window.innerHeight - getSize(root.player).h - getSize(root.player_container).h) * -1)) {
				console.log(getSize(root.player).h);
			}*/

			if(detectCollision(root.player_container,root.current_block,root.player_container,getOffset(root.player_container).x * -1,(window.innerHeight - getSize(root.player).h - getSize(root.player_container).h) * -1) || detectCollision(root.player,root.current_block,root.player,getOffset(root.player).x,(window.innerHeight - getSize(root.player).h) * -1)){
				if(detectCollision(root.player,root.current_block,root.player,getOffset(root.player).x,(window.innerHeight - getSize(root.player).h) * -1)){
					root.player.className = "detect_player_drag";
					root.openPlaylist();
				}else{
					root.player_container.className = "detect_player_drag";
				}
				if(this.tracks.length < 1){
					this.current_track_drag.num = null;
					this.empty = true;
				}else{
					if(compareYCoords(root.mousePos.y,arrayBlocks[arrayBlocks.length - 1],root.player_container.scrollTop * -1)){
						this.current_track_drag.num = arrayBlocks.length;
						if(arrayBlocks[arrayBlocks.length - 1].className.indexOf("player_selected_track") > -1 && !selected){
							arrayBlocks[arrayBlocks.length - 1].className = "player_box_track player_selected_track border_right";
						}else{
							arrayBlocks[arrayBlocks.length - 1].className = "player_box_track border_right";
						}
					}
				}
				this.player_track_list.style.width = this.playlist_w + this.track_w + this.margin_box + "px";
			}else{
				this.empty = false;
				root.player.className = root.player_container.className = "";
				this.player_track_list.style.width = this.playlist_w + "px";
				this.current_track_drag.num = null;
			}

			if(this.mousePos.x < this.track_w){
				this.moveScroll(false,20);
			}else if(this.mousePos.x > getSize(this.player_container).w - this.track_w){
				this.moveScroll(true,20);
			}
				
			if(root.position){
				if(root.mousePos.y < 40){
					root.player_container.scrollTop = root.player_container.scrollTop - 10;
				}
				
				if(root.mousePos.y > getSize(root.player_container).h - 40){
					root.player_container.scrollTop = root.player_container.scrollTop + 10;
				}
			}
		}
	}


	this.moveBox = function(ev){
		
		ev = ev || window.event;
		root.mousePos = mouseCoords(ev,root.player_container);
		root.statusLoading = false;

		var selected = false;

		if(root.elementDrag.status){
			root.removeTrack(root.elementDrag);
			root.elementDrag.id = "";
			root.bodys.appendChild(root.elementDrag);

			root.current_block = root.elementDrag;
			if(root.current_block.className.indexOf("player_selected_track") > -1){
				selected = true;
				root.current_block.className = "player_box_track player_selected_track display_none";
			}else{
				root.current_block.className = "player_box_track display_none";
			}
			root.current_block.num = root.current_track_drag.num = Number(root.elementDrag.num);
			root.current_block.status = root.elementDrag.status = false;
		}

		var arrayBlocks = root.player_track_list.childNodes;
		
		if(root.current_block){
			if(root.current_block.className.indexOf("player_selected_track") > -1){
				selected = true;
				root.current_block.className = "player_box_track player_selected_track absolute_block";
			}else{
				root.current_block.className = "player_box_track absolute_block";
			}

			root.current_block.style.top = (mouseCoords(ev).y - (getSize(root.current_block).h / 2)) + "px";
			root.current_block.style.left = (mouseCoords(ev).x - (getSize(root.current_block).w / 2)) + "px";
			
			root.current_block.style.position = "absolute";

			for(var i=0;i<arrayBlocks.length;i++){
				if(detectCollision(arrayBlocks[i],root.current_block,root.player_container,getOffset(root.player_track_list).x * -1,root.player_container.scrollTop * -1)){
					root.current_track_drag.num = i;
					if(arrayBlocks[i].className.indexOf("player_selected_track") > -1 && !selected){
						arrayBlocks[i].className = "player_box_track player_selected_track border_left";
					}else{
						arrayBlocks[i].className = "player_box_track border_left";
					}
				}else{
					if(arrayBlocks[i].className.indexOf("player_selected_track") > -1 && !selected){
						arrayBlocks[i].className = "player_box_track player_selected_track";
					}else{
						arrayBlocks[i].className = "player_box_track";
					}
				}
			}
			
			if(detectCollision(root.player_container,root.current_block,root.player_container,getOffset(root.player_container).x * -1,(window.innerHeight - getSize(root.player_container).h) * -1)){
				var total = getOffset(arrayBlocks[arrayBlocks.length - 1]).y + getSize(arrayBlocks[arrayBlocks.length - 1]).h;
				if(compareYCoords(root.mousePos.y,arrayBlocks[arrayBlocks.length - 1],root.player_container.scrollTop * -1)){
					root.current_track_drag.num = arrayBlocks.length;
					if(arrayBlocks[arrayBlocks.length - 1].className.indexOf("player_selected_track") > -1 && !selected){
						arrayBlocks[arrayBlocks.length - 1].className = "player_box_track player_selected_track border_right";
					}else{
						arrayBlocks[arrayBlocks.length - 1].className = "player_box_track border_right";
					}
					root.player_container.scrollTo(0,root.player_container.scrollTop + 10);
				}
			}

			if(this.mousePos.x < this.track_w){
				this.moveScroll(false,20);
			}else if(this.mousePos.x > getSize(this.player_container).w - this.track_w){
				this.moveScroll(true,20);
			}

			/*if(root.elementDrag.status){
				root.current_block.status = root.elementDrag.status = false;
			}*/
			
			if(root.position){
				if(root.mousePos.y < getSize(arrayBlocks[0]).h){
					root.player_container.scrollTop = root.player_container.scrollTop - 10;
				}
				
				if(root.mousePos.y > getSize(root.player_container).h - getSize(arrayBlocks[0]).h){
					root.player_container.scrollTop = root.player_container.scrollTop + 10;
				}
			}
			
		}
	}


	this.setWidthPlaylist = function(box){
		if(!this.position){
			this.track_w = getSize(box).w;
			this.playlist_w = (this.track_w + this.margin_box) * this.tracks.length + this.margin_box;
			this.player_track_list.style.width = this.playlist_w + "px";
			if(getSize(this.player_track_list).w < getSize(this.player_container).w){
				this.player_container.style.bottom = this.player_track_back.style.bottom = getSize(this.player).h + "px";
				this.container_scroll.style.display = "none";
			}else{
				this.setEventScroll();
				this.player_container.style.bottom = this.player_track_back.style.bottom = getSize(this.player).h + getSize(this.container_scroll).h + "px";
			}
		}
	}


	/* Create Array with externals track boxes */

	this.createExternalTracks = function(e,master){
		
		e = e || window.event;
		this.tracksExternal = master;
		root.elementDrag = document.createElement("div");
		root.elementDrag.status = true;

		for(var i=0;i<master.length;i++){
			var box = document.createElement("div");

			box.lenght = master[i].lenght;
			box.name = master[i].name;
			box.type = master[i].type;
			box.idtrack = master[i].idtrack;
			box.album = master[i].album;
			box.artist = master[i].artist;
			box.cover = master[i].cover;
			box.idalbum = master[i].idalbum;


			box.status = false;
			//box.className = "player_box_track absolute_multiple_block";
			box.className = "player_box_track";
			box.onmousedown = function(e){
				if(root.statusBoxClik){
					if(root.tracks.length > 1){
						e = e || window.event;
						this.status = true;
						root.many = false;
						root.elementDrag = this;
						document.onmousemove = function(ev){ root.moveBox(ev) };
						console.log("Down");
					}
					root.mouseUp();
				}
				return false;
			}


			var box_link = document.createElement("a");
			if(master[i].type == "mp3"){
				//box_link.setAttribute('href',master[i].idtrack + ".mp3");
				box_link.setAttribute('href','#');
			}else{
				box_link.setAttribute('href','#');
			}
			box_link.onclick = function(){
				if(root.statusBoxClik){
					var statusrand = false;
					root.changeFavicon(true);
					if(root.statusLoading){
						if(root.status_random){
							statusrand = true;
							root.getRandom(false);
						}
						for(var i=0;i<root.tracks.length;i++){
							if(this.parentNode.id == root.tracks[i].id){
								//if(getOS() == "Android" || getOS() == "iOS") root.track.play();
								resetPlayTrack();
								root.getNewTrack(i,true);
								break;
							}
						}

						if(!root.status_random && statusrand){
							root.getRandom(true);
						}
					}
				}
				return false;
			}

			box.appendChild(box_link);

			var bt_close = document.createElement("div");
			bt_close.className = "bt_close";
			bt_close.onclick = function(event){
				event = event || window.event;
				if(root.statusBoxClik){
					root.statusBoxClik = false;
				    if (event.stopPropagation) {
						event.stopPropagation();
				    }else{

						event.cancelBubble = true
					}
					var block = this.parentNode.parentNode;

					root.removeTrack(block,this);
				}
				return false;
			}

			box_link.appendChild(bt_close);

				var box_icon = document.createElement("div");
				box_icon.className = "icon";
				box_link.appendChild(box_icon);

				var box_p = document.createElement("p");
				box_link.appendChild(box_p);

				var box_span = document.createElement("span");
				box_p.appendChild(box_span);
				var content_name = "";
				if(master[i].name.length > 15){
					content_name+= master[i].name.slice(0,root.lengthName) + "...";
				}else{
					content_name+= master[i].name;
				}
				var box_text = document.createTextNode(content_name);
				box_span.appendChild(box_text);

			var content_artist = "";
			if(master[i].artist.length > 15){
				content_artist+= master[i].artist.slice(0,root.lengthName) + "...";
			}else{
				content_artist+= master[i].artist;
			}
			var box_text_artist = document.createTextNode(content_artist);
			box_p.appendChild(box_text_artist);

			box.style.position = "absolute";
			box.style.marginLeft = box.style.marginTop = (2 * i) + "px";
			box.style.marginLeft = box.style.marginLeft = (2 * i) + "px";
			if(i > 10){
				box.style.display = "none";
			}
			root.elementDrag.appendChild(box);
		}
		
		root.counter = document.createElement("div");
		root.counter.setAttribute('id','player_counter');
		root.counter.style.position = "absolute";
		root.counter.style.marginTop = root.counter.style.marginLeft = "-14px";
		root.counter.style.width = "20px";
		root.counter.style.height = "20px";
		root.counter.style.lineHeight = "18px";
		root.counter.style.textAlign = "center";
		root.counter.style.zIndex = "5000";
		root.counter.innerHTML = master.length;
		
		root.bodys.appendChild(root.counter);

		root.elementDrag.amount = "multiply";
		root.elementDrag.className = "container_multiply";
		
		document.onmousemove = function(ev){ root.moveExternalBox(ev) };
		root.mouseUp();
	}

	this.setCorrectId = function(){
		var elements = this.player_track_list.childNodes;
		for(var i=0;i<elements.length;i++){
			elements[i].setAttribute('id',i);
			elements[i].num = i;
			this.tracks[i].id = i;
			this.tracks[i].lenght = elements[i].lenght;
			this.tracks[i].name = elements[i].name;
			this.tracks[i].idtrack = elements[i].idtrack;
			this.tracks[i].type = elements[i].type;
			this.tracks[i].album = elements[i].album;
			this.tracks[i].artist = elements[i].artist;
			this.tracks[i].audio = elements[i].audio;
			this.tracks[i].cover = elements[i].cover;
			this.tracks[i].idalbum = elements[i].idalbum;
		}
		if(this.counter_tracks) this.counter_tracks.innerHTML = this.tracks.length;
		this.tracks_backup = this.tracks.slice();
	}

	this.moveScrolltoPlaylist = function(){
		if(!this.position){
			var spaceplaylist = getSize(this.player_track_list).w - getSize(this.player_container).w;
			var spacebar = getSize(root.container_scroll).w - getSize(root.scrollbar).w;
			var multiplier = spacebar / spaceplaylist;

			var position = Math.round(getOffset(root.player_track_list).x * multiplier * -1);
			this.scrollbar.style.left =  position + "px";
		}
	}

	this.movePlaylist = function(){

		var spaceplaylist = spacebar = multiplier = multiplier = 0;

		if(this.container_scroll.style.display != "none"){
			if(!this.position){
				spaceplaylist = getSize(this.player_track_list).w - getSize(this.player_container).w;
				spacebar = getSize(this.container_scroll).w - getSize(this.scrollbar).w;
				multiplier = spaceplaylist / spacebar;
				position = Math.round(getOffset(this.scrollbar).x * multiplier * -1);
				this.player_track_list.style.left =  position + "px";
			}
		}
	}


	this.moveScroll = function(direction,speed){

		if(direction){
			root.scrollbar.style.left = getOffset(root.scrollbar).x + speed + "px";
		}else{
			root.scrollbar.style.left = getOffset(root.scrollbar).x - speed + "px";
		}

		if(getOffset(root.scrollbar).x < 0){
			root.scrollbar.style.left = "0";
		}else if(getOffset(root.scrollbar).x > getSize(root.container_scroll).w - getSize(root.scrollbar).w){
			root.scrollbar.style.left = getSize(root.container_scroll).w - getSize(root.scrollbar).w + "px";
		}

		root.movePlaylist();

	}

	this.setEventScroll = function(){

		this.track_w = getSize(this.player_track_list.getElementsByTagName("div")[0]).w;
		this.playlist_w = (this.track_w + this.margin_box) * this.tracks.length + this.margin_box;
		this.scrollbar_w = getSize(this.player_container).w * (getSize(this.player_container).w / this.playlist_w);
		this.scrollbar.style.width =  this.scrollbar_w + "px";

		if(!root.closed){
			root.container_scroll.style.display = "block";
		}

		this.scrollbar.onmousedown = function(e){
			e = e || window.event;
			root.status_scrollbar = false;
			var posinit = mouseCoords(e).x - getOffset(this).x;
			document.onmousemove = function(e){
				e = e || window.event;
				var mousePos = mouseCoords(e);
				if(getOffset(root.scrollbar).x >= 0 && getOffset(root.scrollbar).x <= getOffset(root.container_scroll).x + getSize(root.container_scroll).w - getSize(root.scrollbar).w){
					root.scrollbar.style.left = mousePos.x - posinit + "px";
					if(getOffset(root.scrollbar).x < 0){
						root.scrollbar.style.left = "0";
					}else if(getOffset(root.scrollbar).x > getSize(root.container_scroll).w - getSize(root.scrollbar).w){
						root.scrollbar.style.left = getSize(root.container_scroll).w - getSize(root.scrollbar).w + "px";
					}
				}

				root.movePlaylist();
				return false;
			}
			root.mouseUp();
			return false;
		}

		this.container_scroll.onmousedown = function(e){
			e = e || window.event;
			if(root.status_scrollbar){
				if(mouseCoords(e).x < getSize(this).w - getSize(root.scrollbar).w){
					root.scrollbar.style.left = mouseCoords(e).x + "px";
				}else{
					root.scrollbar.style.left = getSize(this).w - getSize(root.scrollbar).w + "px";
				}
				root.movePlaylist();
			}
			root.mouseUp();
			return false;
		}

		if(getOffset(root.scrollbar).x < 0){
			root.scrollbar.style.left = "0";
		}else if(getOffset(root.scrollbar).x > getSize(root.container_scroll).w - getSize(root.scrollbar).w){
			root.scrollbar.style.left = getSize(root.container_scroll).w - getSize(root.scrollbar).w + "px";
		}
	}


	this.getRandom = function(type){
		if(type){
			this.player_track_replay.getElementsByTagName("a")[0].className = '';
			var trackRand = this.tracks[this.old_current];
			this.tracks.splice(this.old_current,1);
			this.tracks = shuffle(this.tracks).slice();
			this.tracks.splice(0,0,trackRand);
			this.current_track = 1;
			this.status_random = true;
		}else{
			this.player_track_replay.getElementsByTagName("a")[0].className = 'switch';
			this.tracks = this.tracks_backup.slice();
			this.status_random = false;
			this.setCurrentTrack();
		}
		this.setArrowsTrack();
	}


	this.changeFavicon = function(status){
		if(!document.all){
			var favicon = document.getElementById('favicon');
			document.getElementsByTagName("head")[0].removeChild(favicon);

			var fav = document.createElement('link');
			fav.id = 'favicon';
			fav.rel = 'shortcut icon';

			if(status){
				fav.href = URL_TEMPLATES + 'favicon_play.png';
			}else{
				fav.href = URL_TEMPLATES + 'favicon.png';
			}
			document.getElementsByTagName("head")[0].appendChild(fav);
		}
	}

	this.player_init_f = function(){
		if(this.statusplay){
			if(this.current_track > 1){
				var num = this.current_track - 2;
				//if(getOS() == "Android" || getOS() == "iOS") root.track.play();
				this.getNewTrack(num,true);
			}
		}
	}

	this.player_end_f = function(){
		if(this.statusplay){
			if(this.current_track < this.tracks.length){
				//if(getOS() == "Android" || getOS() == "iOS") root.track.play();
				this.getNewTrack(this.current_track,true);
			}else{
				if(this.status_replay){
					//if(getOS() == "Android" || getOS() == "iOS") root.track.play();
					this.getNewTrack(0,true);
				}
			}
		}
	}


	this.reSetPlaylist = function(){
		if(!this.position){
			this.player_track_list.style.width = (this.track_w + this.margin_box) * this.tracks.length + this.margin_box + "px";
			if(getSize(this.player_track_list).w < getSize(this.player_container).w){

				this.player_container.style.bottom = this.player_track_back.style.bottom = getSize(this.player).h + "px";

				this.container_scroll.style.display = "none";
				this.player_track_list.style.left = 0;
				if(this.container_scroll.onmousedown) this.container_scroll.onmousedown = null;
				if(document.onmousemove) document.onmousemove = null;
			}else{

				this.player_container.style.bottom = this.player_track_back.style.bottom = getSize(this.player).h + getSize(this.container_scroll).h + "px";

				this.setEventScroll();
				this.movePlaylist();

			}
		}
	}

	this.setSelected = function(id){
		for(var i=0;i<this.player_track_list.childNodes.length;i++){
			if(this.player_track_list.childNodes[i].id == id){
				this.player_track_list.childNodes[i].getElementsByTagName("a")[0].disabled = true;
				this.player_track_list.childNodes[i].className = 'player_box_track player_selected_track';
				this.old_current = i;
				
				function finishMove(){
					root.statusplay = true;
					root.moveScrolltoPlaylist();
				}
				
				var position = getOffset(this.player_track_list.childNodes[i]).x + getOffset(this.player_track_list).x;
				var posPlaylist = 0;

				if(!this.position){
					if(position < 0){
						this.statusplay = false;
						posPlaylist = getOffset(this.player_track_list).x - position;
						easingElement(this.player_track_list,getOffset(this.player_track_list).x,posPlaylist,finishMove);
					}else if(position > getSize(this.player_container).w - this.track_w){
						this.statusplay = false;
						posPlaylist = getOffset(this.player_track_list).x + (getSize(this.player_container).w - (position + this.track_w));
						easingElement(this.player_track_list,getOffset(this.player_track_list).x,posPlaylist,finishMove);
					}
				}

				this.setArrowsTrack(this.current_track);
			}else{
				this.player_track_list.childNodes[i].getElementsByTagName("a")[0].disabled = false;
				this.player_track_list.childNodes[i].className = 'player_box_track';
			}
		}
	}

	this.insertTrack = function(element,position,many){
		element.setAttribute('style','');
		position = position || 0;
		many = many || false;
		root.many = many;
		var statusrand = false;
		if(root.status_random){
			statusrand = true;
			root.getRandom(false);
		}
		var arrayBlocks = root.player_track_list.childNodes;
		if(arrayBlocks.length > 0){
			if(compareXCoords(root.mousePos.x,arrayBlocks[arrayBlocks.length - 1],getOffset(root.player_track_list).x) || root.many || position >= arrayBlocks.length){
				if(position >= arrayBlocks.length){
					if(arrayBlocks[arrayBlocks.length - 1].className.indexOf("player_selected_track") > -1){
						arrayBlocks[arrayBlocks.length - 1].className = "player_box_track player_selected_track";
					}else{
						arrayBlocks[arrayBlocks.length - 1].className = "player_box_track";
					}
					root.player_track_list.appendChild(element);
				}else{
					if(arrayBlocks[position].className.indexOf("player_selected_track") > -1){
						arrayBlocks[position].className = "player_box_track player_selected_track";
					}else{
						arrayBlocks[position].className = "player_box_track";
					}
					root.player_track_list.insertBefore(element,arrayBlocks[position]);
				}

				root.tracks.splice(arrayBlocks.length - 1,0,root.tracksTemporary);
			}else{
				if(arrayBlocks[position].className.indexOf("player_selected_track") > -1){
					arrayBlocks[position].className = "player_box_track player_selected_track";
				}else{
					arrayBlocks[position].className = "player_box_track";
				}
				root.player_track_list.insertBefore(element,arrayBlocks[position]);

				root.tracks.splice(position,0,root.tracksTemporary);
			}
		}else{
			this.player_track_back.getElementsByTagName("p")[0].style.display = "none";
			this.player_track_list.appendChild(element);
			this.tracks.push(root.tracksTemporary);
		}

		root.setCorrectId();

		if(root.current_block.className.indexOf("player_selected_track") > -1){
			root.current_block.className = "player_box_track player_selected_track relative_block";
		}else{
			root.current_block.className = "player_box_track relative_block";
		}

		root.current_block.style.position = "relative";
		root.current_block.style.top = root.current_block.style.left = "auto";

		this.setCurrentTrack();

		if(!root.status_random && statusrand){
			root.getRandom(true);
			root.player_track_replay.getElementsByTagName("a")[0].className = "";
		}

		this.setWidthPlaylist(element);
		this.moveScrolltoPlaylist();

		if(this.btn_save){
			this.btn_save.status = true;
			this.btn_save.className = "";
		}

		this.setArrowsTrack(this.current_track - 1);
 
	}

	this.setCurrentTrack = function(){
		for(var i=0;i<this.player_track_list.childNodes.length;i++){
			if(this.player_track_list.childNodes[i].className.indexOf("player_selected_track") > -1){
				this.old_current = Number(this.player_track_list.childNodes[i].id);
				if(Number(this.player_track_list.childNodes[i].id) < this.tracks.length){
					this.current_track = Number(this.player_track_list.childNodes[i].id) + 1;
				}else{
					this.current_track = 0;
				}
				break;
			}
		}
	}
	
}