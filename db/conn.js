const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Project1",{

}).then(()=>{
    console.log("Database connection Successful");
}).catch((err)=>{
    console.error("Error connecting to database:");
})