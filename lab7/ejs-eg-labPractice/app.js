const express = require ( "express" );

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 
// host static resources
app.use(express.static("public"));
// body-parser is now built into express!
app.use(express.urlencoded({ extended: true})); 

// a common localhost test port
const port = 3000; 

// Simple server operation
app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

let fruits = ["apples", "orange", "peach", "mango", "updated"];

app.post("/", (req, res) => {
    res.render("greeting", {username: req.body["my-name"], 
                            fruitList: fruits});
});

app.set("view engine", "ejs");

app.get("/greeting", function (req, res) {
    res.render("greeting", {username: req.body["my-name"]})
});