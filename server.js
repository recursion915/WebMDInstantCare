
var express = require('express');
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var bodyParser = require('body-parser');
var fs = require("fs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));
app.use("/",router);

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}
// To-Do: check the long, lat is within 1 mile
function inRadius (long, lat){
  return true;
}

app.post('/create_user', function(req,res){
  var postBody = req.body;
  var email_address = postBody.email_address;
  // console.log(email_address);
  var fs = require('fs');
  var dir = './user_file';
  var max_id = 0;
  // check if the directory exists
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  // read the dirctory files and get the max user_id
  var filenames = getFiles(dir);
  for(var i = 0; i < filenames.length; i++){
    var temp_id = filenames[i].match(/\d/g);
    if(temp_id != null){
      // join those numbers
      temp_id = temp_id.join("");
      temp_id = parseInt(temp_id);
      // console.log(temp_id);
    }
    if(temp_id > max_id){
      max_id = temp_id;
    }
  }

  // increment the user_id by one
  var user_id = max_id + 1;
  var file_name = dir + '/' + user_id + ".json";
  postBody.user_id = user_id;
  if (!fs.existsSync(file_name)){
    fs.writeFile(file_name, JSON.stringify(postBody), function (err) {
     if (err) return console.log(err);})
    res.status(200).send(""+user_id);
  }
  else{
    res.status(400).send('user_id exists, cannot create');
  }
  return;
});

app.post('/update_user', function(req,res){
  var postBody = req.body;
  var user_id = postBody.user_id;
  var file_name = './user_file/' + user_id + ".json";
  if (fs.existsSync(file_name)){
    fs.writeFile(file_name, JSON.stringify(postBody), function (err) {
     if (err) return console.log(err);})
     res.status(200).send('Updated!');
  }
  else{
    res.status(400).send('Come on, you dont have this user, create first');
  }
  return;
});

app.get('/get_user',function(req,res){
  // var user_id = req.params[0];
    var user_id = req.query.user_id;
    var email_address = req.query.email_address;
    if(user_id != null){
      var file_name = './user_file/' + user_id + ".json";
      if (fs.existsSync(file_name)){
        fs.readFile(file_name, 'utf8',function (err, data)  {
          if (err) throw err;
          var obj = JSON.parse(data);
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(JSON.stringify(obj));
        });
      }
      else{
        res.status(400).send('User not exists');
      }
    }
    if(email_address != null){
      var dir = "./user_file/";
      var filenames = getFiles(dir);
      var remaining = filenames.length-1;
      var databack;
      for(var i = 0; i < filenames.length; i++){
        // read the file only if it is .json file
        if(filenames[i].includes(".json"))
        {
          fs.readFile(filenames[i], 'utf8',function (err, data)  {
            if (err) throw err;
            var obj = JSON.parse(data);
            remaining --;
            if(obj.email_address == email_address ){
              databack = obj;
            }
            if(remaining == 0){
              res.setHeader('Content-Type', 'application/json');
              res.status(200).send(JSON.stringify(databack));
             }
          });
        }
      }

    }
  return;
});

app.post('/create_doctor', function(req,res){
  var postBody = req.body;
  var doctor_id = postBody.doctor_id;
  console.log(doctor_id);
  var fs = require('fs');
  var dir = './doc_file';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  var file_name = dir + '/' + doctor_id + ".json";
  if (!fs.existsSync(file_name)){
    fs.writeFile(file_name, JSON.stringify(postBody), function (err) {
     if (err) return console.log(err);})
    res.status(200).send('Created!');
  }
  else{
    res.status(400).send('user_id exists, cannot create');
  }
  return;
});

app.post('/update_doctor', function(req,res){
  var postBody = req.body;
  var doctor_id = postBody.doctor_id;
  var file_name = './doc_file/' + doctor_id + ".json";
  if (fs.existsSync(file_name)){
    fs.writeFile(file_name, JSON.stringify(postBody), function (err) {
        if (err) return console.log(err);})
    return;
    res.status(200).send('Updated!');
  }
  else{
    res.status(400).send('doctor_id does not exist, create first');
  }
});

app.get('/get_doctor',function(req,res){
  var doctor_id = req.query.doctor_id;
  var file_name = './doc_file/' + doctor_id + ".json";
  if (fs.existsSync(file_name)){
    fs.readFile(file_name, 'utf8',function (err, data)  {
      if (err) throw err;
      var obj = JSON.parse(data);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(obj));
    });
  }

  else{
    res.status(400).send('doctor_id does not exist!');
  }
  return;
});

app.post('/add_appointment',function(req,res){
  var postBody = req.body;
  var user_id = postBody.user_id;
  var doctor_id = postBody.doctor_id;
  var file_name = './user_file/' + user_id + ".json";
  if (fs.existsSync(file_name)){
    fs.readFile(file_name, 'utf8',function (err, data)  {
      if (err) throw err;
      var obj = JSON.parse(data);
      obj.in_appointment_with = doctor_id;
      res.status(200).send("Appointment made! ");
    });
  }
  else{
    res.status(400).send('user does not exist!');
  }
  return;
});

app.get('/find_doctors',function(req,res){
  var user_id = req.query.user_id;
  var care_type = req.query.care_type;
  var lat = req.query.lat;
  var long = req.query.long;
  var user_insurance = req.query.user_insurance;
  var clinic_list = [];
  var doctor_list = [];
  var file_name = './user_file/' + user_id + ".json";
  if (fs.existsSync(file_name)){
    fs.readFile(file_name, 'utf8',function (err, data)  {
      if (err) throw err;
      var obj = JSON.parse(data);
      user_insurance = obj.insurance_name;
    });
  }
  else{
    res.status(400).send('user_id does not exist!');
  }
  var dir = './clinic_file';
  var filenames = getFiles(dir);
  //IMPORTANT, this is hard code to avoid async problem
  //remaining = filename.length - 1 is assuming there .DS_STORE file for git
  //if pure json file, remove -1
  //again, this is fuking significant, i repeat, FUKING IMPORTANT
  var remaining = filenames.length-1;
  for(var i = 0; i < filenames.length; i++){
    // read the file only if it is .json file

    if(filenames[i].includes(".json"))
    {
      fs.readFile(filenames[i], 'utf8',function (err, data)  {
        if (err) throw err;
        var obj = JSON.parse(data);
        // if this clinic accepts this insurance, save this clinic ID
        if(obj.insurance_list.includes(user_insurance)){
          // console.log(obj.clinic_id);
          clinic_list.push(obj.clinic_id);

        }
        remaining--;
        // now have all the clinic_id inside clinic_list
        if(remaining == 0){

          var dir2 = './doc_file';
          var filenames2 = getFiles(dir2);
          var remaining2 = filenames2.length - 1;
          for(var i = 0; i < filenames2.length; i++){
            if(filenames2[i].includes(".json"))
            {
              fs.readFile(filenames2[i], 'utf8',function (err, data)  {
                if (err) throw err;
                var obj = JSON.parse(data);
                // if this clinic accepts this insurance, save this clinic ID
                if(clinic_list.includes(obj.clinic_id) && obj.care_type == care_type){
                  doctor_list.push(obj.doctor_id);
                }
                remaining2 --;
                if(remaining2 == 0){
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify(doctor_list));
                }
            });
          }
        }
       }
      });
    }
  }
  return;
});

app.post('/create_clinic', function(req,res){
  var postBody = req.body;
  var clinic_id = postBody.clinic_id;
  var fs = require('fs');
  var dir = './clinic_file';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  var file_name = dir + '/' + clinic_id + ".json";
  if (!fs.existsSync(file_name)){
    fs.writeFile(file_name, JSON.stringify(postBody), function (err) {
     if (err) return console.log(err);})
    res.status(200).send('Created!');
  }
  else{
    res.status(400).send('clinic_id already exists');
  }
  return;
});

app.post('/update_clinic', function(req,res){
  var postBody = req.body;
  var clinic_id = postBody.clinic_id;
  var file_name = './clinic_file/' + clinic_id + ".json";
  if (fs.existsSync(file_name)){
    fs.writeFile(file_name, JSON.stringify(postBody), function (err) {
        if (err) return console.log(err);})
    res.status(200).send('OK');
  }
  else{
    res.status(400).send('clinic_id does not exist, cannot upgrade');
  }
  return;
});

app.get('/get_clinic',function(req,res){
  var clinic_id = req.query.clinic_id;
  var file_name = './clinic_file/' + clinic_id + ".json";
  if (fs.existsSync(file_name)){
    fs.readFile(file_name, 'utf8',function (err, data)  {
      if (err) throw err;
      var obj = JSON.parse(data);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).end(JSON.stringify(obj));
    });
  }
  else{
      res.status(400).send("clinic_id does not exist, bad request dude");
  }
  return;
});

app.get('/get_clinic_doctors',function(req,res){
  var clinic_id = req.query.clinic_id;
  var dir = "./doc_file/";
  var filenames = getFiles(dir);
  var remaining = filenames.length-1;
  var doctor_list = [];
  for(var i = 0; i < filenames.length; i++){
    // read the file only if it is .json file
    if(filenames[i].includes(".json"))
    {
      fs.readFile(filenames[i], 'utf8',function (err, data)  {
        if (err) throw err;
        var obj = JSON.parse(data);
        remaining --;
        if(obj.clinic_id == clinic_id){
          doctor_list.push(obj.doctor_id);
        }
        if(remaining == 0){
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(JSON.stringify(doctor_list));
         }
      });
    }
  }
  return;
});

app.get('/get_insurances',function(req,res){
  var list_insurance = ['Unitedhealth Group',
  'Wellpoint Inc. Group', 'Kaiser Foundation Group',
   'Humana Group', 'Aetna Group',
    'HCSC Group', 'Cigna Health Group',
    'Highmark Group', 'Coventry Corp. Group',
    'HIP Insurance Group',
    'Independence Blue Cross Group', 'Blue Cross Blue Shield of New Jersey Group',
    'Blue Cross Blue Shield of Michigan Group',
    'California Physicians Service', 'Blue Cross Blue Shield of Florida Group',
    'Health Net of California, Inc.', 'Centene Corp. Group',
    'Carefirst Inc. Group', 'Wellcare Group',
    'Blue Cross Blue Shield of Massachusetts Group', 'UHC of California',
     'Lifetime Healthcare Group', 'Cambia Health Solutions Inc.', 'Metropolitan Group',
     'Molina Healthcare Inc. Group'];
     res.status(200).end(JSON.stringify(list_insurance));
     return;
});

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

//server will continue run if error found
process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("I am still running...");
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('Server started at http://localhost:%s/', port);
});
