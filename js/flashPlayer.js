function flashPlayer(){
	
	this.getTrack = function(track,status){
		document.getElementById("mymovie").getTrack(track,status);
	}
	
	/* Play and pause */
	
	this.getPlay = function(status){
		document.getElementById("mymovie").getPlay(status);
	}
	
	/* Track duration */
	
	this.getDuration = function(){
		return document.getElementById("mymovie").getDuration();
	}
	
	/* Get loaded percent */
	
	this.getLoaded = function(){
		return document.getElementById("mymovie").getLoaded();
	}
	
	/* Get volume */
	
	this.getVolume = function(){
		return document.getElementById("mymovie").getVolume();
	}
	
	/* Set volume */
	
	this.setVolume = function(volume){
		return document.getElementById("mymovie").setVolume(volume);
	}
	
	/* Get current time */
	
	this.getCurrentTime = function(){
		return document.getElementById("mymovie").getCurrentTime();
	}
	
	/* Set current time */
	
	this.setCurrentTime = function(time){
		var t = time * 1000;
		document.getElementById("mymovie").setCurrentTime(t);
	}
	
}