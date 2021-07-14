var http = require("http");
var mysql=require('mysql');
var connection = mysql.createConnection({
   host:"140.116.82.135",
   user:"DEH1",
   password:"!abc12345",
   database:"db2021",
   port : 3306,
   useConnectionPooling: true
});
/*http.createServer(function (req, res) {
  res.writeHead(200, {"Connect-Type" : "text/html;charset=utf8"});
  res.write("<h3>ttt</h3><br/>");
  connection.connect(function(err) {
    if(err) {
      res.end('<p>Error</p>');
      console.log("aaa");
      return;
    } else {
      res.end('<p>Connect</p>');
      console.log("bbb");
    }
  });
}).listen(6868);*/

http.createServer(function (req, res) {
  if(req.method == 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log(body);
      body = JSON.parse(body);
      connection.query('insert into photo_tags(title, date, latitude, longitude, altitude, orientation, azimuth, weather, address, era, category, keyword, description, reference, companion, priority, contributor) values(' + '"' + body.title + '"' + ',' + '"' + body.date + '"' + ',' + body.latitude + ',' + body.longitude + ',' + body.altitude + ',' + '"' + body.orientation + '"' + ',' + body.azimuth + ','  + '"' + body.weather + '"' + ',' + '"' + body.address + '"' + ',' + body.era + ',' + '"' + body.category + '"' + ',' + '"' + body.keyword + '"' + ',' + '"' + body.description + '"' + ',' + '"' + body.reference + '"' + ',' + '"' + body.companion + '"' + ',' + body.priority + ',' + '"' + body.contributor + '"' + ');', function (errorinsert, resinsert){
        if(errorinsert) console.log(errorinsert);
        console.log(resinsert);
        console.log("insert!!!!!");
      });
      connection.query('insert into vision_api(label0, label1, label2, label3, label4, label5, label6, label7, label8, label9, label10, label11, label12, label13, label14, label15, label16, label17, label18, label19, label20, label21, label22, label23, label24, label25, label26, label27, label28, label29, label30, landmark0, landmark1, landmark2, landmark3, landmark4, landmark5) values(' + '"' + body.vision_api.label0 + '"' + ',' + '"' + body.vision_api.label1 + '"' + ',' + '"' + body.vision_api.label2 + '"' + ',' + '"' + body.vision_api.label3 + '"' + ',' + '"' + body.vision_api.label4 + '"' + ',' + '"' + body.vision_api.label5 + '"' + ','  + '"' + body.vision_api.label6 + '"' + ',' + '"' + body.vision_api.label7 + '"' + ',' + '"' + body.vision_api.label8 + '"' + ',' + '"' + body.vision_api.label9 + '"' + ',' + '"' + body.vision_api.label10 + '"' + ',' + '"' + body.vision_api.label11 + '"' + ',' + '"' + body.vision_api.label12 + '"' + ',' + '"' + body.vision_api.label13 + '"' + ',' + '"' + body.vision_api.label14 + '"' + ',' + '"' + body.vision_api.label15 + '"' + ',' + '"' + body.vision_api.label16 + '"' + ',' + '"' + body.vision_api.label17 + '"' + ',' + '"' + body.vision_api.label18 + '"' + ',' + '"' + body.vision_api.label19 + '"' + ',' + '"' + body.vision_api.label20 + '"' + ',' + '"' + body.vision_api.label21 + '"' + ',' + '"' + body.vision_api.label22 + '"' + ',' + '"' + body.vision_api.label23 + '"' + ',' + '"' + body.vision_api.label24 + '"' + ',' + '"' + body.vision_api.label25 + '"' + ',' + '"' + body.vision_api.label26 + '"' + ',' + '"' + body.vision_api.label27 + '"' + ',' + '"' + body.vision_api.label28 + '"' + ',' + '"' + body.vision_api.label29 + '"' + ',' + '"' + body.vision_api.label30 + '"' + ',' + '"' + body.vision_api.landmark0 + '"' + ',' + '"' + body.vision_api.landmark1 + '"' + ',' + '"' + body.vision_api.landmark2 + '"' + ',' + '"' + body.vision_api.landmark3 + '"' + ',' + '"' + body.vision_api.landmark4 + '"' + ',' + '"' + body.vision_api.landmark5 + '"'  + ');', function (errorinsert, resinsert){
        if(errorinsert) console.log(errorinsert);
        console.log(resinsert);
        console.log("insert!!!!!");
      });
      res.end('ok');
    });
  }

    //res.writeHead(200, {"Connect-Type" : "text/html;charset=utf8"});
    //res.write("<h3>ttt</h3><br/>");
  /*connection.query('insert into photo_tags(title) values("孔廟");', function (errorinsert, resinsert){
    if(errorinsert) console.log(errorinsert);
    console.log(resinsert);
    console.log("insert!!!!!");
  });
  */
}).listen(6868);