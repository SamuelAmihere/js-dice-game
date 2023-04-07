var gameCount;
const CUM = "Points: "
const THROW = "Last Throw: "
const numberOfPlayers = 2;
var len;

var selectedPlayer;
var OpponentPlayer;
var finalPlayers;

var diceAudio = new Audio("sounds/TunePocket-Rolling-Dice-Preview.mp3");



//----------------------------------START GAME-------------------------------------------

 // Set Players'images
 setPlayers();
// Capture number of Times to Play
gameCount = Number($('#counter-select').text());


// Activate Play Button
$('#'+selectedPlayer.PlayerId).on("click", function(){
    diceAudio.play(); 
    play(selectedPlayer,OpponentPlayer);
});


$('#'+OpponentPlayer.PlayerId).on("click", function(){
    diceAudio.play(); 
    play(OpponentPlayer,selectedPlayer);
});



// ---------------------------------Defined Functions---------------------------------

function setPlayers(){
    const sPlayerNo = Number($('.players-L').text().slice(6,$('.players-L').text().length))-1;
    const opponentNo = Number($('.players-R').text().slice(6,$('.players-R').text().length))-1;

    splayerId = 'p-'+(sPlayerNo+1);
    
    splayerDice = 'img'+(sPlayerNo+1);
    opponentId = 'p-'+(opponentNo+1);
    
    opponentDice = 'img'+(opponentNo+1);

    // set Images
    if (sPlayerNo===0){
        const sPlayerImage = "https://cdn-icons-png.flaticon.com/512/414"+sPlayerNo+"/4140048.png";
        const opponentImage = "https://cdn-icons-png.flaticon.com/512/456"+opponentNo+"/4561119.png";
        $('.img-comp-left').attr('src',sPlayerImage);
        $('.img-comp-right').attr('src',opponentImage);

        splayerName = $('.players-L').text();
        opponentName = $('.players-R').text(); 

        // Initialise Players: Player(PlayerId,PlayerName,ScoreBoardClass,DiceCalss)
        selectedPlayer = new Player(splayerId,splayerName,'score-board-left',splayerDice);
        OpponentPlayer = new Player(opponentId,opponentName,'score-board-right',opponentDice);
    }else{
        var sPlayerImage = "https://cdn-icons-png.flaticon.com/512/456"+sPlayerNo+"/4561119.png";
        var opponentImage = "https://cdn-icons-png.flaticon.com/512/414"+opponentNo+"/4140048.png";
        $('.img-comp-right').attr('src',opponentImage);
        $('.img-comp-left').attr('src',sPlayerImage);
        splayerName = $('.players-R').text();
        opponentName = $('.players-L').text();

        // Initialise Players: Player(PlayerId,PlayerName,ScoreBoardClass,DiceCalss)
        selectedPlayer = new Player(splayerId,splayerName,'score-board-right',splayerDice);
        OpponentPlayer = new Player(opponentId,opponentName,'score-board-left',opponentDice);
    }
}


function play (player, opponent){
    $('.'+player.DiceCalss).fadeOut();
    $('.'+player.DiceCalss).fadeIn();
    
    if (gameCount>0){

        if ((opponent.Played===true || (player.Played===false && opponent.Played===false))){

            var randomNumber = Math.floor(Math.random()*6 + 1);
            player.CummulativePoint+=randomNumber;
            
            results(player.DiceCalss,randomNumber,player.CummulativePoint, player.ScoreBoardClass);
        
            player.NumOfPlay+=1;
            player.Played = true;
            opponent.Played = false;
            compareResultsBackgroundColor(player, opponent);

        }else if (opponent.Played === false){
            window.alert("It is not your turn to play")
        };
                
    // Remove emoji hand from active player
    $('#'+player.PlayerId).css("visibility","hidden");
    // Add emoji hand to inactive player 
    $('#'+opponent.PlayerId).css("visibility","visible");
    if (opponent.DiceCalss==='img2'){
        $('#'+opponent.PlayerId).text(opponent.PlayerName + ' 👈');
    }else{
        $('#'+opponent.PlayerId).text('👉 '+ opponent.PlayerName);
    }
    
    gameOver(player,opponent);
    
    }else if (gameCount===0){
        gameOverAlert();
    }
}


function results(DiceImgClass,randNum,points, sboard){
    $('.'+DiceImgClass).attr("src","images/dice"+randNum+".png");
    $('.'+sboard).children('h4').text(THROW + randNum);
    $('.'+sboard).children('h3').text(CUM + points);
    
    gameCount-=1;
    $('#counter-select').text(gameCount);
    
}


function compareResultsBackgroundColor(player, opponent){
    len = $('.'+opponent.ScoreBoardClass).children('h3').text().length;
    // window.alert(activePlayerCum + " : " + Number($('.'+opponent.scoreBoardClass).children('h3').text().slice(CUM.length,len)));
    if (player.CummulativePoint > Number($('.'+opponent.ScoreBoardClass).children('h3').text().slice(CUM.length,len))) {
        $('.'+player.ScoreBoardClass).children('h3').css("background-color","green");
        $('.'+opponent.ScoreBoardClass).children('h3').css("background-color","red");
    }else if (player.CummulativePoint === Number($('.'+opponent.ScoreBoardClass).children('h3').text().slice(CUM.length,len))){
        $('.'+player.ScoreBoardClass).children('h3').css("background-color","yellow");
        $('.'+opponent.ScoreBoardClass).children('h3').css("background-color","yellow");

        $('.'+player.ScoreBoardClass).children('h3').css("color","black");
        $('.'+opponent.ScoreBoardClass).children('h3').css("color","black");

    }
     else {
        $('.'+player.ScoreBoardClass).children('h3').css("background-color","red");
        $('.'+opponent.ScoreBoardClass).children('h3').css("background-color","green");
    };
}


async  function gameOver(player,opponent){
    
    if (gameCount===0){
        $('#counter-select').text("");
        $('#counter').text("Count "+gameCount);
                
        if (player.CummulativePoint>opponent.CummulativePoint){
            $("#winner").text(player.PlayerName+" Wins with "+player.CummulativePoint+" Points");
        } else if (player.CummulativePoint<opponent.CummulativePoint){
            $("#winner").text(opponent.PlayerName+" Wins with "+opponent.CummulativePoint+" Points");
        }else{
            $("#winner").text("There is a draw of "+player.CummulativePoint+" Points each");
        }
        $("#winner").css("margin-bottom","3px");
        $("#winner").css("font-family","san-serif");
        $("#winner").css("font-size","2em");
        $("#winner").css("height","4em");
        $('#counter').css("font-family","san-serif");
        await sleep(1000);
        gameOverAlert();
    };
    
}


function gameOverAlert(){
    const gameOverAudio = new Audio("sounds/Game-over-sound.mp3");
    
    $('#counter').html("<b>Game Over! <br> Restart! </b>");
    $('#counter').css("color","red");
    $('#counter').css("font-size","3rem");

    $('#counter').css("width","40%");
    $('#counter').css("height","3%");
    $('#counter').css("margin","auto");
    $('.dice').slideUp();
    $('.score-board').css("position","relative");
    $('.score-board').css("width","15%");

    $('.score-board-left').css("left","0%");
    $('.score-board-left').css("margin-right","4em");
    $('.score-board-left').css("margin-left","4em");
    $('.score-board-right').css("right","0%");

    gameOverAudio.play();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


// Player Constructor
function Player(PlayerId,PlayerName,ScoreBoardClass,DiceCalss){
    this.PlayerId = PlayerId;
    this.PlayerName = PlayerName;
    this.Played = false;
    this.ScoreBoardClass = ScoreBoardClass;
    this.CummulativePoint = 0;
    this.NumOfPlay = 0;
    this.DiceCalss = DiceCalss;
    this.setOpponent = function(opponent){
        this.Opponent = opponent;
    }}