// require modules
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const jsdom = require("jsdom");
const request = require("request");
const path = require("path");
// use express with app constant
const app = express();

// use bodyParser with express
app.use(bodyParser.urlencoded({
  extended: true
}));
// use command for public files e.g css
app.use(express.static("public"));
// GET handling for root page
app.get("/", function(req, res) {
  // Send a file back
  res.sendFile(__dirname + "/signup.html");
});

// Post handling grabbing the data entered in the form
app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lname;
  var email = req.body.email;
// setting uo the data for use with mailchimp api
  var headers = {
    'content-type': 'application/json'
};

var data = {"members": [{"email_address": email,
"status": "subscribed",
"merge_fields": {
  FNAME: firstName,
  LNAME: lastName
}

}]};
// options function for connecting to mailchimps api
var options = {
    url: 'https://us20.api.mailchimp.com/3.0/lists/8abf816825',
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
    auth: {
        'user': 'Omzlaw',
        'pass': '24bbe3684368229796df8bdb4a3fc1cf-us20'
    }
};

  // var data = {
  //   members: [{
  //     email_address: email,
  //     status: "subscribed",
  //     merge_fields:{
  //       FNAME: firstName,
  //       LNAME: lastName
  //     }
  //   }]
  // };
  //
  //
  // var jsonData = JSON.stringify(data);
  //
  // var options = {
  //   url: "https://us20.api.mailchimp.com/3.0/lists/8abf816825",
  //   method: "POST",
  //
  //
  //   headers:{
  //     "Authorization": "Omzlaw 24bbe3684368229796df8bdb4a3fc1cf-us20"
  //
  //   },
  //     body: jsonData,
  // };

// request function for handling api data, checking for errors or grabbing data
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

  });
});

// Post request for handling form in failure.html
app.post("/failure", function(req, res){
  res.redirect("/");
});







// Setting server to listen at port 3000
app.listen(process.env.PORT || 3000 , function() {
  console.log("Server is running on port 3000");
})
