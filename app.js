const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {Schema} = mongoose;

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/exampleDB")
.then(() => console.log('connected!'))
.catch((e) => console.log(e));

// Step 1 Defining a Model
const studentSchema = new Schema({
    name: String,
    // age: Number,
    age: { type: Number, min: [0, "年齡不能小於0歲"]}, // Step 5
    major: String,
    scholarship: {
        merit: Number,
        other: Number
    }
});

// Step 2 Auto create a database named exampleDB Begin:
const Student = mongoose.model("Student", studentSchema);

// // Step 3 Create a record 
// const newObject = new Student({
//     name: "Esther",
//     age: 27,
//     major: "Mathematics",
//     scholarship: {
//         merit: 6000,
//         other: 7000
//     }
// });
// newObject.save().then(saveObject => {
//     if (saveObject === newObject) {
//         console.log("資料已經儲存完畢，儲存的資料是：");
//         console.log(saveObject);
//     }
// }).catch((e) => {
//     console.log(e.message);
// });

// // Step 5 Create a record for test filter
// const newObject = new Student({
//     name: "Wilson",
//     age: -10,
//     major: "Computer Sciense",
//     scholarship: {
//         merit: 5000,
//         other: 2000
//     }
// });
// newObject.save().then(saveObject => {
//     if (saveObject === newObject) {
//         console.log("資料已經儲存完畢，儲存的資料是：");
//         console.log(saveObject);
//     }
// }).catch((e) => {
//     console.log(e.message);
// });

// // Step 3 Read records
// Student.find({}).exec()
// .then((data) => {
//     console.log(data);
// }).catch((e) => {
//    console.log(e); 
// });

// // Step 3 Read records with async
// async function findStudent() {
//     try {
//         let data = await Student.find().exec();
//         console.log(data);
//     } catch (e) {
//         console.log(e);
//     }
// };

// // Step 4 Update a record
// Student.updateOne({name:"Esther"}, {name:"Esther Lam"}).exec()
// .then((msg) => {
//     console.log(msg);
// })
// .catch((e) => {
//     console.log(e);
// });


// // Step 6 Update a record by filter
// Student.updateOne({name:"Esther Lam"}, {age: 27}, {runValidators: true, new: true}).exec()
// .then((msg) => {
//     console.log(msg);
// })
// .catch((e) => {
//     console.log(e);
// });{

Student.findOneAndUpdate(
    {name: "Grace Xie"}, 
    {name: "Grace"}, 
    {runValidators: true, new: false}
).exec().then(newData => {
    console.log(newData);
}).catch(e => console.log(e));


app.get("/", async (req, res) => {
    try {
        let data = await Student.find().exec();
        // let data = await Student.find({name: "Lionel Chun"}).exec();
        res.send(data);
    } catch (e) {
        res.send(e.message);
    }
    
});

app.listen(3000, () => {
    console.log("伺服器正在耹聽port 3000...")
});