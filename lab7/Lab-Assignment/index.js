const fs = require("fs");
var userListFromJSON = JSON.parse(fs.readFileSync("listUsers.json"));
var taskListFromJSON = JSON.parse(fs.readFileSync("listTasks.json"));

const express = require ( "express" );
const { render } = require("ejs");

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 

// a common localhost test port
const port = 3001; 

// Simple server operation
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

var currentUser = "default";
app.post("/Login", (req, res) => {
    var inputEmail = req.body.email;
    var inputPassword = req.body.password;
    var wasLoggedIn = false;

    userListFromJSON.userList.forEach(element => {
        if(element.username === inputEmail && element.password === inputPassword)
        {
            wasLoggedIn = true;
            currentUser = inputEmail;
            renderPage(res);
        }
    })   
    if(!wasLoggedIn)
    {
        console.log("Login failed");
        res.redirect("/")
    }
});

app.post("/Signup", (req, res) => {
    var inputEmail = req.body.email;
    var inputPassword = req.body.password;
    var inputAuthentication = req.body.authentication;
    var isNew = true;
    const authentication = "todo2021";

    if(inputAuthentication === authentication)
    {
        userListFromJSON.userList.forEach(element => {
            if(element.username === inputEmail)
            {
                isNew = false; 
                res.redirect("/")
            }
        })
        if(isNew)
        {
            userListFromJSON.userList.push({"username":inputEmail, "password":inputPassword});
            console.log(userListFromJSON);
            fs.writeFile("listUsers.json", JSON.stringify(userListFromJSON), function(err){if(err){console.log("User write didn't work");}});
            currentUser = inputEmail;
            renderPage(res);
        }
        else
        {
            console.log("User already exists");
        }
    }
});

app.post("/Logout", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

var IDcounter = taskListFromJSON.taskList.length;
app.post("/addTask", (req, res) => {
    var _id = IDcounter;
    var inputText = req.body.textBox;
    var state = "unclaimed";
    var creator = currentUser;
    var isTaskClaimed = false;
    var claimingUser = "";
    var isTaskDone = false;
    var isTaskCleared = false;

    var task = {_id, inputText, state, creator, isTaskClaimed, claimingUser, isTaskDone, isTaskCleared};
    IDcounter++;
    taskListFromJSON.taskList.push(task);
    console.log(taskListFromJSON);
    fs.writeFile("listTasks.json", JSON.stringify(taskListFromJSON), function(err){if(err){console.log("Task write didn't work");}});
    renderPage(res);
});

app.post("/claim", (req, res) => {
    var foundId = req.body.hiddenElement;
    taskListFromJSON.taskList.forEach(task=> {
        if(task._id == foundId)
        {
            task.state="claimed";
            task.isTaskClaimed = true;
            task.claimingUser = currentUser;
        }
    })
    fs.writeFile("listTasks.json", JSON.stringify(taskListFromJSON), function(err){if(err){console.log("Claim write didn't work");}});
    renderPage(res);
});

app.post("/Abandon", (req, res) => {
    var foundId = req.body.hiddenElement;
    taskListFromJSON.taskList.forEach((task)=> {
        if(task._id == foundId)
        {
            if(req.body.taskCheckBox === "true")
            {
                task.state="finished";
                task.isTaskDone=true;
            }
            else
            {
                task.state="unclaimed";
                task.isTaskClaimed = false;
                task.claimingUser = null;
            }
        }
    })
    fs.writeFile("listTasks.json", JSON.stringify(taskListFromJSON), function(err){if(err){console.log("Abandon write didn't work");}});
    renderPage(res);
});
app.post("/uncheck", (req,res) => {
    var foundId = req.body.hiddenElement;
    taskListFromJSON.taskList.forEach((task)=> {
        if(task._id == foundId)
        {
                task.state="claimed";
                task.isTaskDone=false;
                task.claimingUser = currentUser;
        }
    })
    fs.writeFile("listTasks.json", JSON.stringify(taskListFromJSON), function(err){if(err){console.log("Abandon write didn't work");}});
    renderPage(res);
});

app.post("/removeTasks", (req, res) => {
    for(var i = 0; i < taskListFromJSON.taskList.length;i++)
    {
        if(taskListFromJSON.taskList[i].isTaskDone)
        {
            taskListFromJSON.taskList[i].isTaskCleared = true;
            taskListFromJSON.taskList[i].state = "cleared";
            taskListFromJSON.taskList.splice(i,1);
            i--;
        }
    }
    console.log("Removed completed tasks");
    fs.writeFile("listTasks.json", JSON.stringify(taskListFromJSON), function(err){if(err){console.log("Remove tasks write didn't work");}});
    renderPage(res);
});

function renderPage(res)
{
    res.render("index",{username:currentUser, taskList:taskListFromJSON.taskList});
    return;
}

app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://localhost:${port}`);
});
