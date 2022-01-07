const express = require ( "express" );

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 
const { render } = require("ejs");
// a common localhost test port
const port = 3002; 

app.use(express.static(__dirname + "/public", {
    index: false, 
    immutable: true, 
    cacheControl: true,
    maxAge: "30d"
}));

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
    res.sendFile( __dirname + "/login.html" );
});

app.get( "/index", async( req, res ) => {
    console.log( "A user is accessing the reviews route using get, and found the following:" );
    try {
        const users = await Users.find();
        const tasks = await Tasks.find();
        console.log( users );
        console.log( tasks );
        res.render( "index", { users: users, tasks:tasks });
    } catch ( error ) {
        console.log( error );
    }
});


// save into the database on post
app.post( "/Signup", ( req, res ) => {

    console.log( "A user is Signing up" );
    console.log( req.body )

    const user = new Users({
        username:   req.body.email,
        password:   req.body.password,
    });

    user.save();

    res.redirect( "/index" )
});

app.post("/Logout", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.post("/addTask", (req, res) => { 

    console.log( "A user adding a task" );
    console.log( req.body )

    const task = new Tasks({
        username:   req.body.email,
        password:   req.body.password,
    });

    task.save();

    res.redirect( "/index" )
});

const mongoose = require( "mongoose" );
const { stringify } = require("querystring");
// connect to mongoose on port 27017
mongoose.connect( "mongodb://localhost:27017/games", 
                { useNewUrlParser: true, 
                  useUnifiedTopology: true});

// create a mongoose schema for a game

const userSchema = new mongoose.Schema ({
    username:   String,
    password:   String,
});

const taskSchema = new mongoose.Schema ({
    inputText:   String,
    state:      String,
    creator:    String,
    isTaskClaimed: Boolean,
    claimingUser: String,
    isTaskDone: Boolean,
    isTaskCleared: Boolean,
});

const Users = mongoose.model ("Users", userSchema);

const Tasks = mongoose.model ("Tasks", taskSchema);

const user1 = new Users({
    username:   "username",
    password:   "password",
});
user1.save();
const user2 = new Users({
    username:   "Michael",
    password:   "password",
});
user2.save();
const user3 = new Users({
    username:   "Adam",
    password:   "password",
});
user3.save();

const task1 = new Tasks({

    inputText: "task1",
    state: "unclaimed",
    creator: "user1",
    isTaskClaimed: false,
    claimingUser: "",
    isTaskDone: false,
    isTaskCleared: false,
});
task1.save();
const task2 = new Tasks({

    inputText: "task2",
    state: "claimed",
    creator: "user1",
    isTaskClaimed: true,
    claimingUser: "user1",
    isTaskDone: false,
    isTaskCleared: false,
});
task2.save();
const task3 = new Tasks({

    inputText: "task3",
    state: "claimed",
    creator: "user1",
    isTaskClaimed: true,
    claimingUser: "user2",
    isTaskDone: false,
    isTaskCleared: false,
});
task3.save();
const task4 = new Tasks({

    inputText: "task4",
    state: "finished",
    creator: "user1",
    isTaskClaimed: true,
    claimingUser: "user1",
    isTaskDone: true,
    isTaskCleared: false,
});
task4.save();
const task5 = new Tasks({

    inputText: "task5",
    state: "finished",
    creator: "user1",
    isTaskClaimed: true,
    claimingUser: "user2",
    isTaskDone: true,
    isTaskCleared: false,
});
task5.save();