/* Construct function */

function dragAndDropTracks(){
	
	var root = this;
	
	/* Set status actual vars */
	
	this.start = null;
	this.os = navigator.platform.toUpperCase().indexOf("MAC");
	this.tracks = this.element = new Array();
	this.element = document.getElementsByTagName("li");
	this.statusBox = false;
	this.boxContainer = null;
	
	for(var i=0;i<this.element.length;i++){
		this.element[i].selected = false;
		var status = this.element[i].title.indexOf("|");
		if(status){
			this.element[i].start = i;
			this.element[i].onselectstart = function(e){ return false }
			this.element[i].onclick = function(e){
				e = e || window.event;
				var key = false;
				if(root.os != -1){
					key = e.metaKey;
				}else{
					key = e.ctrlKey;
				}
				root.selectItem(this,key,e.shiftKey);
				if(document.onmousemove) document.onmousemove = null;
				return false;
			}
			this.element[i].onmousedown = function(e){
				e = e || window.event;
				root.statusBox = true;
				var element = this;
				document.onmousemove = function(ev){ root.moveBox(ev,element) };
				//root.mouseUp();
				return false;
			}
		}
	}
	
	/*this.mouseUp = function(){
		document.onmouseup = function(e){
			if(root.boxContainer){
				document.getElementsByTagName("body")[0].removeChild(document.getElementsByTagName("div")[0]);
				root.boxContainer = null;
				if(document.onmousemove) document.onmousemove = null;
			}
			root.statusBox = false;
			return false;
		}
	}*/
	
	this.moveBox = function(ev,element){
		
		ev = ev || window.event;
		if(this.statusBox){
			
			var key = false;
			if(root.os != -1){
				key = ev.metaKey;
			}else{
				key = ev.ctrlKey;
			}
			if(!element.selected) this.selectItem(element,key,ev.shiftKey);
			
			this.statusBox = false;
		}
		if(this.tracks.length > 0){
			player.createExternalTracks(ev,this.tracks);
			this.tracks = new Array();
		}
		return false;
	}
	
	/*this.moveBox = function(ev,element){
		ev = ev || window.event;
		if(this.statusBox){
			
			var key = false;
			if(root.os != -1){
				key = ev.metaKey;
			}else{
				key = ev.ctrlKey;
			}
			if(!element.selected) root.selectItem(element,key,ev.shiftKey);
			
			this.createBigBox();
			this.statusBox = false;
		}
		if(this.tracks.length > 0 && this.boxContainer){
			this.boxContainer.style.top = mouseCoords(ev).y + "px";
			this.boxContainer.style.left = mouseCoords(ev).x + "px";
		}
		return false;
	}*/
	
	/*this.createBigBox = function(){
		
		this.boxContainer = document.createElement("div");
		
		for(var i=0;i<this.tracks.length;i++){
			var box = document.createElement("div");
			box.className = "player_box_track";
			
			var box_link = document.createElement("a");
			
			var box_img = document.createElement("img");
			box_img.setAttribute('src',root.tracks[i].cover);
			box_img.setAttribute('alt',root.tracks[i].name);
			box_link.appendChild(box_img);
			
			var box_p = document.createElement("p");
			box_link.appendChild(box_p);
			
			var box_span = document.createElement("span");
			box_p.appendChild(box_span);
			
			var box_text = document.createTextNode(root.tracks[i].name.slice(0,15));
			box_span.appendChild(box_text);
			
			var box_text_artist = document.createTextNode(root.tracks[i].artist.slice(0,15));
			box_p.appendChild(box_text_artist);
			
			box.appendChild(box_link);
			
			box.style.position = "absolute";
			box.style.marginLeft = box.style.marginTop = (5 * i) + "px";
			box.style.marginLeft = box.style.marginLeft = (3 * i) + "px";
			this.boxContainer.appendChild(box);
		}
		
		this.boxContainer.style.position = "absolute";
		this.boxContainer.style.zIndex = "5000";
		document.getElementsByTagName("body")[0].insertBefore(this.boxContainer,document.getElementsByTagName("div")[0]);
	}*/
	
	this.pushAll = function(){
		this.tracks = new Array();
		for(var i=0;i<this.element.length;i++){
			if(this.element[i].className == "selected"){
				//title="Las supersticiones traen mala suerte 5|09|Pajaritos bravos muchachitos|Indio Solari|tracks/las_supersticiones_traen_mala_suerte 10|tracks/cover.jpg"
				var info = this.element[i].title.split("|");
				var audio = new Object();
				audio.name = info[0];
				audio.id = info[1];
				audio.album = info[2];
				audio.artist = info[3];
				audio.audio = info[4];
				audio.cover = info[5];
				this.tracks.push(audio);
			}
		}
	}
	
	this.addTrack = function(obj){
		obj.className = "selected";
		obj.selected = true;
	}
	
	this.selectItem = function(btn,key,statusShift){
		var statusbtn = btn.selected;
		if(statusShift){
			if(this.start != null){
				if(this.start < btn.start){
					for(var i=this.start;i<=btn.start;i++){
						this.addTrack(this.element[i]);
					}
				}else{
					for(var i=this.start;i>=btn.start;i--){
						this.addTrack(this.element[i]);
					}
				}
			}
		}else{
			
			this.start = btn.start;
			
			if(!key){
				for(var i=0;i<this.element.length;i++){
					this.element[i].className = "unselected";
					this.element[i].selected = false;
				}
			}
			
			if(!key){
				btn.className = "unselected";
				btn.selected = false;
			}else{
				btn.className = "selected";
				btn.selected = true;
			}
			
			if(!statusbtn){
				btn.className = "selected";
				btn.selected = true;
			}else{
				btn.className = "unselected";
				btn.selected = false;
			}
		}
		this.pushAll();
	}
	
	function removeTrack(data1,data2){
		for(var i=0;i<this.tracks.length;i++){
			if(this.tracks[i][0] == data1 && this.tracks[i][1] == data2){
				this.tracks.splice(i,1);
			}
		}
	}

}