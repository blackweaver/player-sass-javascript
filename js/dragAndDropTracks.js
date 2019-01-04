/* Construct function */

function dragAndDropTracks(){
	
	var root = this;
	
	/* Set status actual vars */
	
	this.start = null; 
	this.os = navigator.platform.toUpperCase().indexOf("MAC");
	this.tracks = new Array();
	this.element = new Array();
	this.statusBox = false;
	this.boxContainer = null;
	
	//item_play
	
	this.walkDraw = function(){ 
		
		//var item_draw = new Array();
		this.element = new Array();

		for(var i=0;i<document.getElementsByTagName("*").length;i++){
			if(document.getElementsByTagName("*")[i].className == "drawItem" || document.getElementsByTagName("*")[i].className == "unselected_draw"  || document.getElementsByTagName("*")[i].className == "selected_draw"){
				if(document.getElementsByTagName("*")[i].lang){
					this.element.push(document.getElementsByTagName("*")[i]);
				}
			}
		}
		
		for(var i=0;i<this.element.length;i++){
			if(this.element[i].className == "unselected_draw"){
				this.element[i].selected = false;
				this.element[i].className = "unselected_draw";
			}
			var status = this.element[i].lang.indexOf("|");
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
					if(player.statusplay){
					    if (e.stopPropagation) {
							e.stopPropagation();
					    }else{
							e.cancelBubble = true
						}
						root.statusBox = true;
						var element = this;
						document.onmousemove = function(ev){ 
							root.moveBox(ev,element);
							recreatePlaylist();
						};
					}
					return false;
				}
			}
		}
	}
	
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
		}
		return false;
	}
	
	
	this.pushAll = function(){
		this.tracks = new Array();
		for(var i=0;i<this.element.length;i++){
			if(this.element[i].className == "selected_draw"){
				var info = this.element[i].lang.split("|");
				var audio = new Object();
				audio.lenght = info[0];
				audio.name = info[1];
				audio.type = info[2];
				audio.idtrack = info[3];
				audio.album = info[4];
				audio.artist = info[5];
				audio.cover = info[6];
				this.tracks.push(audio);
			}
		}
	}
	
	this.addTrack = function(obj){
		obj.className = "selected_draw";
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
					this.element[i].className = "unselected_draw";
					this.element[i].selected = false;
				}
			}
			
			if(!key){
				btn.className = "unselected_draw";
				btn.selected = false;
			}else{
				btn.className = "selected_draw";
				btn.selected = true;
			}
			
			if(!statusbtn){
				btn.className = "selected_draw";
				btn.selected = true;
			}else{
				btn.className = "unselected_draw";
				btn.selected = false;
			}
		}
		this.pushAll();
	}
	
	document.getElementsByTagName("body")[0].onmousedown = function(){
		root.resetList();
	}
	
	this.resetList = function(){
		if(this.tracks.length > 0){
			this.tracks = new Array();
			for(var i=0;i<this.element.length;i++){
				this.element[i].className = "unselected_draw"; 
				this.element[i].selected = false;
			}
		}
	}

}