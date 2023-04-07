// ---------------------------CREATE MODULES(REQUIRES)------------------------------
const express = require("express");
const bodyParser = require("body-parser");


// ---------------------------INITIALISE APP-------------------------------
const app = express();
let gameCount;
let meassages = [];
const erorMessage = function (m){
    return m
};
const port= process.env.PORT || 3000;

// ---------------INITIALISE BODY PARSER / STATIC FILES-------------------
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'))

// --------------------SET HTML TEMPLATE WITH EJS ------------------------
app.set('view engine', 'ejs');



// -------------------------------CREATE ROUTES----------------------------
//Game Route
// push data to home browser
app.get("/",function(req, res){
    if (meassages.length === 0 ) {
      res.render("index",{
        message: 0
      })  
    }else{
        res.render("index",{
            message: meassages[0]
        })
    }
    

});

// dice-gamereceive post from home browser and add to lists
app.post("/", function(req, res){
    console.log();

    if (req.body.selectPlayer === 'player'){
        meassages.push(erorMessage("Enter required Fields"));
    }

    finalPlayers = [];
    const Allplayers = [1,2];
    const count = Number(req.body.count);
    const sPlayer = Number(req.body.selectPlayer);
    const secondPlayer = Allplayers.filter(function(p){return p !== sPlayer})[0];
    

    

    if (count>0 && sPlayer > 0){
        finalPlayers.push(sPlayer);
        finalPlayers.push(secondPlayer);
        gameCount = count;
        res.redirect("/dice-game");
    }else {
        res.redirect("/");
    }   

})



// push data to dice-game browser
app.get("/dice-game",function(req, res){

    

    

    if (finalPlayers[0]===1){

        res.render("dice-game",{
            scoreBoardTitleLeft: "Player " + finalPlayers[0] + " Score",
            playCounter: gameCount,
            leftPlayer:"Player " + finalPlayers[0],
            rightPlayer:"Player " + finalPlayers[1],
            scoreBoardTitleRight: "Player " + finalPlayers[1] + " Score"
        }
            );
    

            }else{
                res.render("dice-game",{
                    scoreBoardTitleRight: "Player " + finalPlayers[1] + " Score",
                    playCounter: gameCount,
                    rightPlayer:"Player " + finalPlayers[1],
                    leftPlayer:"Player " + finalPlayers[0],
                    scoreBoardTitleLeft: "Player " + finalPlayers[0] + " Score"
                }
            
                    );
            }
});



// -------------------------CREATE AND LISTEN ON PORT----------------------


app.listen(port, function(){
    console.log("Listening on port " + port);
});