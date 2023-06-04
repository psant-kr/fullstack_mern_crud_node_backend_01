const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/demo');
    console.log("db connected")
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
// schema can be made in other file
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
// model is important, only schema can not do any
// schema to class is called model
const User = mongoose.model('User', userSchema);

const server = express();
// middlewares
server.use(cors());
// here req is getting the data but not able to read the data, use body-parser
server.use(bodyParser.json())

// now api making
//CRUD-create is with post
server.post('/demo', async (req, res) => {
    // now making new object with the help of class
    // only when data is created in that case only we need to make a onject
    let user = new User();
    // object.key_in_schema=received data.sent_name from frontend
    user.username = req.body.username;
    user.password = req.body.password;
    const doc = await user.save();
    // in nosql record is called doc, so we just named it doc
    console.log(doc);
    res.json(doc);
})

//Read
server.get('/demo', async (req, res) => {
    // here no condition , so empty object
    const docs = await User.find({});
    res.json(docs);
})
//DELETE
server.delete('/demo/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log(req.params.userId);
    const user = await User.findByIdAndRemove({ _id: userId });
    console.log(user)
    res.send(user)

})
//Update
server.put('/demo/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log(req.params.userId);
    console.log(req.body);

    const user = await User.findByIdAndUpdate({ _id: userId }, req.body);
    res.send(user)

})

// server is a ever running process
server.listen(8080, () => {
    console.log("server started");
})