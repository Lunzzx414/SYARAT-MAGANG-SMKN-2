require("dotenv").config()
const { compile } = require("ejs")
const jswebtoken = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const express = require("express")
const db = require("better-sqlite3")("BackendTgs.db")
db.pragma("journal_mode = WAL")
const app = express()

//DB Setup Start Here
const CreateTables = db.transaction(() => {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS Users(
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Username STRING NOT NULL UNIQUE,
        Password STRING NOT NULL
        )
        `).run()

})

    CreateTables()
//DB Setup Ends Here
app.set("view engine", "ejs")
app.use(express.urlencoded({extended : false}))
app.use(express.static("public"))

app.use(function (req, res, next){
    res.locals.errors = [];
    next();
});

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.get("/homepage", (req, res) => {
    res.render("homepage")
})

app.post("/register", (req, res) => {
    const errors = []
    
    if (typeof req.body.username !== "string") req.body.username = "";
    if (typeof req.body.password !== "string") req.body.password = "";

    req.body.username = req.body.username.trim()

    if (!req.body.username) errors.push ("Enter Username")
    if (req.body.username && req.body.username.length < 3) errors.push ("Min 3 Char")
    if (req.body.username && req.body.username.length > 15) errors.push ("Max 10 Char")
    if (req.body.username && !req.body.username.match(/^[a-zA-Z0-9_]+$/)) errors.push ("Letters and Numbers Only")

    if (errors.length) {
        return res.render ("signup", {errors})
    
    } else {
       
    //Save Data
    const Salt = bcrypt.genSaltSync(10)
    req.body.password = bcrypt.hashSync(req.body.password, Salt)

    const InsertStatement = db.prepare("INSERT INTO Users (Username, Password) VALUES (?, ?)")
    const result = InsertStatement.run(req.body.username, req.body.password)

    const LookUpStatement = db.prepare("SELECT * FROM Users WHERE ROWID = ?")
    const OurUser = LookUpStatement.get(result.lastInsertRowid)
    //Cookies
    const TokenValue = jswebtoken.sign({exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, userid : OurUser.id, username : OurUser.username}, process.env.JWTOKENSECRET)

    res.cookie("SimpleCookie", TokenValue, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        //Calc In Milisecond
        maxAge: 1000 * 60 * 60 * 24 //One Day 
    })

    res.redirect("/homepage")
    }
})  


app.listen("3000", () => {
    console.log("Server's Up and Running");
});