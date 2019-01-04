/* Fadein y fadeout de elementos */

function onFinish(){}

/* Muestro u oculto elementos con un fadeIn / Out */

function fadeElement(element,start,total,type,callback){
	callback || ( callback = null );
	var root = this;
	var start_one = start / 100;
	var total_one = total / 100;
	var fadenumber = start;
	var fadeopacity;
	element.style.opacity = start_one;
	element.style.filter = 'alpha(opacity='+ start +')';
	element.style.MozOpacity = start_one;
	var showcontainer = setInterval(fade,50);
	
	function fade(){
		if(type){
			fadenumber+= 20;
		}else{
			fadenumber-= 20;
		}
		fadeopacity = fadenumber / 100;
		if(type){
			if(fadenumber >= total){
				clearInterval(showcontainer);
				element.style.opacity = total_one;
				element.style.filter = 'alpha(opacity='+ total +')';
				element.style.MozOpacity = total_one;
				root.statusalert = true;
				callback();
			}else{
				element.style.opacity = fadeopacity;
				element.style.filter = 'alpha(opacity='+ fadenumber +')';
				element.style.MozOpacity = fadeopacity;
				return false;
			}
		}else{
			if(fadenumber <= total){
				clearInterval(showcontainer);
				element.style.opacity = total_one;
				element.style.filter = 'alpha(opacity='+ total +')';
				element.style.MozOpacity = total_one;
				root.statusalert = true;
				callback();
			}else{
				element.style.opacity = fadeopacity;
				element.style.filter = 'alpha(opacity='+ fadenumber +')';
				element.style.MozOpacity = fadeopacity;
				return false;
			}
		}
	}
}

function mouseCoords(e){
	if(e.pageX || e.pageY){
		return { x:e.pageX,y:e.pageY }
	}else{
		return { x:e.clientX + document.body.scrollLeft - document.body.clientLeft,y:e.clientY + document.body.scrollTop - document.body.clientTop }
	}
	
}

function compareXCoords(posx,element,mx){
	mx || ( mx = 0 );
	if(posx > getOffset(element).x + getSize(element).w + mx){
		return true;
	}else{
		return false;
	}
}
	
/* Obtengo la posición de un elemento */

function getOffset(element) {
	var _x;
	var _y;
	_x = element.offsetLeft - element.scrollLeft;
	_y = element.offsetTop - element.scrollTop;
	return { x: _x, y: _y };
}

/* Get width browser */

function getWidthBrowser(){
	if(document.all){
		if(!window.addEventListener){
			return document.getElementsByTagName("body")[0].offsetWidth;
		}else{
			return window.clientWidth;
		}	
	}else{
		return document.getElementsByTagName("body")[0].offsetWidth;
	}
}

/* Obtengo el ancho y alto de un elemento */

function getSize(element){
	var _w;
	var _h;
	if(document.all){//IE
		if(!window.addEventListener){
			_w = element.offsetWidth;
			_h = element.offsetHeight;
		}else{
			_w = element.clientWidth;
			_h = element.clientHeight;
		}	
	}else{
		_w = element.offsetWidth;
		_h = element.offsetHeight;
	}
	
	return { w: _w, h: _h }
}

function formatTime(time){
	if(time){
		var minuts = Math.floor(time / 60);
		var seconds = Math.round(time) - (minuts * 60);
		if(minuts < 10){
			minuts = "0" + minuts;
		}
		if(seconds < 10){
			seconds = "0" + seconds;
		}
		var result = minuts + ":" + seconds;
		return result;
	}else{
		return "00:00";
	}
}

function easingElement(e,pos,end,callback){
	var pos = pos;
	var timer = setInterval(move,50);
	function move(){
		pos+= (end - getOffset(e).x) * 0.5;
		e.style.left = pos + "px";
		if(Math.round(pos) == end - 1 || Math.round(pos) == end + 1){
			clearInterval(timer);
			e.style.left = end + "px";
			callback();
		}
	}
}

function shuffle(array){
	var new_array = new Array();
	var items = new Array();
	for(var k=0;k<k+1;k++){
		var status = true;
		num = Math.floor(Math.random() * array.length);
		for(var i=0;i<items.length;i++){
			if(num == items[i]){
				status = false;
				break;
			}
		}
		if(status){
			items.push(num);
			new_array.push(array[num]);
		}
		if(new_array.length >= array.length){
			return new_array;
			break;
		}
	}
}

function detectCollision(receiver,transmitter,mx,my){
	mx || ( mx = 0 );
	my || ( my = 0 );
	var x_receiver = getOffset(receiver).x + mx;
	var y_receiver = getOffset(receiver).y + my;
	var x_transmitter = getOffset(transmitter).x + getSize(transmitter).w / 2;
	var y_transmitter = getOffset(transmitter).y + getSize(transmitter).h / 2;
	if(x_transmitter > x_receiver && x_transmitter < x_receiver + getSize(receiver).w && y_transmitter > y_receiver && y_transmitter < y_receiver + getSize(receiver).h){
		return true;
	}else{
		return false;
	}
}


function keypress(e){
	if(window.event)
	   return window.event.keyCode;
	else if(e)
		if(e.keyCode == 0)
			return e.charCode
		else
	   		return e.keyCode;
	else
	   return false;
}