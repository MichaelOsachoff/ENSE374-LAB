const express  = require( "express" );
const mongoose = require( "mongoose" );

// 1. Require dependencies /////////////////////////////////////////
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose");
const { render } = require("ejs");
require("dotenv").config();
////////////////////////////////////////////////////////////////////

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 
// a common localhost test port
const port = 3001; 

// body-parser is now built into express!
app.use( express.urlencoded( { extended: true} ) ); 

app.use(express.static('public'))//Css page won't work without it

// 2. Create a session. The secret is used to sign the session ID.
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use (passport.initialize());
app.use (passport.session());
////////////////////////////////////////////////////////////////////


app.set( "view engine", "ejs" );

// connect to mongoose on port 27017
mongoose.connect( 'mongodb://localhost:27017/tasks', 
                 { useNewUrlParser: true, useUnifiedTopology: true });

// 3. Create the userSchema ////////////////////////////////////////
const userSchema = new mongoose.Schema ({
    username: String,
    password: String
})

// plugins extend Schema functionality
userSchema.plugin(passportLocalMongoose);

const Users = new mongoose.model("Users", userSchema);
////////////////////////////////////////////////////////////////////

const taskSchema = new mongoose.Schema({
    _id: Number,
    inputText:   String,
    state:      String,
    creator:    String,
    isTaskClaimed: Boolean,
    claimingUser: String,
    isTaskDone: Boolean,
    isTaskCleared: Boolean,
});

const Tasks = new mongoose.model( "Task", taskSchema );

// 4. Add our strategy for using Passport, using the local user from MongoDB
passport.use(Users.createStrategy());

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());
////////////////////////////////////////////////////////////////////

//Fill database with starting things:
const user1 = new Users({
    username:   "username",
    password:   "password",
});
const user2 = new Users({
    username:   "Michael",
    password:   "password",
});
const user3 = new Users({
    username:   "Adam",
    password:   "password",
});

const task1 = new Tasks({
    _id: 1,
    inputText: "task1",
    state: "unclaimed",
    creator: "Adam",
    isTaskClaimed: false,
    claimingUser: "",
    isTaskDone: false,
    isTaskCleared: false,
});

const task2 = new Tasks({
    _id: 2,
    inputText: "task2",
    state: "claimed",
    creator: "Adam",
    isTaskClaimed: true,
    claimingUser: "Michael",
    isTaskDone: false,
    isTaskCleared: false,
});

const task3 = new Tasks({
    _id: 3,
    inputText: "task3",
    state: "claimed",
    creator: "Michael",
    isTaskClaimed: true,
    claimingUser: "Adam",
    isTaskDone: false,
    isTaskCleared: false,
});

const task4 = new Tasks({
    _id: 4,
    inputText: "task4",
    state: "finished",
    creator: "Adam",
    isTaskClaimed: true,
    claimingUser: "Adam",
    isTaskDone: true,
    isTaskCleared: false,
});

const task5 = new Tasks({
    _id: 5,
    inputText: "task5",
    state: "finished",
    creator: "Adam",
    isTaskClaimed: true,
    claimingUser: "Adam",
    isTaskDone: true,
    isTaskCleared: false,
});

// user1.save();
// user2.save();
// user3.save();
// task1.save();
// task2.save();
// task3.save();
// task4.save();
// task5.save();

// Simple server operation
app.listen ( port, () => {
    // template literal
    console.log ( `Server is running on http://localhost:${port}` );
});

// 5. Register a user with the following code, which needs to be in the appropriate route
// As in (3), be sure to use req.body.username and req.body.password, and ensure the 
// html forms match these values as well
app.post( "/register", (req, res) => {
    console.log( "User " + req.body.username + " is attempting to register" );
    Users.register({ username : req.body.username }, 
                    req.body.password, 
                    ( err, user ) => {
        if ( err ) {
        console.log( err );
            res.redirect( "/" );
        } else {
            passport.authenticate( "local" , {
                successRedirect: "/", 
                failureRedirect: "/",
                failureFlash: "Failed to register"
            });
        }
    });
});
////////////////////////////////////////////////////////////////////

// 6. Log in users on the login route //////////////////////////////
app.post( "/login", ( req, res ) => {
    console.log( "User " + req.body.username + " is attempting to log in" );
    const user = new Users ({
        username: req.body.username,
        password: req.body.password
    });
    req.login ( user, ( err ) => {
        if ( err ) {
            console.log( err );
            res.redirect( "/" );
        } else {
            passport.authenticate( "local" , {
                successRedirect: renderPage(req,res), 
                failureRedirect: "/"
            });
        }
    });
});
////////////////////////////////////////////////////////////////////

app.get( "/", ( req, res ) => {
    console.log( "A user is accessing the root route using get" );
    res.sendFile( __dirname + "/index.html" );
});

async function findUniqueID()
{
    var currentID = 0;
    let idsOfTasks = await Tasks.find().distinct("_id");
    idsOfTasks.forEach(element => {
        if(parseInt(element)>=currentID)
        {
            currentID = parseInt(element)+1;
        }
    });
    return currentID;
}

// 7. Register get routes for reviews and add-review ///////////////
//Your code will replace this section!
app.post("/addTask", async (req, res) => {
    var uniqueID = await findUniqueID();
    console.log("Adding new task");
    const tempTask = new Tasks({
        _id: uniqueID,
        inputText: req.body.textBox,
        state:"unclaimed",
        creator: req.user.username,
        isTaskClaimed: false,
        claimingUser: null,
        isTaskDone: false,
        isTaskCleared: false,
    })
    console.log(tempTask);
    tempTask.save().then(() => {
        console.log("Task added successfully");
        renderPage(req, res);
    });
    return;
});

app.post("/claim", async (req, res) => {
    var hiddenId = req.body.hiddenElement;
    var currentUser = req.user.username;
    await Tasks.findOneAndUpdate(
        {_id:hiddenId},
        {state:"claimed",claimingUser:currentUser,isTaskClaimed:true}
    );
    renderPage(req, res);
    return;
});
app.post("/Abandon", async (req, res) => {
    var hiddenId = req.body.hiddenElement;
    console.log("task:"+req.body.taskCheckBox);
    if(req.body.taskCheckBox === "true")
    {
        console.log("Finished, id:"+hiddenId);
        await Tasks.findOneAndUpdate(
            {_id:hiddenId},
            {state:"finished",isTaskDone:true}
        );
    }
    else
    {
        console.log("Abandoned, id:"+hiddenId);
        await Tasks.findOneAndUpdate(
            {_id:hiddenId},
            {state:"unclaimed",claimingUser:null,isTaskClaimed:false}
        );
    }
    renderPage(req,res);
    return;
});
app.post("/uncheck", async (req, res) => {
    var hiddenId = req.body.hiddenElement;
    await Tasks.findOneAndUpdate(
        {_id:hiddenId},
        {state:"claimed",isTaskDone:false,isTaskClaimed:true}
    );
    renderPage(req,res);
    return;
});
app.post("/removeTasks", async (req, res) => {
    await Tasks.deleteMany({state:"finished"});
    renderPage(req,res);
    return;
});
    
////////////////////////////////////////////////////////////////////

// 8. Logout ///////////////////////////////////////////////////////
app.get( "/Logout", ( req, res ) => {
    console.log( "A user is logging out" );
    req.logout();
    res.redirect("/");
});

function renderPage(req,res)
{
    Tasks.find((err, tasks) => {
        if (err) 
        {
            console.log(err);
        } 
        else 
        {
            res.render("toDo", 
            {
                username: req.user.username,
                taskList: tasks,
            });
        }
    });
    return;
}