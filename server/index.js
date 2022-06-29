const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const users = require('./routes/Users');
const pinRoute = require('./routes/Pins');
dotenv.config();
const app = express();
app.use(express.json());

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true,}).then(()=>{
    console.log('MongoDB is Connected');
}).catch((err)=>{
    console.log(err)
});

app.use('/api/user' , users);
app.use('/api/pins' , pinRoute);

app.listen(8080 , ()=>{
    console.log('listening from port 8080');
})