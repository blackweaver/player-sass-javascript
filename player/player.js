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

function playerAudioVideo(e,box,xml){
	
	var root = this;
	
	/* Create Ajax object */
	
	this.ajax = nuevoAjax();
	this.ajax_method = "GET";
	
	/* Set status actual vars*/
	
	this.flash = false;
	this.current_track = 0;
	this.margin_box = 5;
	this.general_volume = this.current_volume = 0.5;
	this.mousePos = 0;
	this.status_replay = false;
	this.status_random = false;
	this.satus_arrow = true;
	this.closed = false;
	this.playing = false;
	this.timer = 0;
	this.timerFlash = 0;
	this.fplayer = null;
	this.statusLoading = false;
	
	/* Get XML data */
	
	this.xml_file = xml;
	this.tracks = this.tracks_backup = new Array();
	this.ajax.open(this.ajax_method,this.xml_file,false);
	this.ajax.send();
	this.content = this.ajax.responseXML;
	
	/* Armo la playlist parseando el XML */
	
	var arrayTracks = this.content.getElementsByTagName("track");

	for(var i=0;i<arrayTracks.length;i++){
		var audio = new Object();
		audio.name = arrayTracks[i].getAttribute("name");
		audio.album = arrayTracks[i].getAttribute("album");
		audio.artist = arrayTracks[i].getAttribute("artist");
		audio.audio = arrayTracks[i].getAttribute("audio");
		audio.cover = arrayTracks[i].getAttribute("cover");
		this.tracks.push(audio);
	}
	this.tracks_backup = this.tracks.slice();
	
	/* Player elements */
	
	this.player_track_list_arrows;
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
	this.player_container;
	this.player_arrow_left;
	this.player_arrow_right;
	this.player_track_list;
	this.player_track_back;
	this.player_box_list;
	
	/* ---------------- */
	
	this.ready = function(){}
	
	function loadBody(){
		root.ready();
		try{
			//document.createElement("canvas").getContext("2d");
			document.getElementById("no_existe").innerHTML = "hola"; //Creado provisorio hasta tanto quede todo funcinando
			document.getElementById(box).style.display = "block";
			root.setElements();
		}catch(event){
			document.getElementById(box).style.display = "block";
			document.getElementById(e.flash_content).style.display = "block";
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
	
	/* Place Flash if don´t have canvas */
	
	this.placeFlash = function(){
		var so = new SWFObject(e.flash_swf, e.flash_id, e.flash_width, e.flash_height, e.flash_player, e.flash_bg);
       so.write(e.flash_content);
	   this.fplayer = new flashPlayer();
	}
	
	/* Setting elements */
	
	this.setElements = function(){
		var root = this;
		
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
		this.player_arrow_left = document.getElementById(e.player_arrow_left);
		this.player_arrow_right = document.getElementById(e.player_arrow_right);
		this.player_track_list = document.getElementById(e.player_track_list);
		this.player_track_back = document.getElementById(e.player_track_back);
		this.player_box_list = document.getElementsByClassName(e.player_box_list);
		
		/* Construyo playlist */
		
		for(var i=0;i<this.tracks.length;i++){
			var box = document.createElement("div");
			if(i == this.current_track){
				box.className = 'player_box_track player_selected_track';
			}else{
				box.className = 'player_box_track';
			}
			
			var box_link = document.createElement("a");
			box_link.setAttribute('rel',i);
			box_link.setAttribute('href',this.tracks[i].audio + ".mp3");
			box_link.onclick = function(){
				if(root.statusLoading){
					root.player_init.style.color = root.player_end.style.color = "white";
					if(root.status_random) root.tracks = root.tracks_backup.slice();
					root.getNewTrack(Number(this.rel),true);
					if(this.rel >= root.tracks.length - 1 && this.status_replay == false){
						root.player_end.style.color = "gray";
					}else if(this.rel < 1){
						root.player_init.style.color = "gray";
					}
					
					if(root.status_random){
						root.player_track_replay.getElementsByTagName("a")[0].style.color = "gray";
						root.status_random = false;
					}
				}
				return false;
			}
			box.style.marginRight = this.margin_box + "px";
			box.appendChild(box_link);
			
				var box_img = document.createElement("img");
				box_img.setAttribute('src',this.tracks[i].cover);
				box_img.setAttribute('alt',this.tracks[i].name);
				box_link.appendChild(box_img);
				
				var box_p = document.createElement("p");
				box_link.appendChild(box_p);
				
					var box_span = document.createElement("span");
					box_p.appendChild(box_span);
					
						var box_text = document.createTextNode(this.tracks[i].name);
						box_span.appendChild(box_text);
						
					var box_text_artist = document.createTextNode(this.tracks[i].artist);
					box_p.appendChild(box_text_artist);
				
			this.player_track_list.appendChild(box);
		}
		
		/* Pido un nuevo track */

		this.getNewTrack(this.current_track,false);
		
		/* Marcar volumen predeterminado */
		
		this.track.volume = this.current_volume;
		this.player_front_volume.style.width = this.getVolumeWidth(this.general_volume) + "px";
		
		this.player_dial_volume.style.left = getOffset(this.player_back_volume).x + getSize(this.player_front_volume).w - getSize(this.player_dial_volume).w / 2 + "px";
		this.player_dial_track.style.left = getOffset(this.player_front_track).x + getSize(this.player_front_track).w + "px";
		
		/* Flecha para desplegar y ocultar playlist */
		
		this.player_track_list_arrows.onclick = function(){
			if(root.closed){
				root.closed = false;
				this.innerHTML = "K";
				root.player_container.style.display = root.player_track_back.style.display = "block";
			}else{
				root.closed = true;
				this.innerHTML = "J";
				root.player_container.style.display = root.player_track_back.style.display = "none";
			}
			return false;
		}
		
		/* Muestro las flechas indicadas para mover la playlist */
		
		//this.player_init.style.backgroundPosition = "center bottom";
		this.player_init.style.color = "gray";
		
		this.player_track_replay.getElementsByTagName("a")[0].style.color = this.player_track_replay.getElementsByTagName("a")[1].style.color = "gray";
		
		this.player_track_list.style.width = (getSize(this.player_track_list.getElementsByTagName("div")[0]).w + this.margin_box) * this.tracks.length + "px";
		this.player_arrow_left.style.display = "none";
		
		var w_playlist = getSize(this.player_track_list).w;
		var w_box = getSize(this.player_track_list.getElementsByTagName("div")[0]).w;
		var w_min = getSize(this.player_track_list).w + getOffset(root.player_track_list).x;
		
		if(getSize(this.player_track_list).w < getWidthBrowser()){
			this.player_arrow_right.style.display = "none";
		}else{
			this.player_arrow_right.style.display = "block";
		}
		
		/* Flechas para mover la playlist */
		
		this.player_arrow_left.onclick = function(){
			if(root.statusLoading){
				if(root.satus_arrow){
					
					function finishMove(){
						if(getOffset(root.player_track_list).x + w_box > 0){
							root.player_arrow_left.style.display = "none";
						}
						root.satus_arrow = true;
					}
					
					root.player_arrow_right.style.display = "block";
					w_min = getSize(root.player_track_list).w + getOffset(root.player_track_list).x;
					if(getOffset(root.player_track_list).x <= w_box * -1){
						easingElement(root.player_track_list,getOffset(root.player_track_list).x,getOffset(root.player_track_list).x + w_box,finishMove);
					}else if(getOffset(root.player_track_list).x < 0){
						var dif = w_box + getOffset(root.player_track_list).x;
						easingElement(root.player_track_list,getOffset(root.player_track_list).x,getOffset(root.player_track_list).x + dif,finishMove);
					}
					root.satus_arrow = false;
				}
			}
			return false;
		}
		
		
		this.player_arrow_right.onclick = function(){
			if(root.statusLoading){
				if(root.satus_arrow){
					
					function finishMove(){
						if(w_min - w_box <= getWidthBrowser()){
							root.player_arrow_right.style.display = "none";
						}
						root.satus_arrow = true;
					}
					
					root.player_arrow_left.style.display = "block";
					w_min = getSize(root.player_track_list).w + getOffset(root.player_track_list).x;
					if(w_min > getWidthBrowser() - w_box){
						easingElement(root.player_track_list,getOffset(root.player_track_list).x,getOffset(root.player_track_list).x - w_box,finishMove);
					}else if(w_min > getWidthBrowser()){
						var dif = w_min - getWidthBrowser();
						easingElement(root.player_track_list,getOffset(root.player_track_list).x,getOffset(root.player_track_list).x - dif,finishMove);
					}else{
						this.style.display = "none";
					}
					
					
					root.satus_arrow = false;
				}
			}
			return false;
		}
		
		/* Reproducción de un track (Botón Play) */
		this.player_play.onclick = function(){
			if(root.playing){
				root.playing = false;
				root.track.pause();
				clearTimeout(root.timer);
				//this.style.backgroundPosition = "center top";
				this.innerHTML = "D";
				document.getElementById("favicon").href = "favicon.png";
			}else{
				root.playing = true;
				root.track.play();
				//this.style.backgroundPosition = "center bottom";
				this.innerHTML = "E";
				root.timer = setTimeout(root.showTime,1000);
				root.player_track_time.innerHTML = formatTime(root.track.duration);
				document.getElementById("favicon").href = "favicon_play.png";
			}
			return false;
		}
		
		/* Llevar track al inicio */
		
		this.player_init.onclick = function(){
			root.player_end.style.color = "white";
			if(root.current_track < 3){
				this.style.color = "gray";
			}
			if(root.current_track > 1){
				var num = root.current_track - 2;
				root.getNewTrack(num,true);
			}
			return false;
		}
		
		/* Llevar track al final */
		
		this.player_end.onclick = function(){
			root.player_init.style.color = "white";
			if(root.current_track >= root.tracks.length - 1 && !root.status_replay){
				this.style.color = "gray";
			}
			if(root.current_track < root.tracks.length){
				root.getNewTrack(root.current_track,true);
			}else{
				if(root.status_replay){
					root.getNewTrack(0,true);
					if(getSize(root.player_track_list).w > getWidthBrowser()){
						root.player_arrow_left.style.display = root.player_arrow_right.style.display = "none";
						function finishMove(){
							root.player_arrow_left.style.display = "none";
							root.player_arrow_right.style.display = "block";
						}
						easingElement(root.player_track_list,getOffset(root.player_track_list).x,0,finishMove);
					}
				}
			}
			return false;
		}
		
		/* Replay playlist */
		
		this.player_track_replay.getElementsByTagName("a")[1].onclick = function(){
			if(root.status_replay){
				this.style.color = "gray";
				root.status_replay = false;
			}else{
				this.style.color = "white";
				root.player_end.style.color = "white";
				root.status_replay = true;
			}
			return false;
		}
		
		/* Random */
		
		this.player_track_replay.getElementsByTagName("a")[0].onclick = function(){
			if(root.status_random){
				this.style.color = "gray";
				root.status_random = false;
			}else{
				this.style.color = "white";
				root.tracks = shuffle(root.tracks).slice();
				root.status_random = true;
			}
			return false;
		}
		
		/* Mute volumen */
		
		this.player_speaker.onclick = function(){
			if(root.track.volume == 0){
				this.innerHTML = "H";
				root.track.volume = root.general_volume;
				root.current_volume = root.general_volume;
				root.player_front_volume.style.width = root.getVolumeWidth(root.current_volume) + "px";
				root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + root.getVolumeWidth(root.current_volume) - getSize(root.player_dial_volume).w + "px";
			}else{
				this.innerHTML = "I";
				root.track.volume = root.current_volume = 0;
				root.player_front_volume.style.width = "0px";
				root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + "px";
			}
			if(root.flash){ root.fplayer.setVolume(root.track.volume); }
			return false;
		}
		
		this.player_back_volume.onmousedown = this.player_front_volume.onmousedown = function(e){
			e = e || window.event;
			root.mousePos = mouseCoords(e);
			if(root.mousePos.x - getSize(root.player_dial_volume).w / 2 >= getOffset(root.player_back_volume).x && root.mousePos.x <= getOffset(root.player_back_volume).x + getSize(root.player_back_volume).w - getSize(root.player_dial_volume).w / 2){
				root.player_dial_volume.style.left = root.mousePos.x - getSize(root.player_dial_volume).w / 2 + "px";
				root.player_front_volume.style.width = root.mousePos.x - getOffset(root.player_back_volume).x + "px";
				root.track.volume = root.getVolume(root.mousePos.x - getOffset(root.player_back_volume).x,getSize(root.player_back_volume).w);
				root.current_volume = root.track.volume;
				root.player_speaker.innerHTML = "H";
				/* for flash */
				if(root.flash){
					root.track.volume = root.fplayer.setVolume(root.current_volume);
				}
				/* --------- */
			}else if(root.mousePos.x - getSize(root.player_dial_volume).w / 2 < getOffset(root.player_back_volume).x){
				root.player_speaker.innerHTML = "I";
				root.track.volume = 0;
				/* for flash */
				if(root.flash){
					root.fplayer.setVolume(root.track.volume);
				}
				/* --------- */
				root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + "px";
			}
			return false;
		}
		
		this.player_dial_volume.onmousedown = function(e){
			e = e || window.event;
			root.player_speaker.innerHTML = "H";
			document.onmousemove = function(e){
				e = e || window.event;
				root.mousePos = mouseCoords(e);
				if(root.mousePos.x - getSize(root.player_dial_volume).w / 2 >= getOffset(root.player_back_volume).x && root.mousePos.x <= getOffset(root.player_back_volume).x + getSize(root.player_back_volume).w - getSize(root.player_dial_volume).w / 2){
					root.player_dial_volume.style.left = root.mousePos.x - getSize(root.player_dial_volume).w / 2 + "px";
					root.player_front_volume.style.width = root.mousePos.x - getOffset(root.player_back_volume).x + "px";
					root.track.volume = root.getVolume(root.mousePos.x - getOffset(root.player_back_volume).x,getSize(root.player_back_volume).w);
					root.current_volume = root.track.volume;
					root.player_speaker.innerHTML = "H";
					/* for flash */
					if(root.flash){
						root.track.volume = root.fplayer.setVolume(root.current_volume);
					}
					/* --------- */
				}else if(root.mousePos.x - getSize(root.player_dial_volume).w / 2 < getOffset(root.player_back_volume).x){
					root.player_speaker.innerHTML = "I";
					root.track.volume = 0;
					/* for flash */
					if(root.flash){
						root.fplayer.setVolume(root.track.volume);
					}
					/* --------- */
					root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + "px";
				}
			}
			return false;
		}
		
		this.player_loader_track.onmousedown = this.player_front_track.onmousedown = function(e){
			e = e || window.event;
			root.mousePos = mouseCoords(e);
			if(root.playing){
				if(root.mousePos.x - getSize(root.player_dial_track).w / 2 >= getOffset(root.player_back_track).x && root.mousePos.x <= getOffset(root.player_back_track).x + getSize(root.player_back_track).w - getSize(root.player_dial_track).w / 2){
					root.player_dial_track.style.left = root.mousePos.x - getSize(root.player_dial_track).w / 2 + "px";
					root.player_front_track.style.width = root.mousePos.x - getOffset(root.player_back_track).x + "px";
					root.track.currentTime = root.getDialUp(root.mousePos.x - getOffset(root.player_back_track).x,getSize(root.player_back_track).w);
					/* For flash */
					if(root.flash){
						root.track.currentTime = root.fplayer.setCurrentTime(root.track.currentTime);
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
			return false;
		}
		
		this.player_dial_track.onmousedown = function(e){
			root.track.pause();
			this.title = true; 
			e = e || window.event;
			document.onmousemove = function(e){
				e = e || window.event;
				root.mousePos = mouseCoords(e);
				if(root.playing){
					if(root.mousePos.x - getSize(root.player_dial_track).w / 2 >= getOffset(root.player_back_track).x && root.mousePos.x <= getOffset(root.player_back_track).x + getSize(root.player_back_track).w - getSize(root.player_dial_track).w / 2){
						root.player_dial_track.style.left = root.mousePos.x - getSize(root.player_dial_track).w / 2 + "px";
						root.player_front_track.style.width = root.mousePos.x - getOffset(root.player_back_track).x + "px";
						root.track.currentTime = root.getDialUp(root.mousePos.x - getOffset(root.player_back_track).x,getSize(root.player_back_track).w);
						/* For flash */
						if(root.flash){
							root.track.currentTime = root.fplayer.setCurrentTime(root.track.currentTime);
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
			return false;
		}
		
		window.onresize = function(){
			root.player_dial_volume.style.left = getOffset(root.player_back_volume).x + getSize(root.player_front_volume).w - getSize(root.player_dial_volume).w / 2 + "px";
			root.player_dial_track.style.left = getOffset(root.player_front_track).x + getSize(root.player_front_track).w + "px";
			root.player_track_list.style.width = (getSize(root.player_track_list.getElementsByTagName("div")[0]).w + root.margin_box) * root.tracks.length + "px";
			
			root.player_loader_track.style.width = "0";
			w_playlist = getSize(root.player_track_list).w;
			w_box = getSize(root.player_track_list.getElementsByTagName("div")[0]).w;
			w_min = getSize(root.player_track_list).w + getOffset(root.player_track_list).x;
			if(getSize(root.player_track_list).w < getWidthBrowser()){
				root.player_arrow_right.style.display = "none";
			}else{
				root.player_arrow_right.style.display = "block";
			}
		}
		
	}
	
	this.getNewTrack = function(track,play){
		play = play || false;
		this.current_track = track;
		if(this.current_track < this.tracks.length){
			
			if(this.track){
				this.track.pause();
				this.track.src = "";
				this.track = null;
			}
			
			/* Flash */
			
			if(root.flash){
				/* Creo el objeto audio en Flash y la función onProgress */
				
				this.track = new Object();
				this.track.src = this.tracks[this.current_track].audio + ".mp3";
				
				this.track.pause = function(){
					root.fplayer.getPlay(false);
				}
				this.track.play = function(){
					root.fplayer.getPlay(true);
				}
				
				this.timerFlash = setTimeout(this.updateFlash,1000);
				console.log("pido un nuevo track");
				this.fplayer.getTrack(this.track.src,play);
				
			}else{
		
			/* Javascript */
			
			//console.log(this.track.src);
			
				this.track = new Audio(this.tracks[this.current_track].audio + ".ogg",this.tracks[this.current_track].audio + ".mp3");
				if(this.track.canPlayType('audio/mpeg')) {
					this.track.type= 'audio/mpeg';
					this.track.src = this.tracks[this.current_track].audio + ".mp3";
				} else {
					this.track.type = 'audio/ogg';
					this.track.src = this.tracks[this.current_track].audio + ".ogg";
				}
				
				this.track.addEventListener("progress", root.progressTrack);
				this.track.addEventListener("ended", root.finishTrack);
				this.track.addEventListener("loadeddata", root.loadedTrack);
				if(play){
					this.track.addEventListener("canplaythrough", root.startTrack);
				}
				
				
				
			}
			
			/* ----- */
			
			this.player_dial_track.style.left = getOffset(this.player_back_track).x + "px";
			this.player_front_track.style.width = "0";
			this.player_track_name.innerHTML = this.tracks[this.current_track].name
			this.player_cover.src = this.tracks[this.current_track].cover + "?clear=true";
			
			if(play){
				this.playing = true;
				this.player_play.innerHTML = "E";
				this.timer = setTimeout(this.showTime,1000);
				this.setSelected(this.tracks[this.current_track].audio);
			}
			if(!this.status_random){
				this.tracks = this.tracks_backup.slice();
			}
			this.current_track++;
			
		}else{
			this.current_track = 0;
			if(this.status_replay){
				this.getNewTrack(this.current_track,play);
				if(getSize(this.player_track_list).w > getWidthBrowser()){
					root.player_arrow_left.style.display = root.player_arrow_right.style.display = "none";
					function finishMove(){
						root.player_arrow_left.style.display = "none";
						root.player_arrow_right.style.display = "block";
					}
					easingElement(this.player_track_list,getOffset(this.player_track_list).x,0,finishMove);
				}
			}
		}

	}
	
	this.progressTrack = function(e){
		if(root.flash){
			//if(root.fplayer.getLoaded() > 1){
				root.statusLoading = true;
				//console.log(root.fplayer.getLoaded());
				root.player_loader_track.style.width = (getSize(root.player_back_track).w * root.fplayer.getLoaded()) / 100 + "px";
			//}
		}else{
			if(this.duration && this.buffered.end(0)){
				root.statusLoading = true;
				root.player_loader_track.style.width = (getSize(root.player_back_track).w * this.buffered.end(0)) / this.duration + "px";
				console.log(this.buffered.end(0) + " - " + this.duration);
			}
		}
	}
	
	this.startTrack = function(e){
		root.track.play();
	}
	
	this.finishTrack = function(e){
		root.playing = false;
		root.track.currentTime = 0;
		root.player_play.innerHTML = "J";
		root.player_dial_track.style.left = getOffset(root.player_back_track).x + "px";
		root.player_front_track.style.width = "0";
		clearTimeout(root.timer);
		if(root.timerFlash){
			clearTimeout(root.timerFlash);
		}
		//alert(root.timer);
		root.getNewTrack(root.current_track,true);
	}
	
	this.loadedTrack = function(e){
		root.player_track_time.innerHTML = formatTime(root.track.duration);
		root.player_time.innerHTML = formatTime(root.track.currentTime);
		root.track.volume = root.current_volume;
	}
	
	this.updateFlash = function(e){
		root.track.currentTime = root.fplayer.getCurrentTime() / 1000;
		root.track.duration = root.fplayer.getDuration() / 1000;
		root.track.volume = root.fplayer.getVolume();
		if(root.track.duration <= 0){
			root.timerFlash = setTimeout(root.updateFlash,100);
		}else{
			clearTimeout(root.timerFlash);
		}
		root.player_track_time.innerHTML = formatTime(root.track.duration);
		root.player_time.innerHTML = formatTime(root.track.currentTime);
	}
	
	this.showTime = function(){
		if(root.flash){
			root.track.currentTime = root.fplayer.getCurrentTime() / 1000;
		}
		root.player_time.innerHTML = formatTime(root.track.currentTime);
		/* Posicionando dialup */
		var pos_dial = (getSize(root.player_back_track).w * root.track.currentTime) / root.track.duration;
		if(getOffset(root.player_dial_track).x < getOffset(root.player_back_track).x + getSize(root.player_back_track).w - getSize(root.player_dial_track).w){
			root.player_dial_track.style.left = getOffset(root.player_back_track).x + pos_dial + "px";
		}
		root.player_front_track.style.width = pos_dial + getSize(root.player_dial_track).w / 2 + "px";
		/* Vuelvo a ejecutar el Timeout para mover el dial y asignar nuevo tiempo */
		//console.log(root.track.currentTime + " - " + root.track.duration);
		if(root.flash){
			if(Math.round(root.track.currentTime) >= Math.round(root.track.duration)){
				root.finishTrack();
			}
		}
		root.timer = setTimeout(root.showTime,1000);
	}
	
	
	/* General Functions */
	
	this.setSelected = function(audio){
		for(var i=0;i<this.player_track_list.childNodes.length;i++){
			var href = this.player_track_list.childNodes[i].getElementsByTagName("a")[0].href;
			if(href.indexOf(audio) != -1){
				this.player_track_list.childNodes[i].className = 'player_box_track player_selected_track';
			}else{
				this.player_track_list.childNodes[i].className = 'player_box_track';
			}
		}
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
	
	document.onmouseup = function(e){
		if(e.target.title){
			if(!root.flash){
				root.track.play();
			}
			e.target.title = false;
		}
		document.onmousemove = null;
		return false;
	}	
}