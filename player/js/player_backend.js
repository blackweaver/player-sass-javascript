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
	
	/* Set status actual vars*/
	
	this.flash = false;
	this.current_track = 0;
	this.old_current = 0;
	this.margin_box = 5;
	this.general_volume = this.current_volume = 0.5;
	this.mousePos = 0;
	this.statusplay = true;
	this.status_replay = false;
	this.status_random = false;
	this.satus_arrow = true;
	this.closed = false;
	this.playing = false;
	this.timer = 0;
	this.timerFlash = 0;
	this.fplayer = null;
	this.statusLoading = false;
	this.arrayTracks;
	
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
	
	/* ---------------- */
	
	this.ready = function(){}
	
	function loadBody(){
		root.ready();
		try{
			if(!html5){
				document.getElementById("no_existe").innerHTML = "test";
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
	
	/* Place Flash if don´t have canvas */
	
	this.placeFlash = function(){
		document.getElementById(e.flash_content).style.borderTop = "solid 1px white";
		this.fplayer = new flashPlayer();
		var so = new SWFObject(e.flash_swf, e.flash_id, e.flash_width, e.flash_height, e.flash_player, e.flash_bg);
       so.write(e.flash_content);
	}
	
	this.getPositionElement = function(parent,child){
		for(var i=0;i<parent.childNodes.length;i++){
			if(child.getElementsByTagName("a")[0].rel == parent.childNodes[i].getElementsByTagName("a")[0].rel){
				return i;
				break;
			}
		}
	}
	
	this.addTrack = function(container,pos){
		
		var box = document.createElement("div");
		
		var box_link = document.createElement("a");
		box_link.setAttribute('rel',root.tracks[pos].id);
		box_link.setAttribute('href',root.tracks[pos].audio + ".mp3");
		box_link.onclick = function(){
			if(root.statusLoading){
				root.player_init.className = "";
				root.player_end.className = "";
				if(root.status_random) root.tracks = root.tracks_backup.slice();
				for(var i=0;i<root.tracks.length;i++){
					if(this.rel == root.tracks[i].id){
						root.getNewTrack(i,true);
						if(i >= root.tracks.length - 1 && root.status_replay == false){
							root.player_end.className = 'switch';
						}else if(i < 1){
							root.player_init.className = 'switch';
						}
					}
				}
				
				if(root.status_random){
					root.player_track_replay.getElementsByTagName("a")[0].className = 'switch';
					root.status_random = false;
				}
			}
			return false;
		}
		
		box.style.marginRight = this.margin_box + "px";
		box.appendChild(box_link);
		
		var bt_close = document.createElement("div");
		bt_close.className = "bt_close";
		bt_close.audio = root.tracks[pos].audio;
		bt_close.onclick = function(event){
			event = event || window.event;
		    if (event.stopPropagation) {
				event.stopPropagation()
		    }else{
				// IE variant
				event.cancelBubble = true
			}
			var child = this.parentNode.parentNode;
			var parent = child.parentNode;
			for(k=0;k<root.tracks.length;k++){
				if(root.tracks[k].audio == this.audio){
					//Siembre que haga click en el que no está activo
					root.tracks.splice(k,1);
					var nodeSelected = child.className.search("player_selected_track");
					if(nodeSelected > -1){
						var position = root.getPositionElement(parent,child);
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
			}
			for(u=0;u<root.tracks_backup.length;u++){
				if(root.tracks_backup[u].audio == this.audio){
					root.tracks_backup.splice(u,1);
				}
			}
			/* Borro el elemento */
			parent.removeChild(child);
			
			/* Elementos a contemplar cada vez que se cierra un track */
			//Re escalo el contenedor de tracks
			root.reSetPlaylist();
			/* ------------ */
			
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
			
				var box_text = document.createTextNode(root.tracks[pos].name.slice(0,15));
				box_span.appendChild(box_text);
				
			var box_text_artist = document.createTextNode(root.tracks[pos].artist.slice(0,15));
			box_p.appendChild(box_text_artist);
			
		container.appendChild(box);
	}
	
	this.resetPlayer = function(){
		if(this.track){
			this.track.pause();
			if(!root.flash){
				this.track.removeEventListener("progress", root.progressTrack);
				this.track.removeEventListener("ended", root.finishTrack);
				this.track.removeEventListener("loadeddata", root.loadedTrack);
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
		this.player_track_replay.getElementsByTagName("a")[0].style.display = "none";
		this.player_play.style.display = this.player_init.style.display = this.player_end.style.display = "none";
	}
	
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
	
	/* Set ID for compare in playlist */
	
	this.setCorrectNumbers = function(){
		var elements = this.player_track_list.childNodes;
		for(var i=0;i<elements.length;i++){
			elements[i].setAttribute('id',i);
		}
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
		this.setCorrectNumbers();
		
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
				this.className = '';
				root.player_container.style.display = root.player_track_back.style.display = "block";
			}else{
				root.closed = true;
				this.className = 'switch';
				root.player_container.style.display = root.player_track_back.style.display = "none";
			}
			return false;
		}
		
		/* Muestro las flechas indicadas para mover la playlist */
		
		//this.player_init.style.backgroundPosition = "center bottom";
		this.player_init.className = 'switch';
		this.player_track_replay.className = 'switch';
		this.player_track_replay.getElementsByTagName("a")[0].className = 'switch';
		this.player_track_replay.getElementsByTagName("a")[1].className = 'switch';
		
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
		
		this.player_play.style.display = "block";
		
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
						var res = getOffset(root.player_track_list).x + w_box;
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
			if(root.statusplay){
				if(root.playing){
					root.playing = false;
					root.track.pause();
					clearTimeout(root.timer);
					//this.style.backgroundPosition = "center top";
					this.className = '';
					document.getElementById("favicon").href = "favicon.png";
				}else{
					root.playing = true;
					root.track.play();
					//this.style.backgroundPosition = "center bottom";
					this.className = 'switch';
					root.timer = setTimeout(root.showTime,1000);
					root.player_track_time.innerHTML = formatTime(root.track.duration);
					document.getElementById("favicon").href = "favicon_play.png";
				}
			}
			return false;
		}
		
		this.player_track_replay.getElementsByTagName("a")[0].style.display = "block";
		this.player_init.style.display = this.player_end.style.display = "block";
		
		if(this.tracks.length > 1){
		
		/* Llevar track al inicio */
		
				this.player_init.onclick = function(){
					root.player_end.className = '';
					if(root.current_track < 3){
						this.className = 'switch';
					}
					if(root.current_track > 1){
						var num = root.current_track - 2;
						root.getNewTrack(num,true);
					}
					return false;
				}
				
				/* Llevar track al final */
				
				this.player_end.onclick = function(){
					root.player_init.className = '';
					if(root.current_track >= root.tracks.length - 1 && !root.status_replay){
						this.className = 'switch';
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
				
				this.player_track_replay.getElementsByTagName("a")[0].style.display = "none";
		
		}else{
			this.player_track_replay.getElementsByTagName("a")[0].style.display = "none";
			this.player_init.style.display = this.player_end.style.display = "none";
		}
		
		
		if(this.tracks.length > 2){
		
			/* Random */
			
			this.player_track_replay.getElementsByTagName("a")[0].onclick = function(){
				if(root.status_random){
					this.className = 'switch';
					root.tracks = root.tracks_backup.slice();
					root.status_random = false;
					/*If random exist */
					root.current_track = root.old_current + 1;
				}else{
					this.className = '';
					root.tracks = shuffle(root.tracks).slice();
					root.status_random = true;
				}
				return false;
			}
			
			this.player_track_replay.getElementsByTagName("a")[0].style.display = "block";
			
		}
		
		/* Replay playlist */
		
		this.player_track_replay.getElementsByTagName("a")[1].onclick = function(){
			if(root.status_replay){
				this.className = 'switch';
				root.status_replay = false;
				
			}else{
				this.className = '';
				root.player_end.className = '';
				root.status_replay = true;
			}
			return false;
		}
		
		/* Mute volumen */
		
		this.player_speaker.onclick = function(){
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
				root.player_speaker.className = '';
				/* for flash */
				if(root.flash){
					root.track.volume = root.fplayer.setVolume(root.current_volume);
				}
				/* --------- */
			}else if(root.mousePos.x - getSize(root.player_dial_volume).w / 2 < getOffset(root.player_back_volume).x){
				root.player_speaker.className = 'switch';
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
					/* for flash */
					if(root.flash){
						root.track.volume = root.fplayer.setVolume(root.current_volume);
					}
					/* --------- */
				}else if(root.mousePos.x - getSize(root.player_dial_volume).w / 2 < getOffset(root.player_back_volume).x){
					root.player_speaker.className = 'switch';
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
					if(root.mousePos.x - getSize(root.player_dial_track).w / 2 >= getOffset(root.player_loader_track).x && root.mousePos.x <= getOffset(root.player_loader_track).x + getSize(root.player_loader_track).w - getSize(root.player_dial_track).w / 2){
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
			root.reSetPlaylist();
		}
		
	}
	
	this.reSetPlaylist = function(){
		if(root.tracks.length >= 1){
			root.player_track_list.style.width = (getSize(root.player_track_list.getElementsByTagName("div")[0]).w + root.margin_box) * root.tracks.length + "px";
		}
		if(getSize(root.player_track_list).w < getWidthBrowser()){
			root.player_arrow_right.style.display = "none";
		}else{
			root.player_arrow_right.style.display = "block";
		}
	}
	
	this.getNewTrack = function(track,play){
		
		play = play || false;
		this.current_track = track;
		if(this.current_track < this.tracks.length){
			
			if(this.track){
				this.track.pause();
				if(!root.flash){
					this.track.removeEventListener("progress", root.progressTrack);
					this.track.removeEventListener("ended", root.finishTrack);
					this.track.removeEventListener("loadeddata", root.loadedTrack);
				}
				this.player_loader_track.style.width = "0";
				this.track.src = "";
				this.track = null;
			}
			
			/* Flash */
			if(root.flash){
				
				/* Creo el objeto audio en Flash y la función onProgress */
				this.statusplay = false;
				this.track = new Object();
				this.track.src = this.tracks[this.current_track].audio + ".mp3";
				
				this.track.pause = function(){
					root.fplayer.getPlay(false);
				}
				this.track.play = function(){
					root.fplayer.getPlay(true);
				}
				
				this.fplayer.getTrack(this.track.src,play);
				
				this.timerFlash = setTimeout(this.updateFlash,1000);
				
			}else{
		
			/* Javascript */
			
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
				this.player_play.className = 'switch';
				if(this.timer){
					clearTimeout(this.timer);
				}
				this.timer = setTimeout(this.showTime,1000);
			}
			this.setSelected(this.tracks[this.current_track].id);
			this.current_track++;
			
		}else{
			this.current_track = 0;
			if(this.status_replay){
				this.getNewTrack(this.current_track,true);
			}else{
				this.getNewTrack(this.current_track,false);
			}
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
	
	this.progressTrack = function(){
		if(root.flash){
			root.statusLoading = true;
			root.player_loader_track.style.width = (getSize(root.player_back_track).w * root.fplayer.getLoaded()) / 100 + "px";
		}else{
			root.statusLoading = true;
			//console.log(this.duration +" - "+ this.buffered.end(0));
			if(this.duration && this.buffered.end(0)){
				root.player_loader_track.style.width = (getSize(root.player_back_track).w * this.buffered.end(0)) / this.duration + "px";
				//console.log(this.duration +" - "+ this.buffered.end(0));
			}
		}
	}
	
	this.startTrack = function(e){
		root.track.play();
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
		//console.log("funcando");
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
		}
		root.player_front_track.style.width = pos_dial + getSize(root.player_dial_track).w / 2 + "px";
		if(root.flash){
			if(Math.round(root.track.currentTime) >= Math.round(root.track.duration) && root.track.duration != 0){
				root.finishTrack();
			}
		}
		//alert(getSize(root.player_back_track).w +" - "+ root.track.currentTime+" - "+root.track.duration);
		root.timer = setTimeout(root.showTime,1000);
	}
	
	
	/* General Functions (habría que hacerlo contra un ID) */
	
	this.setSelected = function(id){
		for(var i=0;i<this.player_track_list.childNodes.length;i++){
			//alert(this.player_track_list.childNodes[i].id+" - "+id);
			if(this.player_track_list.childNodes[i].id == id){
				this.player_track_list.childNodes[i].className = 'player_box_track player_selected_track';
				this.old_current = i;
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
		try{
			if(e.target.title){
				if(!root.flash){
					root.track.play();
				}
				e.target.title = false;
			}
		}catch(e){}
		document.onmousemove = null;
		return false;
	}	
}