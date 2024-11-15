const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {Schema} = mongoose;

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/exampleDB")
.then(() => console.log('connected!'))
.catch((e) => console.log(e));

////// CRUD Begin

// Step 1 Defining a Model with filter
const studentSchema = new Schema({
    name: String,
    // age: Number,
    age: { type: Number, min: [0, "年齡不能小於0歲"]},
    major: String,
    scholarship: {
        merit: Number,
        other: Number
    }
});

// Step 2 Automatically create a database named exampleDB if it does not exist.
const Student = mongoose.model("Student", studentSchema);

app.get("/create1", async (req, res) => {
    // Step 3 Create a record 
    const newObject = new Student({
        name: "Esther",
        age: 27,
        major: "Mathematics",
        scholarship: {
            merit: 6000,
            other: 7000
        }
    });
    newObject.save().then(saveObject => {
        if (saveObject === newObject) {
            console.log("資料已經儲存完畢，儲存的資料是：");
            console.log(saveObject);
            res.send(saveObject);
        }
    }).catch((e) => {
        console.log(e.message);
        res.send(e.message);
    });
});

app.get("/create2", async (req, res) => {
    // Step 6 Create a record for test filter
    let setAge = -10;
    console.log(req);
    if (typeof req.query.age != "undefined") {
        setAge = req.query.age;
    }
    const newObject = new Student({
        name: "Wilson",
        age: setAge,
        major: "Computer Sciense",
        scholarship: {
            merit: 5000,
            other: 2000
        }
    });
    newObject.save().then(saveObject => {
        if (saveObject === newObject) {
            console.log("資料已經儲存完畢，儲存的資料是：");
            console.log(saveObject);
            res.send(saveObject);
        }
    }).catch((e) => {
        console.log(e.message);
        res.send(e.message);
    });
});

app.get("/read1", (req, res) => {
    // Step 4 Read records
    Student.find({}).exec()
    .then((data) => {
        res.send(data);
    }).catch((e) => {
        res.send(e.message);
    });
});

app.get("/read2", (req, res) => {
    // Step 4 Read records with async
    async function findStudent() {
        try {
            let data = await Student.find().exec();
            res.send(data);
        } catch (e) {
            res.send(e.message);
        }
    };
    findStudent();
});

app.get("/read3", async (req, res) => {
    try {
        let data = await Student.find().exec();
        // let data = await Student.find({name: "Lionel Chun"}).exec();
        res.send(data);
    } catch (e) {
        res.send(e.message);
    }
});

app.get("/read4", async (req, res) => {
    Student.find({"scholarship.merit": {$gte: 5000}}).exec()
    .then((data) => {
        //res.send(data.length)
        let len = data.length;
        data.unshift({length:len});
        res.send(data);
        
    }).catch((e) => {
        res.send(e.message);
    });
});

app.get("/update1", (req, res) => {
    // Step 5 Update a record
    Student.updateOne({name:"Esther"}, {name:"Esther Lam"}).exec()
    .then((msg) => {
        res.send(msg);
    })
    .catch((e) => {
        res.send(e.message);
    });
});

app.get("/update2", (req, res) => {
    // Step 7 Update a record by filter
    
    Student.updateOne({name:"Esther Lam"}, {age: 27}, {runValidators: true, new: true}).exec()
    .then((msg) => {
        res.send(msg);
    })
    .catch((e) => {
        res.send(e.message);
    });
});

app.get("/update3", (req, res) => {
    // Step 7 {runValidators: true, new: true}
    Student.findOneAndUpdate(
        {name: "Grace"}, 
        {name: "Grace Xie"}, 
        {runValidators: true, new: true}
    ).exec().then(newData => {
        console.log(newData);
        res.send(newData);
    }).catch(e => {
        console.log(e);
        res.send(e.message);
    });
});

app.get("/update4", (req, res) => {
    // Step 7 {runValidators: true, new: false}
    Student.findOneAndUpdate(
        {name: "Grace Xie"}, 
        {name: "Grace"}, 
        {runValidators: true, new: false}
    ).exec().then(newData => {
        console.log(newData);
        res.send(newData);
    }).catch(e => {
        console.log(e);
        res.send(e.message);
    });
});

app.get("/delete1", (req, res) => {
    
    Student.deleteOne({name:"Wilson"}).exec()
    .then((msg) => {
        res.send(msg);
    })
    .catch((e) => {
        res.send(e.message);
    });
});
////// CRUD End


//// Schema Validators Begin

// Define a schema using filters and create an object called studentSchema2.
const studentSchema2 = new Schema({
    name: {type: String, required: true},
    age: { type: Number, min: [0, "年齡不能小於0歲"]},
    major: {type: String, required: [true, "每個學生都需要選至少一個主修"]},
    scholarship: {
        merit: Number,
        other: Number
    }
});


// Automatically create a database named exampleDB if it does not exist.
const Student2 = mongoose.model("Student2", studentSchema2);

app.get("/create3", async (req, res) => {

    const newObject2 = new Student2({
        name: "Wilson",
        age: 27,
        // major: "Computer Sciense",
        scholarship: {
            merit: 3000,
            other: 2000
        }
    });
    newObject2.save().then(saveObject => {
        if (saveObject === newObject2) {
            console.log("資料已經儲存完畢，儲存的資料是：");
            console.log(saveObject);
            res.send(saveObject);
        }
    }).catch((e) => {
        console.log(e.message);
        res.send(e.message);
    });
});

// Define a schema using filters and create an object called studentSchema3.
const studentSchema3 = new Schema({
    name: {type: String, required: true},
    age: { type: Number, min: [0, "年齡不能小於0歲"]},
    major: {type: String, required: [true, "每個學生都需要選至少一個主修"]},
    scholarship: {
        merit: {type: Number, max: [3000, "獎學金不得大於3000"]},
        other: Number
    }
});

// Automatically create a database named exampleDB if it does not exist.
const Student3 = mongoose.model("Student3", studentSchema3);

app.get("/create4", async (req, res) => {

    const newObject3 = new Student3({
        name: "Wilson",
        age: 27,
        major: "Computer Sciense",
        scholarship: {
            merit: 3000,
            other: 2000
        }
    });
    newObject3.save().then(saveObject => {
        if (saveObject === newObject3) {
            console.log("資料已經儲存完畢，儲存的資料是：");
            console.log(saveObject);
            res.send(saveObject);
        }
    }).catch((e) => {
        console.log(e.message);
        res.send(e.message);
    });
});

// Define a schema using filters and create an object called studentSchema4.
const studentSchema4 = new Schema({
    name: {type: String, required: true},
    age: { type: Number, min: [0, "年齡不能小於0歲"]},
    major: {type: String, required: [true, "每個學生都需要選至少一個主修"]},
    scholarship: {
        merit: {type: Number, default: 0},
        other: {type: Number, default: 0}
    }
});

// Automatically create a database named exampleDB if it does not exist.
const Student4 = mongoose.model("Student4", studentSchema4);

app.get("/create5", async (req, res) => {

    const newObject4 = new Student4({
        name: "Wilson",
        age: 27,
        major: "Computer Sciense",
        // scholarship: {
        //     merit: 3000,
        //     other: 2000
        // }
    });
    newObject4.save().then(saveObject => {
        if (saveObject === newObject4) {
            console.log("資料已經儲存完畢，儲存的資料是：");
            console.log(saveObject);
            res.send(saveObject);
        }
    }).catch((e) => {
        console.log(e.message);
        res.send(e.message);
    });
});

// Define a schema using filters and create an object called studentSchema4.
const studentSchema5 = new Schema({
    name: {type: String, required: true, maxlength: 25},
    age: { type: Number, min: [0, "年齡不能小於0歲"]},
    major: {type: String, required: [true, "每個學生都需要選至少一個主修"],
        enum: ["Chemistry", "Computer Science", "Mathematiccs", "Civil Engineering"]
    },
        
    scholarship: {
        merit: {type: Number, default: 0},
        other: {type: Number, default: 0}
    }
},
// read5
{
    methods: {
        printTotalScholarship() {
            return this.scholarship.merit + this.scholarship.other;
        }
    }
});

// Automatically create a database named exampleDB if it does not exist.
const Student5 = mongoose.model("Student5", studentSchema5);

app.get("/create6", async (req, res) => {

    const newObject5 = new Student5({
        name: "WilsonWilsonWilsonWilsonWilson",
        age: 27,
        major: "English",
        // scholarship: {
        //     merit: 3000,
        //     other: 2000
        // }
    });
    newObject5.save().then(saveObject => {
        if (saveObject === newObject5) {
            console.log("資料已經儲存完畢，儲存的資料是：");
            console.log(saveObject);
            res.send(saveObject);
        }
    }).catch((e) => {
        console.log(e.message);
        res.send(e.message);
    });
});

app.get("/read5", async (req, res) => {

    Student5.find({}).exec()
    .then((arr, str) => {
        arr.forEach(student => {
            str = student.name + "的總獎學金金額是" + student.printTotalScholarship();
        });
        res.send(str);
    }).catch((e) => {
        res.send(e.message);
    });
});
//// Schema Validators End


app.get("/", async (req, res) => {
    
    res.setHeader('content-type', 'text/html;charset=utf-8');
    res.write('<h1>Mongoose</h1>');
    res.write('<h2>CRUD</h2>')
    res.write('<p><a href="/create1">create1</a></p>');
    res.write('<p><a href="/create2">create2</a></p>');
    res.write('<p><a href="/create2?age=100">create2?age=100</a></p>');
    res.write('<p><a href="/read1">read1</a></p>');
    res.write('<p><a href="/read2">read2</a></p>');
    res.write('<p><a href="/read3">read3</a></p>');
    res.write('<p><a href="/read4">read4</a></p>');
    res.write('<p><a href="/update1">update1</a></p>');
    res.write('<p><a href="/update2">update2</a></p>');
    res.write('<p><a href="/update3">update3</a> or <a href="/update4">update4</a></p>');
    res.write('<p><a href="/delete1">delete1</a></p>');
    res.write('<h2>Schema Validators</h2>')
    res.write('<p><a href="/create3">create3</a></p>');
    res.write('<p><a href="/create4">create4</a></p>');
    res.write('<p><a href="/create5">create5</a></p>');
    res.write('<p><a href="/read5">read5</a></p>');
    res.end('再見');
});

app.listen(3000, () => {
    console.log("伺服器正在耹聽port 3000...")
});