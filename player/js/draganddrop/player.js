/* Ajax */

function nuevoAjax(){ 
	var xmlhttp=false;
	try { 
		xmlhttp=new ActiveXObject("Msxml2.XMLHTTP"); 
		
	}
	catch(e){ 
		try	{ 
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); 
		} 
		catch(E) { 
			xmlhttp=false;
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest!="undefined") {
		xmlhttp=new XMLHttpRequest(); 
	} 
	return xmlhttp; 
}

/* Construct function */

function playerAudio(e,box,xml,html5){
	
	var root = this;
	
	/* Create Ajax object */
	
	this.ajax = nuevoAjax();
	this.ajax_method = "GET";
	
	/* Players vars */
	
	this.flash = false;
	this.current_track = 0;
	this.old_current = 0;
	this.general_volume = this.current_volume = 0.5;
	this.mousePos = new Object();
	this.statusplay = true;
	this.next = false;
	this.status_replay = false;
	this.status_random = false;
	this.playing = false;
	this.timerNext = null;
	this.timer = 0;
	this.timerFlash = 0;
	this.fplayer = null;
	this.statusLoading = false;
	this.tracks = this.tracks_backup = this.arrayTracks = this.tracksExternal = new Array();
	
	/* Playlist vars */
	
	this.satus_arrow = true;
	this.trackbar_status = false;
	this.closed = false;
	this.margin_box = 5;
	this.many = false;
	this.empty = false;
	this.tracksTemporary = new Object();
	
	/* Player elements */
	
	this.player;
	this.player_init;
	this.player_play;
	this.player_end;
	this.player_cover;
	this.player_time;
	this.player_track_name;
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
	
	/* Playlist elements */
	
	this.player_track_list_arrows;
	this.player_container;
	this.player_track_list;
	this.player_track_back;
	
	/* Site´s tracks */
	
	this.dragtracks;
	
	/* Scrollbar */
	
	this.container_scroll;
	this.scrollbar;
	this.status_scrollbar = true;
	this.track_w;
	this.playlist_w;
	this.scrollbar_w;
	
	/* Drag and drop */
	
	this.current_track_drag = new Object();
	this.elementDrag = this.current_block = null;
		
	/* ------------- */
	
	this.ready = function(){}
	
	function loadBody(){
		root.ready();
		try{
			if(!html5){
				document.getElementById("no_exist").innerHTML = "test";
			}
			document.createElement("canvas").getContext("2d");
			document.getElementById(box).style.display = "block";
			root.loadNewPlaylist(xml);
		}catch(event){
			document.getElementById(box).style.display = "block";
			root.flash = true;
			root.placeFlash();
		}
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
	
	
	
	/* ############################################ PLAYER ############################################ */
	
	
	this.loadNewPlaylist = function(xml){
		
		/* Get XML data */
	
		this.xml_file = xml;
		this.tracks = this.tracks_backup = new Array(); 
		this.ajax.open(this.ajax_method,this.xml_file,true);
		this.ajax.onreadystatechange = function(){
			if(root.ajax.readyState == 4){
				if(root.ajax.responseXML){
					root.content = root.ajax.responseXML;
					
					/* Armo la playlist parseando el XML */
					
					root.arrayTracks = root.content.getElementsByTagName("track");
					for(var i=0;i<root.arrayTracks.length;i++){
						var audio = new Object();
						audio.name = root.arrayTracks[i].getAttribute("name");
						audio.id = i;
						audio.album = root.arrayTracks[i].getAttribute("album");
						audio.artist = root.arrayTracks[i].getAttribute("artist");
						audio.audio = root.arrayTracks[i].getAttribute("audio");
						audio.cover = root.arrayTracks[i].getAttribute("cover");
						root.tracks.push(audio);
					}
					
					root.tracks_backup = root.tracks.slice();
					root.setElements();
				}
			}
		}
		this.ajax.send();
	}
	
	
	/* Place Flash if don´t have canvas */
	
	this.placeFlash = function(){
		document.getElementById(e.flash_content).style.borderTop = "solid 1px white";
		this.fplayer = new flashPlayer();
		var so = new SWFObject(e.flash_swf, e.flash_id, e.flash_width, e.flash_height, e.flash_player, e.flash_bg);
       so.write(e.flash_content);
	}
	
	
	/* Drag and drop */
	
	this.resetPlayer = function(){
		clearTimeout(root.timer);
		if(this.track){
			this.track.pause();
			if(!root.flash){
				this.track.removeEventListener("progress", root.progressTrack);
				this.track.removeEventListener("ended", root.finishTrack);
				this.track.removeEventListener("loadeddata", root.loadedTrack);
				//this.track.removeEventListener("canplaythrough", root.startTrack);
			}
			this.player_front_track.style.width = this.player_loader_track.style.width = "0px";
			this.player_dial_track.style.left = getOffset(this.player_front_track).x + "px";
			this.track.src = "";
			this.track = null;
		}
		this.player_track_time.innerHTML = formatTime(0);
		this.player_time.innerHTML = formatTime(0);
		this.player_track_name.innerHTML = "";
		this.player_cover.src = "images/cover.jpg";
		this.player_play.className = '';
		this.player_init.className = this.player_end.className = 'switch';
		this.player_track_replay.getElementsByTagName("a")[0].className = 'switch';
		this.player_track_replay.getElementsByTagName("a")[1].className = 'switch';
	}
	
	
	this.activePlayer = function(){
		this.current_track = 0;
		this.getNewTrack(this.current_track,false);
		this.player_init.className = 'switch';
		this.player_end.className = '';
		if(root.tracks.length > 1){
			this.player_end.className = 'switch';
		}
		this.player_end.className = '';
		this.player_track_replay.getElementsByTagName("a")[0].className = 'switch';
		this.player_track_replay.getElementsByTagName("a")[1].className = 'switch';
	}
	
	
	this.setArrowsTrack = function(current){
		root.player_end.className = '';
		root.player_init.className = '';
		if(current < 2){
			root.player_init.className = 'switch';
			root.player_end.className = '';
		}else if(current >= root.tracks.length && !root.status_replay){
			root.player_init.className = '';
			root.player_end.className = 'switch';
		}
	}
	
	
	this.turnVolume = function(vol){
		var w = getSize(root.player_front_volume).w + vol;
		if(w >= 0) root.player_front_volume.style.width = w + "px";
		root.player_dial_volume.style.left = getOffset(root.player_back_volume).x - getSize(root.player_dial_volume).w / 2 + getSize(root.player_front_volume).w + "px";
		
		if(getOffset(root.player_dial_volume).x <= getOffset(root.player_back_volume).x){
			
			root.track.volume = 0;
			root.current_volume = root.general_volume = root.track.volume;
			root.player_speaker.className = 'switch';
			
			if(root.flash){
				root.track.volume = root.fplayer.setVolume(0);
			}
			
			root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + "px";
			root.player_front_volume.style.width = "0";
			
		}else if(getOffset(root.player_dial_volume).x > getOffset(root.player_back_volume).x + getSize(root.player_back_volume).w - getSize(root.player_dial_volume).w){
			root.track.volume = 1;
			root.current_volume = root.general_volume = root.track.volume;
			root.player_speaker.className = '';
			if(root.flash){
				root.track.volume = root.fplayer.setVolume(1);
			}
			
			root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + getSize(root.player_back_volume).w - getSize(root.player_dial_volume).w + "px";
			root.player_front_volume.style.width = getSize(root.player_back_volume).w + "px";
		}else{
			root.track.volume = root.getVolume(getSize(root.player_front_volume).w,getSize(root.player_back_volume).w);
			root.current_volume = root.general_volume = root.track.volume;
			root.player_speaker.className = '';
			if(root.flash){
				root.track.volume = root.fplayer.setVolume(root.current_volume);
			}
		}
	}

	
	/* Setting elements */
	
	this.setElements = function(){
		
		var root = this;
		
		this.player = document.getElementById(e.player);
		this.player_track_list_arrows = document.getElementById(e.player_track_list_arrows);
		this.player_init = document.getElementById(e.player_init);
		this.player_play = document.getElementById(e.player_play);
		this.player_end = document.getElementById(e.player_end);
		this.player_cover = document.getElementById(e.player_cover);
		this.player_time = document.getElementById(e.player_time);
		this.player_track_name = document.getElementById(e.player_track_name);
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
		this.player_container = document.getElementById(e.player_container);
		this.player_track_list = document.getElementById(e.player_track_list);
		this.player_track_back = document.getElementById(e.player_track_back);
		
		/* Scrollbar */
		
		this.container_scroll = document.getElementById(e.container_scroll);
		this.scrollbar = document.getElementById(e.scrollbar);
		
		/* Reset prev elements */
		
		this.player_play.className = '';
		this.playing = false;
		this.player_track_list.style.left = "0";
		this.current_track = this.old_current = 0;
		
		/* Borro el contenido de la playlist */
		
		while (this.player_track_list.firstChild) {
			this.player_track_list.removeChild(this.player_track_list.firstChild);
		}
		
		/* Construyo playlist */
		
		for(var i=0;i<this.tracks.length;i++){
			this.addTrack(this.player_track_list,i);
		}
		
		/* Asigno ID diferentes a cada box para luego comparar aunque hayan temas iguales */
		this.setCorrectId();
		
		/* Pido un nuevo track */

		this.getNewTrack(this.current_track,false);
		
		/* Marcar volumen predeterminado */
		
		this.player_front_volume.style.width = this.getVolumeWidth(this.general_volume) + "px";
		
		this.player_dial_volume.style.left = getOffset(this.player_back_volume).x + getSize(this.player_front_volume).w - getSize(this.player_dial_volume).w / 2 + "px";
		this.player_dial_track.style.left = getOffset(this.player_front_track).x + getSize(this.player_front_track).w + "px";
		
		/* Flecha para desplegar y ocultar playlist */
		
		this.player_track_list_arrows.onclick = function(){
			if(root.closed){
				root.closed = false;
				this.className = '';
				root.player_container.style.display = root.player_track_back.style.display = "block";
				if(root.tracks.length < 1) root.player_track_list.style.width = "0";
				if(getSize(root.player_container).w < getSize(root.player_track_list).w){
					root.container_scroll.style.display = "block";
				}
				if(root.player_track_list.childNodes.length > 0){
					root.setWidthPlaylist(root.player_track_list.childNodes[0]);
				}
			}else{
				root.closed = true;
				this.className = 'switch';
				root.player_container.style.display = root.player_track_back.style.display = root.container_scroll.style.display = "none";
			}
			return false;
		}
		
		/* Muestro las flechas indicadas para mover la playlist */
		
		this.player_init.className = 'switch';
		this.player_track_replay.className = 'switch';
		this.player_track_replay.getElementsByTagName("a")[0].className = 'switch';
		this.player_track_replay.getElementsByTagName("a")[1].className = 'switch';
		
		this.player_play.style.display = "block";
		
		/* Reproducción de un track (Botón Play) */
		this.player_play.onclick = function(){ 
			if(root.tracks.length > 0){
				root.player_play_f(); return false; 
			}
		}
		this.player_init.style.display = this.player_end.style.display = "block";
		
		if(this.tracks.length > 1){
		
			/* Llevar track al inicio */
	
			this.player_init.onclick = function(){ 
				if(root.tracks.length > 1){
					root.player_init_f(); 
					return false;
				}
			}
			
			/* Llevar track al final */
			
			this.player_end.onclick = function(){
				if(root.tracks.length > 1){ 
					root.player_end_f(); 
					return false; 
				}
			}
		
		}
		
		
		if(this.tracks.length > 2){
		
			/* Random */
			
			this.player_track_replay.getElementsByTagName("a")[0].onclick = function(){
				if(root.tracks.length > 2){
					if(root.status_random){
						root.getRandom(false);
					}else{
						if(root.tracks.length > 1){
							root.getRandom(true);
						}
					}
					root.setArrowsTrack(root.current_track);
				}
				return false;
			}
			
		}
		
		/* Replay playlist */
		
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
			}
			return false;
		}
		
		/* Mute volumen */
		
		this.player_speaker.onclick = function(){
			if(root.tracks.length > 0){
				if(root.track.volume == 0){
					this.className = '';
					root.track.volume = root.general_volume;
					root.current_volume = root.general_volume;
					root.player_front_volume.style.width = root.getVolumeWidth(root.current_volume) + "px";
					root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + root.getVolumeWidth(root.current_volume) - getSize(root.player_dial_volume).w + "px";
				}else{
					this.className = 'switch';
					root.track.volume = root.current_volume = 0;
					root.player_front_volume.style.width = "0px";
					root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + "px";
				}
				if(root.flash){ root.fplayer.setVolume(root.track.volume); }
			}
			return false;
		}
		
		this.player_back_volume.onmousedown = this.player_front_volume.onmousedown = function(e){
			e = e || window.event;
			if(root.tracks.length > 0){
				root.mousePos = mouseCoords(e);
				if(root.mousePos.x - getSize(root.player_dial_volume).w / 2 >= getOffset(root.player_back_volume).x && root.mousePos.x <= getOffset(root.player_back_volume).x + getSize(root.player_back_volume).w - getSize(root.player_dial_volume).w / 2){
					root.player_dial_volume.style.left = root.mousePos.x - getSize(root.player_dial_volume).w / 2 + "px";
					root.player_front_volume.style.width = root.mousePos.x - getOffset(root.player_back_volume).x + "px";
					root.track.volume = root.getVolume(root.mousePos.x - getOffset(root.player_back_volume).x,getSize(root.player_back_volume).w);
					root.current_volume = root.general_volume = root.track.volume;
					root.player_speaker.className = '';
					/* for flash */
					if(root.flash){
						root.track.volume = root.fplayer.setVolume(root.current_volume);
					}
					/* --------- */
				}else if(root.mousePos.x - getSize(root.player_dial_volume).w / 2 < getOffset(root.player_back_volume).x){
					root.player_speaker.className = 'switch';
					root.track.volume = 0;
					root.current_volume = root.general_volume = root.track.volume;
					/* for flash */
					if(root.flash){
						root.fplayer.setVolume(root.track.volume);
					}
					/* --------- */
					root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + "px";
				}
				root.mouseUp();
			}
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
						root.current_volume = root.general_volume = root.track.volume;
						root.player_speaker.className = '';
						/* for flash */
						if(root.flash){
							root.track.volume = root.fplayer.setVolume(root.current_volume);
						}
						/* --------- */
					}else if(root.mousePos.x - getSize(root.player_dial_volume).w / 2 < getOffset(root.player_back_volume).x){
						root.player_speaker.className = 'switch';
						root.track.volume = 0;
						root.current_volume = root.general_volume = root.track.volume;
						/* for flash */
						if(root.flash){
							root.fplayer.setVolume(root.track.volume);
						}
						/* --------- */
						root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + "px";
					}
				}
				root.mouseUp();
			}
			return false;
		}
		
		this.player_loader_track.onmousedown = this.player_front_track.onmousedown = function(e){
			e = e || window.event;
			if(root.tracks.length > 0){
				root.mousePos = mouseCoords(e);
				if(root.playing){
					if(root.mousePos.x - getSize(root.player_dial_track).w / 2 >= getOffset(root.player_back_track).x && root.mousePos.x <= getOffset(root.player_back_track).x + getSize(root.player_back_track).w - getSize(root.player_dial_track).w / 2){
						root.player_dial_track.style.left = root.mousePos.x - getSize(root.player_dial_track).w / 2 + "px";
						root.player_front_track.style.width = root.mousePos.x - getOffset(root.player_back_track).x + "px";
						root.track.currentTime = root.getDialUp(root.mousePos.x - getOffset(root.player_back_track).x,getSize(root.player_back_track).w);
						/* For flash */
						if(root.flash){
							if(root.track.duration > 0){
								root.track.currentTime = root.fplayer.setCurrentTime(root.track.currentTime);
							}
							root.fplayer.setVolume(root.current_volume);
						}
						/* --------- */
					}else if(root.mousePos.x - getSize(root.player_dial_track).w / 2 < getOffset(root.player_back_track).x){
						root.track.currentTime = 0;
						root.player_dial_track.style.left = getOffset(root.player_back_track).x + "px";
						/* For flash */
						if(root.flash){ 
							root.fplayer.setCurrentTime(root.track.currentTime);
						}
						/* --------- */
					}
				}
				root.mouseUp();
			}
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
							/* For flash */
							if(root.flash){
								root.track.currentTime = root.fplayer.setCurrentTime(root.track.currentTime);
								root.fplayer.setVolume(root.current_volume);
							}
							/* --------- */
						}else if(root.mousePos.x - getSize(root.player_dial_track).w / 2 < getOffset(root.player_back_track).x){
							root.track.currentTime = 0;
							root.player_dial_track.style.left = getOffset(root.player_back_track).x + "px";
							/* For flash */
							if(root.flash){
								root.fplayer.setCurrentTime(root.track.currentTime);
							}
							/* --------- */
						}
					}
				}
				root.mouseUp();
			}
			return false;
		}
		
		/* Resize windows */
		
		window.onresize = function(){
			
			var pos_dial = 0;
	
			/* Scrollbar */
			
			if(root.tracks.length > 0){
				root.track_w = getSize(root.player_track_list.getElementsByTagName("div")[0]).w;
				root.playlist_w = (root.track_w + root.margin_box) * root.tracks.length + root.margin_box;
				root.scrollbar_w = getSize(root.player_container).w * (getSize(root.player_container).w / root.playlist_w);
				
				if(getSize(root.player_container).w < root.playlist_w){
					root.setEventScroll();
				}else{
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
			
			/* --------- */
			
			
			
			root.player_front_track.style.width = pos_dial + getSize(root.player_dial_track).w + "px";
			
			root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + getSize(root.player_front_volume).w - getSize(root.player_dial_volume).w / 2 + "px";
			root.player_dial_track.style.left = getOffset(root.player_front_track).x + getSize(root.player_front_track).w + "px";
			root.player_track_list.style.width = root.playlist_w;
			
			root.player_loader_track.style.width = "0";
			root.reSetPlaylist();
		}
		
		/* Key detecting */
		
		document.onkeydown = function(e){
			if(keypress(e) == 32){
				root.player_play_f();
			}else if(keypress(e) == 37){
				root.player_init_f();
			}else if(keypress(e) == 38){
				root.turnVolume(5);
			}else if(keypress(e) == 39){
				root.player_end_f();
			}else if(keypress(e) == 40){
				root.turnVolume(-5);
			}
		}
		
		/* Site´s tracks */
		
		this.dragtracks = new dragAndDropTracks();
		
	}
	
	
	this.getNewTrack = function(track,play){
		play = play || false;
		root.next = play;
		this.current_track = track;
		if(this.current_track < this.tracks.length){
			
			if(root.track){
				if(!root.flash){
					root.track.pause();
					root.track.removeEventListener("progress", root.progressTrack);
					root.track.removeEventListener("ended", root.finishTrack);
					root.track.removeEventListener("loadeddata", root.loadedTrack);
					//root.track.removeEventListener("canplaythrough", root.startTrack);
				}
				root.player_loader_track.style.width = "0";
				if(root.flash){
					root.track = new Object();
				}else{
					root.track = new Audio();
				}
				
			}
			
			function startNext(){
				
				/* Flash */
				if(root.flash){
					
					/* I create the audio object in Flash and the onProgress function */
					root.statusplay = false;
					root.track = new Object();
					root.track.duration = 0;
					root.track.src = root.tracks[root.current_track - 1].audio + ".mp3";
					
					root.track.pause = function(){
						root.fplayer.getPlay(false);
					}
					root.track.play = function(){
						root.fplayer.getPlay(true);
					}
					
					root.fplayer.getTrack(root.track.src,play);
					
					root.timerFlash = setTimeout(root.updateFlash,1000);
					
				}else{
				/* Javascript */
					root.track = new Audio(root.tracks[root.current_track - 1].audio + ".ogg",root.tracks[root.current_track - 1].audio + ".mp3");
					if(root.track.canPlayType('audio/mpeg')) {
						root.track.type= 'audio/mpeg';
						root.track.src = root.tracks[root.current_track - 1].audio + ".mp3";
					} else {
						root.track.type = 'audio/ogg';
						root.track.src = root.tracks[root.current_track - 1].audio + ".ogg";
					}
					
					root.track.addEventListener("progress", root.progressTrack);
					root.track.addEventListener("ended", root.finishTrack);
					root.track.addEventListener("loadeddata", root.loadedTrack);
					document.getElementsByTagName("title")[0].innerHTML = root.tracks[root.current_track - 1].name;
					if(root.next){
						//root.track.addEventListener("canplaythrough", root.startTrack);
						//document.getElementsByTagName("title")[0].innerHTML = root.tracks[root.current_track - 1].name;
					}
					
				}
				
				/* ----- */
				
				root.player_dial_track.style.left = getOffset(root.player_back_track).x + "px";
				root.player_front_track.style.width = "0";
				root.player_track_name.innerHTML = root.tracks[root.current_track - 1].name
				root.player_cover.src = root.tracks[root.current_track - 1].cover + "?clear=true";
				
				if(play){
					root.playing = true;
					root.player_play.className = 'switch';
					if(root.timer){
						clearTimeout(root.timer);
					}
					root.timer = setTimeout(root.showTime,1000);
				}

			}
			
			if(root.timerNext)	clearTimeout(root.timerNext);
			root.timerNext = setTimeout(startNext,500);
			
			this.setSelected(this.tracks[this.current_track].id);
			this.current_track++;
			
		}else{
			this.current_track = 0;
			if(this.status_replay){
				this.getNewTrack(this.current_track,true);
			}else{
				this.getNewTrack(this.current_track,false);
			}
			this.setArrowsTrack(0);
		}

	}
	
	this.progressTrack = function(){
		root.statusLoading = true;
		if(root.flash){
			root.player_loader_track.style.width = (getSize(root.player_back_track).w * root.fplayer.getLoaded()) / 100 + "px";
		}else{
			try{
				root.player_loader_track.style.width = (getSize(root.player_back_track).w * this.buffered.end(0)) / this.duration + "px";
				if(this.buffered.end(0) && root.next){
					root.track.play();
					root.next = false;
				}
			}catch(e){
				//console.log("Error de datos");
			}
		}
	}
	
	this.finishTrack = function(e){
		root.playing = false;
		root.track.currentTime = 0;
		root.player_play.className = "";
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
	}
	
	this.loadedTrack = function(e){
		root.player_track_time.innerHTML = formatTime(root.track.duration);
		root.player_time.innerHTML = formatTime(root.track.currentTime);
		root.track.volume = root.current_volume;
	}
	
	this.updateFlash = function(){
		root.track.currentTime = root.fplayer.getCurrentTime() / 1000;
		root.track.duration = root.fplayer.getDuration() / 1000;
		root.track.volume = root.fplayer.getVolume();
		if(root.track.duration <= 0){
			root.timerFlash = setTimeout(root.updateFlash,100);
			root.player_track_time.innerHTML = "";
		}else{
			clearTimeout(root.timerFlash);
			root.player_track_time.innerHTML = formatTime(root.track.duration);
			root.player_time.innerHTML = formatTime(root.track.currentTime);
			root.statusplay = true;
		}
	}
	
	this.showTime = function(){
		var pos_dial = 0;
		if(root.flash){
			root.track.currentTime = root.fplayer.getCurrentTime() / 1000;
		}
		root.player_time.innerHTML = formatTime(root.track.currentTime);
		if(root.track.duration > 0){
			pos_dial = (getSize(root.player_back_track).w * root.track.currentTime) / root.track.duration;
		}
		if(getOffset(root.player_dial_track).x < getOffset(root.player_back_track).x + getSize(root.player_back_track).w - getSize(root.player_dial_track).w){
			root.player_dial_track.style.left = getOffset(root.player_back_track).x + pos_dial + "px";
			root.player_front_track.style.width = pos_dial + getSize(root.player_dial_track).w + "px";
		}else{
			root.player_dial_track.style.left = getOffset(root.player_back_track).x + getSize(root.player_back_track).w - getSize(root.player_dial_track).w;
			root.player_front_track.style.width = getSize(root.player_back_track).w + "px";
		}
		
		if(root.flash){
			if(Math.round(root.track.currentTime) >= Math.round(root.track.duration) && root.track.duration != 0){
				root.finishTrack();
			}
		}
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
			
			/* Drag and drop */
	
			function activeBox(){
				root.statusLoading = true;
			}
	
			if(root.current_block){
				if(root.current_track_drag.num != null){
					interval = setTimeout(activeBox,500);
					if(root.current_block.type == "multiply"){
						root.insertMultiplyTracks();
					}else{
						root.insertTrack(root.current_block,root.current_track_drag.num);
					}
				}else{
					if(root.empty){
						root.insertMultiplyTracks();
					}
				}
				if(root.current_block.type == "multiply"){
					var parent = root.current_block.parentNode;
					parent.removeChild(root.current_block);
					root.tracksTemporary = null;
				}
			}
			/* Elimino el paquete */
			root.current_block = root.elementDrag = null;
			
			/* Scrollbar */
			root.status_scrollbar = true;
			/* ------ */
			
			document.onmousemove = null;
			return false;
		}
	}
	
	
	this.insertMultiplyTracks = function(){
		for(var i=root.current_block.childNodes.length - 1;i>=0;i--){
			this.current_block.childNodes[i].setAttribute('style','');
			this.tracksTemporary = this.tracksExternal[i];
			this.insertTrack(this.current_block.childNodes[i],this.current_track_drag.num,true);
		}
		if(this.empty) this.activePlayer();
		this.empty = false;
		this.dragtracks.resetList();
	}
	
	
	/* Mouse Wheel */
		
	/*if(document.addEventListener){
		document.addEventListener("mousewheel", mouseScroll, false);
		document.addEventListener("DOMMouseScroll", mouseScroll, false);
	}else{
		if(document.attachEvent){
			document.attachEvent("onmousewheel", mouseScroll);
		}
	}
	
	function mouseScroll(event) {
		var direction = 0;
		if('wheelDelta' in event){
			direction = event.wheelDelta;
		}else{
			direction = event.detail;
		}
		if(direction == 1 || direction == 120){
			root.player_end_f();
		}else if(direction == -1 || direction == -120){
			root.player_init_f();
		}
	}*/
	

	/* ############################################ PLAYLIST ############################################ */
	
	
	this.getPositionElement = function(parent,child){
		for(var i=0;i<parent.childNodes.length;i++){
			if(child.id == parent.childNodes[i].id){
				return i;
				break;
			}
		}
	}
	
	this.removeTrack = function(block,btclose){
		btclose || ( btclose = false );
		var parent = block.parentNode;
		var nodeSelected = block.className.search("player_selected_track");
		var position = root.getPositionElement(parent,block);
		
		for(var k=0;k<root.tracks.length;k++){
			if(root.tracks[k].id == block.id){
				root.tracksTemporary = root.tracks[k];
				root.tracks.splice(k,1);
			}
		}
		
		for(var i=0;i<root.tracks_backup.length;i++){
			if(root.tracks_backup[i].id == block.id){
				root.tracks_backupTemporary = root.tracks_backup[i];
				root.tracks_backup.splice(i,1);
			}
		}
		
		function fade(){
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
						}else{
							root.resetPlayer();
						}
					}else if(position < root.current_track - 1){
						root.current_track = root.current_track - 1;
					}
				}
			}else{
				root.resetPlayer();
			}
			
			if(root.tracks.length < 2){
				root.player_track_replay.getElementsByTagName("a")[0].className = 'switch';
				root.player_init.className = root.player_end.className = 'switch';
			}else if(root.tracks.length < 3){
				root.player_track_replay.getElementsByTagName("a")[0].className = "switch";
			}else{
				if(root.status_random){ 
					root.getRandom(true);
				}
			}
		}
		
		if(btclose){
			fadeElement(block,100,0,false,function(){
				fade();
				root.reSetPlaylist();
			});
		}else{
			fade();
		}
		
		/* ###################### Provisorio ##################### */
		//root.showArray();
		/* ###################################################### */
		
	}
	
	
	this.moveExternalBox = function(ev,posinit){
		ev = ev || window.event;
		root.mousePos = mouseCoords(ev);
		root.statusLoading = false;
		
		var selected = false;
		
		if(root.elementDrag.status){
			root.elementDrag.id = "";
			root.player.appendChild(root.elementDrag);
			
			root.current_block = root.elementDrag;
		}
		
		var arrayBlocks = root.player_track_list.childNodes;
		
		if(root.current_block){
			
			root.current_block.style.top = (mouseCoords(ev).y - (getSize(root.current_block).h / 2)) + "px";
			root.current_block.style.left = (mouseCoords(ev).x - (getSize(root.current_block).w / 2)) + "px";
			
			for(var i=0;i<arrayBlocks.length;i++){
				if(detectCollision(arrayBlocks[i],root.current_block,getOffset(root.player_track_list).x,60)){
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
			
			if(detectCollision(root.player_container,root.current_block)){
				if(this.tracks.length < 1){
					this.current_track_drag.num = null;
					this.empty = true;
				}else{
					if(compareXCoords(root.mousePos.x,arrayBlocks[arrayBlocks.length - 1],getOffset(root.player_track_list).x)){
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
				this.player_track_list.style.width = this.playlist_w + "px";
				this.current_track_drag.num = null;
			}
			
			if(this.mousePos.x < this.track_w){
				this.moveScroll(false,20);
			}else if(this.mousePos.x > getSize(this.player_container).w - this.track_w){
				this.moveScroll(true,20);
			}
			
			if(root.elementDrag.status){
				root.current_block.status = root.elementDrag.status = false;
			}
		}
	}
	
	
	this.moveBox = function(ev,posinit){
		ev = ev || window.event;
		root.mousePos = mouseCoords(ev);
		root.statusLoading = false;
		
		var selected = false;
		
		if(root.elementDrag.status){
			root.removeTrack(root.elementDrag);
			root.elementDrag.id = "";
			root.player.appendChild(root.elementDrag);
			
			root.current_block = root.elementDrag;
			if(root.current_block.className.indexOf("player_selected_track") > -1){
				selected = true;
				root.current_block.className = "player_box_track player_selected_track display_none";
			}else{
				root.current_block.className = "player_box_track display_none";
			}
			root.current_block.num = root.current_track_drag.num = Number(root.elementDrag.num);
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
			
			for(var i=0;i<arrayBlocks.length;i++){
				if(detectCollision(arrayBlocks[i],root.current_block,getOffset(root.player_track_list).x,60)){
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
			
			if(detectCollision(root.player_container,root.current_block)){
				
				if(compareXCoords(root.mousePos.x,arrayBlocks[arrayBlocks.length - 1],getOffset(root.player_track_list).x)){
					root.current_track_drag.num = arrayBlocks.length;
					if(arrayBlocks[arrayBlocks.length - 1].className.indexOf("player_selected_track") > -1 && !selected){
						arrayBlocks[arrayBlocks.length - 1].className = "player_box_track player_selected_track border_right";
					}else{
						arrayBlocks[arrayBlocks.length - 1].className = "player_box_track border_right";
					}
				}
			}
			
			if(this.mousePos.x < this.track_w){
				this.moveScroll(false,20);
			}else if(this.mousePos.x > getSize(this.player_container).w - this.track_w){
				this.moveScroll(true,20);
			}
			
			if(root.elementDrag.status){
				root.current_block.status = root.elementDrag.status = false;
			}
		}
	}
	
	
	this.addTrack = function(container,pos){
		
		var box = document.createElement("div");
		
		/* Drag and drop */
		
		box.name = root.tracks[pos].name;
		box.id = root.tracks[pos].id;
		box.album = root.tracks[pos].album;
		box.artist = root.tracks[pos].artist;
		box.audio = root.tracks[pos].audio;
		box.cover = root.tracks[pos].cover;
		
		box.status = false;
		box.className = "player_box_track";
		box.onmousedown = function(e){
			if(root.tracks.length > 1){
				e = e || window.event;
				this.status = true;
				root.elementDrag = this;
				var posinit = mouseCoords(e).x - getOffset(root.scrollbar).x;
				document.onmousemove = function(ev){ root.moveBox(ev,posinit) };
			}
			root.mouseUp();
			return false;
		}
		
		/* ------------- */
		
		var box_link = document.createElement("a");
		box_link.setAttribute('href',root.tracks[pos].audio + ".mp3");
		box_link.onclick = function(){
			if(!this.disabled){
				var statusrand = false;
				if(root.statusLoading){
					root.player_init.className = "";
					root.player_end.className = "";
					if(root.status_random){
						statusrand = true;
						root.getRandom(false);
					}
					for(var i=0;i<root.tracks.length;i++){
						if(this.parentNode.id == root.tracks[i].id){
							root.getNewTrack(i,true);
							if(i >= root.tracks.length - 1 && root.status_replay == false){
								root.player_end.className = 'switch';
							}else if(i < 1){
								root.player_init.className = 'switch';
							}
						}
					}
					
					if(!root.status_random && statusrand){
						root.getRandom(true);
					}
					if(root.status_random){
						root.player_init.className = 'switch';
						root.player_end.className = '';
					}
				}
				//root.showArray();
			}
			return false;
		}
		
		box.appendChild(box_link);
		
		var bt_close = document.createElement("div");
		bt_close.className = "bt_close";
		bt_close.onclick = function(event){
			event = event || window.event;
			if(!this.status){
			    if (event.stopPropagation) {
					event.stopPropagation();
			    }else{
					// IE variant
					event.cancelBubble = true
				}
				var block = this.parentNode.parentNode;
				
				//Elimino el track cerrado (también de los array, principal y respaldo)
				root.removeTrack(block,true);
				box_link.disabled = true;
			}
			this.status = true;
			return false;
		}
		
		box_link.appendChild(bt_close);
		
			var box_img = document.createElement("img");
			box_img.setAttribute('src',root.tracks[pos].cover);
			box_img.setAttribute('alt',root.tracks[pos].name);
			box_link.appendChild(box_img);
			
			var box_p = document.createElement("p");
			box_link.appendChild(box_p);
			
			var box_span = document.createElement("span");
			box_p.appendChild(box_span);
				var content_name = "";
				if(root.tracks[pos].name.length > 15){
					content_name+= root.tracks[pos].name.slice(0,13) + "...";
				}else{
					content_name+= root.tracks[pos].name;
				}
				var box_text = document.createTextNode(content_name);
				box_span.appendChild(box_text);
			
			var content_artist = "";
			if(root.tracks[pos].artist.length > 15){
				content_artist+= root.tracks[pos].artist.slice(0,13) + "...";
			}else{
				content_artist+= root.tracks[pos].artist;
			}
			var box_text_artist = document.createTextNode(content_artist);
			box_p.appendChild(box_text_artist);
			
		container.appendChild(box);
		
		this.setWidthPlaylist(box);
		
	}
	
	
	this.setWidthPlaylist = function(box){
		this.track_w = getSize(box).w;
		this.playlist_w = (this.track_w + this.margin_box) * this.tracks.length + this.margin_box;
		this.player_track_list.style.width = this.playlist_w + "px";
		if(getSize(this.player_track_list).w < getSize(this.player_container).w){
			this.container_scroll.style.display = "none";
		}else{
			this.setEventScroll();
		}
	}
	
	
	/* Create Array with externals track boxes */
	
	this.createExternalTracks = function(e,master){
	
		this.tracksExternal = master;
		root.elementDrag = document.createElement("div");
		root.elementDrag.status = true;
	
		for(var i=0;i<master.length;i++){
			var box = document.createElement("div");
			
			box.name = master[i].name;
			box.id = master[i].id;
			box.album = master[i].album;
			box.artist = master[i].artist;
			box.audio = master[i].audio;
			box.cover = master[i].cover;
			
			box.status = false;
			box.className = "player_box_track";
			box.onmousedown = function(e){
				if(root.tracks.length > 1){
					e = e || window.event;
					this.status = true;
					root.many = false;
					root.elementDrag = this;
					var posinit = mouseCoords(e).x - getOffset(root.scrollbar).x;
					document.onmousemove = function(ev){ root.moveBox(ev,posinit) };
				}
				root.mouseUp();
				return false;
			}
			

			var box_link = document.createElement("a");
			box_link.setAttribute('href',master[i].audio + ".mp3");
			box_link.onclick = function(){
				if(!this.disabled){
					var statusrand = false;
					if(root.statusLoading){
						root.player_init.className = "";
						root.player_end.className = "";
						if(root.status_random){
							statusrand = true;
							root.getRandom(false);
						}
						console.log(this.parentNode.id +" - "+ root.tracks[0].id);
						for(var i=0;i<root.tracks.length;i++){
							if(this.parentNode.id == root.tracks[i].id){
								root.getNewTrack(i,true);
								if(i >= root.tracks.length - 1 && root.status_replay == false){
									root.player_end.className = 'switch';
								}else if(i < 1){
									root.player_init.className = 'switch';
								}
							}
						}
						
						if(!root.status_random && statusrand){
							root.getRandom(true);
						}
						if(root.status_random){
							root.player_init.className = 'switch';
							root.player_end.className = '';
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
				if(!this.status){
				    if (event.stopPropagation) {
						event.stopPropagation();
				    }else{
	
						event.cancelBubble = true
					}
					var block = this.parentNode.parentNode;
					
					root.removeTrack(block,true);
					box_link.disabled = true;
				}
				this.status = true;
				return false;
			}
			
			box_link.appendChild(bt_close);
		
				var box_img = document.createElement("img");
				box_img.setAttribute('src',master[i].cover);
				box_img.setAttribute('alt',master[i].name);
				box_link.appendChild(box_img);
				
				var box_p = document.createElement("p");
				box_link.appendChild(box_p);
				
				var box_span = document.createElement("span");
				box_p.appendChild(box_span);
				
					var box_text = document.createTextNode(master[i].name.slice(0,15));
					box_span.appendChild(box_text);
					
				var box_text_artist = document.createTextNode(master[i].artist.slice(0,15));
				box_p.appendChild(box_text_artist);
			
			box.style.position = "absolute";
			box.style.marginLeft = box.style.marginTop = (5 * i) + "px";
			box.style.marginLeft = box.style.marginLeft = (3 * i) + "px";
			root.elementDrag.appendChild(box);
		}
		
		root.elementDrag.type = "multiply";
		root.elementDrag.status = true;
		root.elementDrag.className = "container_multiply";
		
		var posinit = mouseCoords(e).x - getOffset(root.scrollbar).x;
		document.onmousemove = function(ev){ root.moveExternalBox(ev,posinit) };
		root.mouseUp();
	}
	
	
	/* Set ID for compare in playlist */
	
	this.setCorrectId = function(){
		var elements = this.player_track_list.childNodes;
		var selected = 0;
		//alert(elements.length);
		for(var i=0;i<elements.length;i++){
			//elements[i].className = "player_box_track";
			elements[i].setAttribute('id',i);
			elements[i].num = i;
			root.tracks[i].id = i;
			root.tracks[i].name = elements[i].name;
			root.tracks[i].album = elements[i].album;
			root.tracks[i].artist = elements[i].artist;
			root.tracks[i].audio = elements[i].audio;
			root.tracks[i].cover = elements[i].cover;
		}
		root.tracks_backup = root.tracks.slice();
	}
	
	
	/* Move scroll to playlist */
	
	this.moveScrolltoPlaylist = function(){
		var spaceplaylist = getSize(this.player_track_list).w - getSize(this.player_container).w;
		var spacebar = getSize(root.container_scroll).w - getSize(root.scrollbar).w;
		var multiplier = spacebar / spaceplaylist;

		var position = Math.round(getOffset(root.player_track_list).x * multiplier * -1);
		this.scrollbar.style.left =  position + "px";
	}
	
	/* Move playlist since scroll */
	
	this.movePlaylist = function(){
		var spaceplaylist = getSize(this.player_track_list).w - getSize(this.player_container).w;
		var spacebar = getSize(root.container_scroll).w - getSize(root.scrollbar).w;
		var multiplier = spaceplaylist / spacebar;

		var position = Math.round(getOffset(root.scrollbar).x * multiplier * -1);
		this.player_track_list.style.left =  position + "px";
	}
	
	
	/* Move scroll */
	
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
	
	/* Active scroll events */

	this.setEventScroll = function(){
		
		this.track_w = getSize(this.player_track_list.getElementsByTagName("div")[0]).w;
		this.playlist_w = (this.track_w + this.margin_box) * this.tracks.length + this.margin_box;
		this.scrollbar_w = getSize(this.player_container).w * (getSize(this.player_container).w / this.playlist_w);
		this.scrollbar.style.width =  this.scrollbar_w + "px";
		
		root.scrollbar.style.width =  this.scrollbar_w + "px";
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
						//alert("hola");
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
					scrollbar.style.left = getSize(this).w - getSize(root.scrollbar).w + "px";
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
			var trackRand = root.tracks[root.old_current];
			root.tracks.splice(root.old_current,1);
			root.tracks = shuffle(root.tracks).slice();
			root.tracks.splice(0,0,trackRand);
			root.current_track = 1;
			root.status_random = true;
			this.player_init.className = 'switch';
		}else{
			this.player_track_replay.getElementsByTagName("a")[0].className = 'switch';
			root.tracks = root.tracks_backup.slice();
			root.status_random = false;
			root.setCurrentTrack();
		}
	}
	
	
	this.player_play_f = function(){
		if(this.statusplay){
			if(this.playing){
				this.playing = false;
				this.track.pause();
				clearTimeout(this.timer);
				this.player_play.className = '';
				document.getElementById("favicon").href = "favicon.png";
			}else{
				this.playing = true;
				this.track.play();
				this.player_play.className = 'switch';
				this.timer = setTimeout(root.showTime,1000);
				this.player_track_time.innerHTML = formatTime(this.track.duration);
				document.getElementById("favicon").href = "favicon_play.png";
			}
		}
	}
	
	this.player_init_f = function(){
		if(this.statusplay){
			this.player_end.className = '';
			if(this.current_track < 3){
				this.player_init.className = 'switch';
			}
			if(this.current_track > 1){
				var num = this.current_track - 2;
				this.getNewTrack(num,true);
			}
		}
	}
	
	this.player_end_f = function(){
		if(this.statusplay){
			this.player_init.className = '';
			if(this.current_track >= this.tracks.length - 1 && !this.status_replay){
				this.player_end.className = 'switch';
			}
			if(this.current_track < this.tracks.length){
				this.getNewTrack(this.current_track,true);
			}else{
				if(this.status_replay){
					this.getNewTrack(0,true);
				}
			}
		}
	}
	
	
	this.reSetPlaylist = function(){
		//if(this.tracks.length >= 1){
		this.player_track_list.style.width = (this.track_w + this.margin_box) * this.tracks.length + this.margin_box + "px";
		//}
		console.log(this.player_track_list.style.width);
		if(getSize(this.player_track_list).w < getSize(this.player_container).w){
			this.container_scroll.style.display = "none";
			if(this.container_scroll.onmousedown) this.container_scroll.onmousedown = null;
			if(document.onmousemove) document.onmousemove = null;
		}else{
			this.setEventScroll();
		}
		
		if(getOffset(this.player_track_list).x < this.track_w * -1){
			this.player_track_list.style.left = getOffset(this.player_track_list).x + this.track_w + this.margin_box + "px";
		}else if(getOffset(this.player_track_list).x < 0 && getOffset(this.player_track_list).x > this.track_w * -1){
			this.player_track_list.style.left = "0";
		}
		
		if(getOffset(root.scrollbar).x > getOffset(root.container_scroll).x + getSize(root.container_scroll).w - getSize(root.scrollbar).w){
			root.scrollbar.style.left = getOffset(root.container_scroll).x + getSize(root.container_scroll).w - getSize(root.scrollbar).w + "px";
		}
	}
	
	
	/* General Functions (habría que hacerlo contra un ID) */
	
	this.setSelected = function(id){
		for(var i=0;i<this.player_track_list.childNodes.length;i++){
			if(this.player_track_list.childNodes[i].id == id){
				this.player_track_list.childNodes[i].getElementsByTagName("a")[0].disabled = true;
				this.player_track_list.childNodes[i].className = 'player_box_track player_selected_track';
				this.old_current = i;
				/* Move new position */
				function finishMove(){ 
					root.statusplay = true;
					root.moveScrolltoPlaylist();
				}
				var position = getOffset(this.player_track_list.childNodes[i]).x + getOffset(this.player_track_list).x;
				var posPlaylist = 0;
				
				if(position < 0){
					this.statusplay = false;
					posPlaylist = getOffset(this.player_track_list).x - position;
					easingElement(this.player_track_list,getOffset(this.player_track_list).x,posPlaylist,finishMove);
				}else if(position > getSize(this.player_container).w - this.track_w){
					this.statusplay = false;
					posPlaylist = getOffset(this.player_track_list).x + (getSize(this.player_container).w - (position + this.track_w));
					easingElement(this.player_track_list,getOffset(this.player_track_list).x,posPlaylist,finishMove);
				}
			}else{
				this.player_track_list.childNodes[i].getElementsByTagName("a")[0].disabled = false;
				this.player_track_list.childNodes[i].className = 'player_box_track';
			}
		}
	}
	
	/* Drag and drop */

	this.insertTrack = function(element,position,many){
		position = position || 0;
		many = many || false;
		document.getElementsByTagName("body")[0].style.overflow = "auto";
		var statusrand = false;
		if(root.status_random){
			statusrand = true;
			root.getRandom(false);
		}
		var arrayBlocks = root.player_track_list.childNodes;
		if(arrayBlocks.length > 0){
			if(compareXCoords(root.mousePos.x,arrayBlocks[arrayBlocks.length - 1],getOffset(root.player_track_list).x) || root.many || position >= arrayBlocks.length){
				root.many = many;
				
				if(!root.many){
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
				//root.tracksTemporary.id = arrayBlocks.length - 1;
				
				root.tracks.splice(arrayBlocks.length - 1,0,root.tracksTemporary);
				root.tracks_backup.splice(arrayBlocks.length - 1,0,root.tracksTemporary);
			}else{
				if(arrayBlocks[position].className.indexOf("player_selected_track") > -1){
					arrayBlocks[position].className = "player_box_track player_selected_track";
				}else{
					arrayBlocks[position].className = "player_box_track";
				}
				root.player_track_list.insertBefore(element,arrayBlocks[position]);
				//root.tracksTemporary.id = position;
				
				root.tracks.splice(position,0,root.tracksTemporary);
				root.tracks_backup.splice(position,0,root.tracksTemporary);
			}
		}else{
			this.player_track_list.appendChild(element);
			this.tracks.push(root.tracksTemporary);
			this.tracks_backup.push(root.tracksTemporary);
		}
		
		root.setCorrectId();
		
		if(root.current_block.className.indexOf("player_selected_track") > -1){
			root.current_block.className = "player_box_track player_selected_track relative_block";
		}else{
			root.current_block.className = "player_box_track relative_block";
		}
		root.current_block.setAttribute('style','');
		
		root.setCurrentTrack();
		
		if(!root.status_random && statusrand){
			root.getRandom(true);
		}
		if(root.status_random){
			root.player_init.className = 'switch';
			root.player_end.className = '';
		}
		
		if(root.tracks.length > 2){
			root.player_track_replay.getElementsByTagName("a")[0].className = "";
		}
		
		this.setWidthPlaylist(element);
		this.moveScrolltoPlaylist();

		/* ###################### Provisorio ##################### */
		//root.showArray();
		/* ###################################################### */
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
			}
		}
		this.setArrowsTrack(this.current_track);
	}
	
	
	/* ###################### Provisorio ##################### */
	
	this.showArray = function(){
		document.getElementById("array").innerHTML = document.getElementById("array_backup").innerHTML = "";
		for(var i=0;i<root.tracks.length;i++){
			if(i % 2 == 0){
				document.getElementById("array").innerHTML+= "<span>" + root.tracks[i].id + " - " + root.tracks[i].name + "</span><br />" ;
			}else{
				document.getElementById("array").innerHTML+= root.tracks[i].id + " - " + root.tracks[i].name + "<br />" ;
			}
		}
		for(var i=0;i<root.tracks_backup.length;i++){
			if(i % 2 == 0){
				document.getElementById("array_backup").innerHTML+= "<span>" + root.tracks_backup[i].id + " - " + root.tracks_backup[i].name + "</span><br />" ;
			}else{
				document.getElementById("array_backup").innerHTML+= root.tracks_backup[i].id + " - " + root.tracks_backup[i].name + "<br />" ;
			}
		}
	}
	
	/* ###################################################### */
	
}