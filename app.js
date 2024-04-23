const express = require('express');
require('./db/conn');
const userModel = require('./models/usermodel');
const { name } = require('ejs');
const port = 3000
const app = express()
app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//& Home Page
app.get('/',(req,res)=>{
    res.render('home')
})
//~ Create Page
app.get('/create',(req,res)=>{
    const { name, username, email } = req.query;
    // Render the create.ejs template with user data
    res.render('create', { name, username, email });
})
//~ Create Page POST Route
app.post('/api/create', async (req, res) => {
    try {
        let createUser = await userModel.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email
        });
        res.redirect(`/create?name=${createUser.name}&username=${createUser.username}&email=${createUser.email}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
});
//* Read Page
app.get('/read',(req,res)=>{
    const {name,username,email} = req.query
    res.render('read',{ name, username, email })
})
//* Read Page POST
app.post('/api/read', async (req,res)=>{
    try{
        let readUser = await userModel.findOne({
            $or: [
            { username: req.body.username },
            { email: req.body.email }
            ]
        });
        if (readUser) {
            res.redirect(`/read?name=${readUser.name}&username=${readUser.username}&email=${readUser.email}`);
        } else {
            // If user not found, redirect to /read without data
            res.redirect('/read');
        }
    }
    catch(err){
        console.error(err);
        res.status(500).send('Error Read user');
    }
})
//^ Update Page
app.get('/update',(req,res)=>{
    res.render('update')
})
//! Delete Page
app.get('/delete',(req,res)=>{
    res.render('delete')
})

app.listen(port,()=>{
    console.log(`port running on ${port}`);
})