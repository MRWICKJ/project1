const express = require('express');
require('./db/conn');
const userModel = require('./models/usermodel');
const port = process.env.port || 3000;
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
    const {name,username,email} = req.query
    res.render('update',{name,username,email})
})
//^ Update Page POST
app.post('/api/update', async (req, res) => {
    try {
        const { oldEmail, newEmail } = req.body;
        
        const updateUser = await userModel.findOneAndUpdate(
            { email: oldEmail }, 
            { email: newEmail }, 
            { new: true }            
        );

        if (updateUser) {
            res.redirect(`/update?name=${updateUser.name}&username=${updateUser.username}&email=${updateUser.email}`);
        } else {
            res.redirect('/update');
        }
    } catch (err) {
        res.status(500).send("Some Error Occurred");
    }
});


//! Delete Page
app.get('/delete',(req,res)=>{
    const {name,username,email} = req.query;
    res.render('delete',{name,username,email});
})
//! Delete Page POST
app.post('/api/delete', async (req,res)=>{
    try{
        let deleteUser = await userModel.findOneAndDelete({username:req.body.username})
        if (deleteUser) {
            res.redirect(`/delete?name=${deleteUser.name}&username=${deleteUser.username}&email=${deleteUser.email}`);
        } else {
            res.redirect('/delete');
        }
    }catch(err){
        res.send("Some Error Occurs")
    }
})

app.listen(port,()=>{
    console.log(`port running on ${port}`);
})