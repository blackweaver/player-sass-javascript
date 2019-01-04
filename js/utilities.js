/* Con esta funcion modificamos el texto para que no caracteres extraños*/
function seo_string(txt_src){

 var output = txt_src.replace(/[^a-zA-Z0-9]/g,' ').replace(/\s+/g,"-").toLowerCase();
 /* remove first dash */
 if(output.charAt(0) == '-') output = output.substring(1);
 /* remove last dash */
 var last = output.length-1;
 if(output.charAt(last) == '-') output = output.substring(0, last);

 return output;
}



/* Para prevenir inyección js */
function strip_tags(input, allowed) {
  allowed = (((allowed || '') + '')
    .toLowerCase()
    .match(/<[a-z][a-z0-9]*>/g) || [])
    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '')
    .replace(tags, function($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}



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

function mouseCoords(e,main){
	if(!e){
		return 0;
	}
	main || ( main = null );
	var difx = 0;
	var dify = 0;
	if(main){
		difx = getOffset(main).x;
		dify = getOffset(main).y;
	}
	if(e.pageX || e.pageY){
		return { x:e.pageX - difx,y:e.pageY - dify }
	}else{
		return { x:e.clientX + document.body.scrollLeft - document.body.clientLeft - difx,y:e.clientY + document.body.scrollTop - document.body.clientTop - dify }
	}

}

function compareXCoords(posx,element,mx){
	mx || ( mx = 0 );
	var w = 0;
	if(document.all){
		w = window.document.documentElement.scrollLeft;
	}else{
		w = window.pageXOffset;
	}
	if(posx > getOffset(element).x + getSize(element).w + mx - w){
		return true;
	}else{
		return false;
	}
}

function compareYCoords(posy,element,my){
	my || ( my = 0 );
	var h = 0;
	if(document.all){
		h = window.document.documentElement.scrollTop;
	}else{
		h = window.pageYOffset;
	}
	if(posy > getOffset(element).y + getSize(element).h + my - h){
		return true;
	}else{
		return false;
	}
}

/* Obtengo el scroll general de la página */

function getPageScroll(){
	var left = 0;
	var top = 0;
	if(document.all) {
		left = window.document.documentElement.scrollLeft;
		top = window.document.documentElement.scrollTop;
	}else{
		left = window.pageXOffset;
		top = window.pageYOffset;
	}
	return { x: left, y: top };
}

/* Obtengo la posición de un elemento */

function getOffset(element) {
	var w = 0;
	var h = 0;
	if(document.all) {
		w = window.document.documentElement.scrollLeft;
		h = window.document.documentElement.scrollTop;
	}else{
		w = window.pageXOffset;
		h = window.pageYOffset;
	}
	var _x;
	var _y;
	_x = element.offsetLeft + w;
	_y = element.offsetTop + h;
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
		if(seconds < 10){
			seconds = "0" + seconds;
		}else if(seconds == 60){
			seconds = "00";
			minuts = minuts + 1;
		}
		if(minuts < 10){
			minuts = "0" + minuts;
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

function detectCollision(receiver,transmitter,main,mx,my){
	main || ( main = null );
	mx || ( mx = 0 );
	my || ( my = 0 );
	var difx = 0;
	var dify = 0;
	if(main){
		difx = getOffset(main).x;
		dify = getOffset(main).y;
	}
	var x_receiver = getOffset(receiver).x + difx + mx;
	var y_receiver = getOffset(receiver).y + dify + my;
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

function getOS() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if(userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)){
    return 'iOS';
  }else if(userAgent.match(/Android/i) || userAgent.match(/Linux/i)){
    return 'Android';
  }else{
	 return 'unknown';
  }
}

var timeAlert = 0;
function showHideAlert(type,text){
	type || ( type = null );
	text || ( text = null );
	if(type && text){
		$(".alert").hide();
		$(type).show();
		$(type + " a").html(text);
		$(type).fadeTo(0,0).fadeTo("slow",1,function(e){});
		if(type != ".alert-info"){	
			if(timeAlert) clearTimeout(timeAlert);
			timeAlert = setTimeout(timeAlertFunc,3000);
		}
	}else{
		$(".alert").fadeOut(function(e){ $(this).hide() });
	}

	function timeAlertFunc(){
		$(".alert").fadeOut(function(e){ $(this).hide() });
	}
}