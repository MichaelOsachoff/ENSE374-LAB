const express = require ( "express" );

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 


// a common localhost test port
const port = 3001; 

// Simple server operation
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.post("/", (req, res) => {
if((req.body.email === 'username')&&(req.body.password === 'password'))
{
    res.sendFile(__dirname + "/index.html");
}
else
{
    res.redirect("/");
    console.log("Not sent");
}
});

app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://localhost:${port}`);
});