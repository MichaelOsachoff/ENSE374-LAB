const express = require ( "express" );

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 
// a common localhost test port
const port = 3000; 

// body-parser is now built into express!
app.use( express.urlencoded({ extended: true }) ); 
app.set( "view engine", "ejs" );

// Simple server operation
app.listen ( port, () => {
    // template literal
    console.log ( `Server is running on http://localhost:${port}` );
});

app.get( "/", ( req, res ) => {
    console.log( "A user is accessing the root route using get" );
    res.sendFile( __dirname + "/index.html" );
});

app.get( "/reviews", async( req, res ) => {
    console.log( "A user is accessing the reviews route using get, and found the following:" );
    try {
        const results = await Game.find();
        console.log( results );
        res.render( "reviews", { results: results });
    } catch ( error ) {
        console.log( error );
    }
});


// save into the database on post
app.post( "/submit", ( req, res ) => {

    console.log( "A user is posting the following review" );
    console.log( req.body )

    const game = new Game({
        userName:   req.body.userName,
        gameName:   req.body.gameName,
        score:      parseInt( req.body.score ),
        reviewText: req.body.reviewText
    });

    game.save();

    res.redirect( "/reviews" )
});

const mongoose = require( "mongoose" );
// connect to mongoose on port 27017
mongoose.connect( "mongodb://localhost:27017/games", 
                { useNewUrlParser: true, 
                  useUnifiedTopology: true});

// create a mongoose schema for a game
const gameSchema = new mongoose.Schema ({
    userName:   String,
    gameName:   String,
    score:      Number,
    reviewText: String
});

const Game = mongoose.model ( "Game", gameSchema );
