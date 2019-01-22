
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const jsdom = require("jsdom");
const request = require("request");
const path = require("path");

const app = express();
var htmlSource = fs.readFileSync("signup.html", "utf8");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lname;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields:{
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us20.api.mailchimp.com/3.0/lists/8abf816825",
    method: "POST",
    headers: {
      "Autorization": "Omzlaw 24bbe3684368229796df8bdb4a3fc1cf-us20"
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname+"/failure.html");
    } else {
      if (response.statusCode === 200){
        res.sendFile(__dirname +"/success.html");
      }else{
        res.sendFile(__dirname +"/failure.html");
      }
    }

  })
});


app.post("/failure", function(req, res){
  res.redirect("/");
});









app.listen(process.env.PORT || 3000 , function() {
  console.log("Server is running on port 3000");
})

// 0fa4e2e3f3a13f34b6e762f15f0d0b9d-us20

// list id
// 8abf816825
