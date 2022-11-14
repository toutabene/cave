function PlayList(sIdPlayer, bStopOtherParam){
    this.bStopOther = bStopOtherParam == undefined? false : bStopOtherParam;
    this.sName = sIdPlayer;
    this.oPlayer = null;
    this.oPlaylist = null;
    this.oChanson = null;
    this.getaPlayers = function(){ 
      return window['aPlayers'] != undefined? window['aPlayers']:null; 
    }//fct
    this.resetSlection = function (){ 
      if(this.oChanson != null){
        this.oPlayer.pause();
        this.setLine(this.oChanson, this.oPlayer.paused, true);
      }//if
    }//fct
    this.stopOther = function (){ 
      var aPlayers  = this.getaPlayers();
      if(this.bStopOther == true && aPlayers != null){
        for(var i = 0 ; i < aPlayers.length; i++){
          if(aPlayers[i] != this){
            aPlayers[i].resetSlection();
          }//if      
        }//for
      }//iff
    }//fct
    this.playChanson = function (oEvent){ 
      var oItem = oEvent.currentTarget, sSound = oItem.getAttribute('data-sound'),
          sUrl = "http://s1download-universal-soundbank.com/mp3/sounds/"+sSound ;
      /* A vous de gérer la manière de recupere l'ur du son */
      this.stopOther();
      if(this.oChanson == oItem){ 
        if(this.oPlayer.paused==true){
          this.oPlayer.play();
        }else{
          this.oPlayer.pause();
        }//else
        this.setLine(this.oChanson, this.oPlayer.paused, true);
      }else{
        this.oPlayer.src = sUrl;
        this.oPlayer.play();
        this.setLine(this.oChanson, true, false);
        this.setLine(oItem, false, true);
      } //else
      this.oChanson = oItem;
    }//fct
    this.setLine = function (oItem, bPause, bSelected, bError){
      if(oItem == null){return}
      if(bError == undefined ){bError = false}
      var sSelected = "selected",
          sPause = 'pause_circle_outline', 
          sPlay  = 'play_circle_outline',
          sError  = 'block',
          oIcone = oItem.children[0];
      if(bSelected == true){ 
        oItem.classList.add(sSelected);
      }else{ 
        oItem.classList.remove(sSelected);
      } //else
      if(bError == true ){
        oIcone.innerHTML= sError ;
        return;
      }//if
      if(bPause == true){
        oIcone.innerHTML= sPlay ;  
      }else if(bPause == false){
        oIcone.innerHTML= sPause ;  
      }else{
        oIcone.innerHTML= bPause ;  
      }//else
      
    }//fct
  
    this.playerEvent = function(oEvent){
      if(this.oChanson != null && (oEvent.type == 'play' || oEvent.type == 'pause' || oEvent.type == 'playing')){
        this.setLine(this.oChanson, this.oPlayer.paused, true);
      }else if(oEvent.type == 'error'){ 
        this.setLine(this.oChanson, this.oPlayer.paused, false, true);
        this.oChanson  = null;
      }else if(oEvent.type == 'waiting'){ 
        this.setLine(this.oChanson, 'cloud_queue', true);
      } 
    }//fct
    
    this.init = function(){
      if(this.sName ==''){ return false; } 
      var oPlayerWdg = document.getElementById(this.sName);
      if(oPlayerWdg == null){ return false; }
      var oMyWdg = this,
          aPlaylist = null,
          oTmpAudio = oPlayerWdg.getElementsByTagName('audio'),
          oTmpList = oPlayerWdg.getElementsByClassName('play-list');
      if(oTmpAudio.length == 0 || oTmpList.length == 0 ){ return false;}
      this.oPlayer   =  oTmpAudio[0];
      this.oPlaylist = oTmpList[0]; 
      if(this.bStopOther){
        window['aPlayers']= window['aPlayers']==undefined?[]:window['aPlayers'];
        window['aPlayers'].push(this);
      }
      aPlaylist = this.oPlaylist.children; 
      for(var i = 0; i < aPlaylist.length; i++){ 
        aPlaylist[i].addEventListener('click', function(oEvent){oMyWdg.playChanson(oEvent)});
        aPlaylist[i].setAttribute("data-position",i);  
      } 
      this.oPlayer.addEventListener('play', function(oEvent){oMyWdg.playerEvent(oEvent)});
      this.oPlayer.addEventListener('pause', function(oEvent){oMyWdg.playerEvent(oEvent)});
      this.oPlayer.addEventListener('error', function(oEvent){oMyWdg.playerEvent(oEvent)});
      this.oPlayer.addEventListener('waiting', function(oEvent){oMyWdg.playerEvent(oEvent)});
       this.oPlayer.addEventListener('playing', function(oEvent){oMyWdg.playerEvent(oEvent)}); 
    }
    this.init();
  }//fct
   
  document.addEventListener('DOMContentLoaded',function(){
    var oMyPlayListOne = new PlayList("playerone", true);
    var oMyPlayListTwo = new PlayList("playertwo", true);
  });