//var http = require("http");
var mysql=require('mysql');
var connection = mysql.createConnection({
   host:"140.116.82.135",
   user:"DEH1",
   password:"!abc12345",
   database:"db2021",
   port : 3306,
   useConnectionPooling: true
});

const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var express = require("express"),
app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

var fs = require('fs');
function render(filename, params) {
  var data = fs.readFileSync(filename, 'utf8');
  for (var key in params) {
    data = data.replace('{' + key + '}', params[key]);
  }
  return data;
}

var totalRes={};
var choosed_pic={};
var temp_result={};
var labellist = ['label0', 'label1', 'label2', 'label3', 'label4', 'label5', 'label6', 'label7', 'label8', 'label9', 'label10', 'label11', 'label12', 'label13', 'label14', 'label15', 'label16', 'label17', 'label18', 'label19', 'label20', 'label21', 'label22', 'label23', 'label24', 'label25', 'label26', 'label27', 'label28', 'label29', 'label30'];
var landmarklist = ['landmark0','landmark1','landmark2','landmark3','landmark4','landmark5'];
	
const server = require('http').Server(app);
const io = require('socket.io')(server);

//list get
var pg={};
var spg={};
var ID;

	/*io.on('connection', function(socket){
		console.log('User');
		console.log(socket.id);
		ID = socket.id;
	});*/
app.get("/list", function(req, res) {
	if(req.cookies['name']!=undefined) {
		pg[req.cookies['name']] = 0;
		spg[req.cookies['name']] = 0;
		totalRes[req.cookies['name']] = [];
		choosed_pic[req.cookies['name']] = [];
		temp_result[req.cookies['name']] = [];
	}
	//const socket = io.connect();
	//console.log(ID);
	connection.query('SELECT title from poi',function (err, result, fields){
        if (err) throw err;
		console.log(result);
		
		res.send(render('list.html', {
				login:req.cookies['name']===undefined ? '<a href="http://140.116.82.135:1001/username">登入</a>' : req.cookies['name'],
				
				list1:result.length > 0+pg[req.cookies['name']]*10 ? result[0+pg[req.cookies['name']]*10].title :'',
				list2:result.length > 1+pg[req.cookies['name']]*10 ? result[1+pg[req.cookies['name']]*10].title :'',
				list3:result.length > 2+pg[req.cookies['name']]*10 ? result[2+pg[req.cookies['name']]*10].title :'',
				list4:result.length > 3+pg[req.cookies['name']]*10 ? result[3+pg[req.cookies['name']]*10].title :'',
				list5:result.length > 4+pg[req.cookies['name']]*10 ? result[4+pg[req.cookies['name']]*10].title :'',
				list6:result.length > 5+pg[req.cookies['name']]*10 ? result[5+pg[req.cookies['name']]*10].title :'',
				list7:result.length > 6+pg[req.cookies['name']]*10 ? result[6+pg[req.cookies['name']]*10].title :'',
				list8:result.length > 7+pg[req.cookies['name']]*10 ? result[7+pg[req.cookies['name']]*10].title :'',
				list9:result.length > 8+pg[req.cookies['name']]*10 ? result[8+pg[req.cookies['name']]*10].title :'',
				list10:result.length > 9+pg[req.cookies['name']]*10 ? result[9+pg[req.cookies['name']]*10].title :'',
		}));
	});
});
//list post
app.post("/list", function(req, res) {
	if(req.body.username) {
		res.cookie("name", req.body.username, {
			maxAge : 86400*1000
			/*,
			httpOnly : true,
			secure : true
			*/
		});
		pg[req.body.username] = 0;
		spg[req.body.username] = 0;
		totalRes[req.body.username] = [];
		choosed_pic[req.body.username] = [];
		temp_result[req.body.username] = [];
	}
	console.log("qwiue "+ pg[req.body.username])
	//if(req.body.username)
	//	all_user[req.connection.remoteAddress+req.body.username]=req.body.username;
	console.log("asd"+req.headers.cookie);
	console.log(req.cookies['name']);
	connection.query('SELECT title from poi',function (err, result, fields){
        if (err) throw err;
		console.log(result);
		console.log(req.body.nextpg);
		if(req.body.nextpg == "下一頁" && result.length > (pg[req.cookies['name']]+1) * 10)
			pg[req.cookies['name']]++;
		if(req.body.previouspg == "上一頁" && pg[req.cookies['name']]!=0)
			pg[req.cookies['name']]--;
		res.send(render('list.html', {
				login:req.cookies['name'] === undefined ? '<a id=u name=u value=' + req.body.username +'>'+ req.body.username +'</a>' : '<a id=u name=u value=' + req.cookies['name'] +'>'+ req.cookies['name'] +'</a>',
				
				list1:result.length > 0+pg[req.body.username ? req.body.username : req.cookies['name']]*10 ? result[0+pg[req.body.username ? req.body.username : req.cookies['name']]*10].title :'',
				list2:result.length > 1+pg[req.body.username ? req.body.username : req.cookies['name']]*10 ? result[1+pg[req.body.username ? req.body.username : req.cookies['name']]*10].title :'',
				list3:result.length > 2+pg[req.body.username ? req.body.username : req.cookies['name']]*10 ? result[2+pg[req.body.username ? req.body.username : req.cookies['name']]*10].title :'',
				list4:result.length > 3+pg[req.body.username ? req.body.username : req.cookies['name']]*10 ? result[3+pg[req.body.username ? req.body.username : req.cookies['name']]*10].title :'',
				list5:result.length > 4+pg[req.body.username ? req.body.username : req.cookies['name']]*10 ? result[4+pg[req.body.username ? req.body.username : req.cookies['name']]*10].title :'',
				list6:result.length > 5+pg[req.body.username ? req.body.username : req.cookies['name']]*10 ? result[5+pg[req.body.username ? req.body.username : req.cookies['name']]*10].title :'',
				list7:result.length > 6+pg[req.body.username ? req.body.username : req.cookies['name']]*10 ? result[6+pg[req.body.username ? req.body.username : req.cookies['name']]*10].title :'',
				list8:result.length > 7+pg[req.body.username ? req.body.username : req.cookies['name']]*10 ? result[7+pg[req.body.username ? req.body.username : req.cookies['name']]*10].title :'',
				list9:result.length > 8+pg[req.body.username ? req.body.username : req.cookies['name']]*10 ? result[8+pg[req.body.username ? req.body.username : req.cookies['name']]*10].title :'',
				list10:result.length > 9+pg[req.body.username ? req.body.username : req.cookies['name']]*10 ? result[9+pg[req.body.username ? req.body.username : req.cookies['name']]*10].title :'',
		}));
	});
});


app.get("/username", function(req, res) {
	res.send(render('username.html', {
	}));
});	
	
//autoring get
app.get("/authoring", function(req, res) {
	console.log(req.headers.cookie);
    res.send(render('authoring.html', {
				title_1:'',
				title_2:'',
				title_3:'',
				title_4:'',
				title_5:'',
				
				pic_1 : choosed_pic[req.cookies['name']].length>0 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][0] + ').jpg"' : '""',
				pic_2 : choosed_pic[req.cookies['name']].length>1 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][1] + ').jpg"' : '""',
				pic_3 : choosed_pic[req.cookies['name']].length>2 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][2] + ').jpg"' : '""',
				pic_4 : choosed_pic[req.cookies['name']].length>3 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][3] + ').jpg"' : '""',
				pic_5 : choosed_pic[req.cookies['name']].length>4 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][4] + ').jpg"' : '""',
				
				line_1:'',
				line_2:'',
				line_3:'',
				line_4:'',
				line_5:'',
				
		
    }));
});

//authoring post
app.post("/authoring", function(req, res) {
	var title = req.body.title;
	var description = req.body.description;
	var category = req.body.category;
	var contributor = req.body.contributor;
	
	var ll = choosed_pic[req.cookies['name']].length;
	for(var i=0; i<=5-ll-1; ++i)
		choosed_pic[req.cookies['name']].push(-1);
	
	connection.query('insert into poi(photo_id0,photo_id1,photo_id2,photo_id3,photo_id4,title,description,category,contributor) values('+ '"' + choosed_pic[req.cookies['name']][0] + '"' + ',' + '"' + choosed_pic[req.cookies['name']][1] + '"' + ','+'"' + choosed_pic[req.cookies['name']][2] + '"' + ','+'"' + choosed_pic[req.cookies['name']][3] + '"' + ','+'"' + choosed_pic[req.cookies['name']][4] + '"' + ',' +'"' + title + '"' + ',' +'"' + description + '"' + ',' +'"' + category + '"' + ',' +'"' + contributor + '"' + ');', function (errorinsert, resinsert){
        if(errorinsert) console.log(errorinsert);
		console.log(resinsert);
        console.log("insert!!!!!");
		
		res.send(render('authoring.html', {
		pic_1 : choosed_pic[req.cookies['name']].length>0 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][0] + ').jpg"' : '""',
		pic_2 : choosed_pic[req.cookies['name']].length>1 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][1] + ').jpg"' : '""',
		pic_3 : choosed_pic[req.cookies['name']].length>2 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][2] + ').jpg"' : '""',
		pic_4 : choosed_pic[req.cookies['name']].length>3 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][3] + ').jpg"' : '""',
		pic_5 : choosed_pic[req.cookies['name']].length>4 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][4] + ').jpg"' : '""',
		line_1: choosed_pic[req.cookies['name']].length > 0 ? '-----------------------------------------------------': '',
		line_2: choosed_pic[req.cookies['name']].length > 1 ? '-----------------------------------------------------': '',
		line_3: choosed_pic[req.cookies['name']].length > 2 ? '-----------------------------------------------------': '',
		line_4: choosed_pic[req.cookies['name']].length > 3 ? '-----------------------------------------------------': '',
		line_5: choosed_pic[req.cookies['name']].length > 4 ? '-----------------------------------------------------': '',
		}));
	});
    
	choosed_pic[req.cookies['name']]=[];
	console.log(title);
	console.log(description);
	console.log(category);
	console.log(contributor);
});


//showautoring get
app.get("/showauthoring/:pick", function(req, res) {
	connection.query('SELECT * from poi',function (err, result, fields){
        if (err) throw err;
		var spoi=Number(req.params.pick)+pg[req.cookies['name']]*10
		res.send(render('showauthoring.html', {
				show_title:result.length > spoi ? result[spoi].title :'',
				show_description:result.length > spoi ? result[spoi].description :'',
				show_category:result.length > spoi ? result[spoi].category :'',
				show_contributor:result.length > spoi ? result[spoi].contributor :'',
				pic_1:result[spoi].photo_id0 > 0 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + result[spoi].photo_id0 + ').jpg"' : '""',
				pic_2:result[spoi].photo_id1 > 0 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + result[spoi].photo_id1 + ').jpg"' : '""',
				pic_3:result[spoi].photo_id2 > 0 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + result[spoi].photo_id2 + ').jpg"' : '""',
				pic_4:result[spoi].photo_id3 > 0 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + result[spoi].photo_id3 + ').jpg"' : '""',
				pic_5:result[spoi].photo_id4 > 0 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + result[spoi].photo_id4 + ').jpg"' : '""',
				line_1: result[spoi].photo_id0 > 0 ? '-----------------------------------------------------': '',
				line_2: result[spoi].photo_id1 > 0 ? '-----------------------------------------------------': '',
				line_3: result[spoi].photo_id2 > 0 ? '-----------------------------------------------------': '',
				line_4: result[spoi].photo_id3 > 0 ? '-----------------------------------------------------': '',
				line_5: result[spoi].photo_id4 > 0 ? '-----------------------------------------------------': '',
		}));
	});
});

//showautoring post

app.post("/showauthoring", function(req, res) {
	connection.query('SELECT title from poi',function (err, result, fields){
        if (err) throw err;
		res.send(render('list.html', {
				list1:result.length > 0+pg[req.cookies['name']]*10 ? result[0+pg[req.cookies['name']]*10].title :'',
				list2:result.length > 1+pg[req.cookies['name']]*10 ? result[1+pg[req.cookies['name']]*10].title :'',
				list3:result.length > 2+pg[req.cookies['name']]*10 ? result[2+pg[req.cookies['name']]*10].title :'',
				list4:result.length > 3+pg[req.cookies['name']]*10 ? result[3+pg[req.cookies['name']]*10].title :'',
				list5:result.length > 4+pg[req.cookies['name']]*10 ? result[4+pg[req.cookies['name']]*10].title :'',
				list6:result.length > 5+pg[req.cookies['name']]*10 ? result[5+pg[req.cookies['name']]*10].title :'',
				list7:result.length > 6+pg[req.cookies['name']]*10 ? result[6+pg[req.cookies['name']]*10].title :'',
				list8:result.length > 7+pg[req.cookies['name']]*10 ? result[7+pg[req.cookies['name']]*10].title :'',
				list9:result.length > 8+pg[req.cookies['name']]*10 ? result[8+pg[req.cookies['name']]*10].title :'',
				list10:result.length > 9+pg[req.cookies['name']]*10 ? result[9+pg[req.cookies['name']]*10].title :'',
		}));
	});
});


//search get
app.get("/search", function(req, res) {
	console.log(req.headers['referer']);
	var head="http://140.116.82.135:8000/photo_server/photo%20(", rear=").jpg";
	if(req.headers['referer'] && req.headers['referer'] != "http://140.116.82.135:1001/authoring" && req.headers['referer'] != "http://140.116.82.135:1001/authoring?goAuthoring=%E5%AE%8C%E6%88%90" && req.headers['referer'] != "http://140.116.82.135:1001/authoring?goAuthoring" && req.headers['referer'] != "http://140.116.82.135:1001/authoring?goAuthoring=%E7%A2%BA%E8%AA%8D%E5%9C%96%E7%89%87") {
		var num=0;
		var j=0;
		for(var i=req.headers['referer'].length-1; i>=0; --i) {
			if(req.headers['referer'][i] == '/')
				break;
			num += req.headers['referer'][i]*Math.pow(10,j++);
		}
		var same=0;
		for(var j=0; j<choosed_pic[req.cookies['name']].length; ++j) {
			if(choosed_pic[req.cookies['name']][j] == totalRes[req.cookies['name']][ num - 1 + spg[req.cookies['name']]*20])
				same=1;
		}
		if(same == 0)
			choosed_pic[req.cookies['name']].push(totalRes[req.cookies['name']][ num - 1 + spg[req.cookies['name']]*20]);
	}
	console.log(choosed_pic[req.cookies['name']]);
	var opt="";
	var optlist = [];
	var opt1="";
	var opt1list = [];
	connection.query("SELECT * FROM vision_api", function (err, result, fields) {
		if (err) throw err;
		for(var i=0; i < result.length ;i++)
		{
			for(var j=0; j<31; ++j)
			{
				if(optlist.indexOf(result[i][labellist[j]]) == -1 && result[i][labellist[j]]!="NULL")
					optlist.push(result[i][labellist[j]]);
				if(j < 6){
					if(opt1list.indexOf(result[i][landmarklist[j]]) == -1 && result[i][landmarklist[j]] != "NULL")
						opt1list.push(result[i][landmarklist[j]]);
				}
			}
		}
		for(var i=0 ; i<optlist.length; i++)
		{
			opt += '<option value="' + optlist[i] + '">';
		}
		for(var i=0 ; i<opt1list.length; i++)
		{
			opt1 += '<option value="' + opt1list[i] + '">';
		}
		
		
		
		res.send(render('search.html', {
				labelopt : opt,
				landmarkopt: opt1,
				choosed_pic_1 : choosed_pic[req.cookies['name']].length>0 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][0] + ').jpg"' : '""',
				choosed_pic_2 : choosed_pic[req.cookies['name']].length>1 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][1] + ').jpg"' : '""',
				choosed_pic_3 : choosed_pic[req.cookies['name']].length>2 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][2] + ').jpg"' : '""',
				choosed_pic_4 : choosed_pic[req.cookies['name']].length>3 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][3] + ').jpg"' : '""',
				choosed_pic_5 : choosed_pic[req.cookies['name']].length>4 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][4] + ').jpg"' : '""',
		
				del1 : choosed_pic[req.cookies['name']].length>0 ? '<input class="w3-button w3-grey" type="submit" name="del" value="刪除"/>' : '',
				del2 : choosed_pic[req.cookies['name']].length>1 ? '<input class="w3-button w3-grey" type="submit" name="del" value="刪除"/>' : '',
				del3 : choosed_pic[req.cookies['name']].length>2 ? '<input class="w3-button w3-grey" type="submit" name="del" value="刪除"/>' : '',
				del4 : choosed_pic[req.cookies['name']].length>3 ? '<input class="w3-button w3-grey" type="submit" name="del" value="刪除"/>' : '',
				del5 : choosed_pic[req.cookies['name']].length>4 ? '<input class="w3-button w3-grey" type="submit" name="del" value="刪除"/>' : '',
		
				title_1: totalRes[req.cookies['name']].length > 0 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][0 + spg[req.cookies['name']] * 20]-1].title : '',
				title_2: totalRes[req.cookies['name']].length > 1 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][1 + spg[req.cookies['name']] * 20]-1].title : '',
				title_3: totalRes[req.cookies['name']].length > 2 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][2 + spg[req.cookies['name']] * 20]-1].title : '',
				title_4: totalRes[req.cookies['name']].length > 3 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][3 + spg[req.cookies['name']] * 20]-1].title : '',
				title_5: totalRes[req.cookies['name']].length > 4 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][4 + spg[req.cookies['name']] * 20]-1].title : '',
				title_6: totalRes[req.cookies['name']].length > 5 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][5 + spg[req.cookies['name']] * 20]-1].title : '',
				title_7: totalRes[req.cookies['name']].length > 6 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][6 + spg[req.cookies['name']] * 20]-1].title : '',
				title_8: totalRes[req.cookies['name']].length > 7 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][7 + spg[req.cookies['name']] * 20]-1].title : '',
				title_9: totalRes[req.cookies['name']].length > 8 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][8 + spg[req.cookies['name']] * 20]-1].title : '',
				title_10: totalRes[req.cookies['name']].length > 9 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][9 + spg[req.cookies['name']] * 20]-1].title : '',
				title_11: totalRes[req.cookies['name']].length > 10 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][10 + spg[req.cookies['name']] * 20]-1].title : '',
				title_12: totalRes[req.cookies['name']].length > 11 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][11 + spg[req.cookies['name']] * 20]-1].title : '',
				title_13: totalRes[req.cookies['name']].length > 12 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][12 + spg[req.cookies['name']] * 20]-1].title : '',
				title_14: totalRes[req.cookies['name']].length > 13 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][13 + spg[req.cookies['name']] * 20]-1].title : '',
				title_15: totalRes[req.cookies['name']].length > 14 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][14 + spg[req.cookies['name']] * 20]-1].title : '',
				title_16: totalRes[req.cookies['name']].length > 15 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][15 + spg[req.cookies['name']] * 20]-1].title : '',
				title_17: totalRes[req.cookies['name']].length > 16 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][16 + spg[req.cookies['name']] * 20]-1].title : '',
				title_18: totalRes[req.cookies['name']].length > 17 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][17 + spg[req.cookies['name']] * 20]-1].title : '',
				title_19: totalRes[req.cookies['name']].length > 18 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][18 + spg[req.cookies['name']] * 20]-1].title : '',
				title_20: totalRes[req.cookies['name']].length > 19 + spg[req.cookies['name']] * 20 ? temp_result[req.cookies['name']][totalRes[req.cookies['name']][19 + spg[req.cookies['name']] * 20]-1].title : '',
				
				pic_1: totalRes[req.cookies['name']].length > 0 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][0 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_2: totalRes[req.cookies['name']].length > 1 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][1 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_3: totalRes[req.cookies['name']].length > 2 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][2 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_4: totalRes[req.cookies['name']].length > 3 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][3 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_5: totalRes[req.cookies['name']].length > 4 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][4 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_6: totalRes[req.cookies['name']].length > 5 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][5 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_7: totalRes[req.cookies['name']].length > 6 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][6 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_8: totalRes[req.cookies['name']].length > 7 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][7 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_9: totalRes[req.cookies['name']].length > 8 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][8 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_10: totalRes[req.cookies['name']].length > 9 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][9 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_11: totalRes[req.cookies['name']].length > 10 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][10 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_12: totalRes[req.cookies['name']].length > 11 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][11 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_13: totalRes[req.cookies['name']].length > 12 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][12 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_14: totalRes[req.cookies['name']].length > 13 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][13 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_15: totalRes[req.cookies['name']].length > 14 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][14 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_16: totalRes[req.cookies['name']].length > 15 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][15 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_17: totalRes[req.cookies['name']].length > 16 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][16 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_18: totalRes[req.cookies['name']].length > 17 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][17 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_19: totalRes[req.cookies['name']].length > 18 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][18 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				pic_20: totalRes[req.cookies['name']].length > 19 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][19 + spg[req.cookies['name']] * 20].toString() +rear : '""',
				
				line_1: totalRes[req.cookies['name']].length > 0 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_2: totalRes[req.cookies['name']].length > 1 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_3: totalRes[req.cookies['name']].length > 2 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_4: totalRes[req.cookies['name']].length > 3 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_5: totalRes[req.cookies['name']].length > 4 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_6: totalRes[req.cookies['name']].length > 5 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_7: totalRes[req.cookies['name']].length > 6 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_8: totalRes[req.cookies['name']].length > 7 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_9: totalRes[req.cookies['name']].length > 8 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_10: totalRes[req.cookies['name']].length > 9 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_11: totalRes[req.cookies['name']].length > 10 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_12: totalRes[req.cookies['name']].length > 11 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_13: totalRes[req.cookies['name']].length > 12 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_14: totalRes[req.cookies['name']].length > 13 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_15: totalRes[req.cookies['name']].length > 14 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_16: totalRes[req.cookies['name']].length > 15 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_17: totalRes[req.cookies['name']].length > 16 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_18: totalRes[req.cookies['name']].length > 17 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_19: totalRes[req.cookies['name']].length > 18 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_20: totalRes[req.cookies['name']].length > 19 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '""'
				
		
		}));
	});
		
    
});

//search post
app.post("/search", function(req, res) {
	if(req.body.pic > 0)
		choosed_pic[req.cookies['name']].splice(req.body.pic-1, 1);
	console.log("cccpic");
	console.log(req.body.pic);
	var head="http://140.116.82.135:8000/photo_server/photo%20(", rear=").jpg";
	//res.sendfile(__dirname + '/search.html', function(err) {
        //if (err) res.send(404);
	if(req.body.nextpg == "下一頁")
		spg[req.cookies['name']]++;
	else if(req.body.previouspg == "上一頁" && spg[req.cookies['name']]!=0)
		spg[req.cookies['name']]--;
	else if(req.body.submitDetails == "Search"){
		spg[req.cookies['name']]=0;
		totalRes[req.cookies['name']] = [];
		var Search = req.body.Search;
		var listCheck = ['title','date','keyword','description','reference','contributor'];
		var titleCheck = req.body.title, dateCheck=req.body.date, keywordCheck=req.body.keyword, descriptionCheck=req.body.description, referenceCheck = req.body.reference, contributorCheck =req.body.contributor, categoryCheck=req.body.category ,priorityCheck = req.body.priority;
		var list = [];
		list.push(titleCheck);
		list.push(dateCheck);
		list.push(keywordCheck);
		list.push(descriptionCheck);
		list.push(referenceCheck);
		list.push(contributorCheck);
		var labelCheck = req.body.label, landmarkCheck = req.body.landmark;
		var categoryRes=[], priorityRes=[], labelRes=[], landmarkRes=[], tempRes=[];
		var labelbool=false, landmarkbool=false, categorybool=false, prioritybool=false;
		
		var labelSplit= [];
		var searchSplit =[];
		console.log(req.body.Search);
		if(labelCheck!=null)
		{
			labelSplit = labelCheck.split(' ');
			labelCheck='';
			for(var i=0;i<labelSplit.length;i++)
			{
				labelCheck += labelSplit[i];
				if(i!=labelSplit.length-1)
					labelCheck += '|';
			}
				
		}
		if(Search!=null)
		{
			searchSplit = Search.split(' ');
			Search='';
			for(var i=0;i<searchSplit.length;i++)
			{
				Search += searchSplit[i];
				if(i!=searchSplit.length-1)
					Search += '|';
			}
				
		}
		console.log(labelSplit);
		console.log(searchSplit);
		
		
		//搜尋勾選項目
		for(var l=0 ; l<6 ;l++)
		{
			if(list[l] == listCheck[l])
			{
				if(Search) {
					connection.query("SELECT id FROM photo_tags WHERE " + listCheck[l] + " REGEXP " + "'" +Search+ "'", function (err, result, fields) {
						if (err) throw err;
						for(var i=0; i < result.length ;i++)
						{
							if(totalRes[req.cookies['name']].indexOf(result[i].id) == -1)
								totalRes[req.cookies['name']].push(result[i].id);
						}
					});
				}
			}
		}
		
		//搜尋label
		if(labelCheck == "")
		{
			labelRes.push(-69);
		}
		else
		{
			if(labelCheck != null)
			{
				for(var l=0 ; l<31 ;l++)
				{
					connection.query("SELECT id FROM vision_api WHERE " + labellist[l] + " REGEXP " + "'" +labelCheck+ "'", function (err, result, fields) {
						if (err) throw err;
						for(var i=0; i < result.length ;i++)
						{
							if(labelRes.indexOf(result[i].id) == -1)
								labelRes.push(result[i].id);
						}
					});
				}
			}
		}
		
		//搜尋landmark
		if(landmarkCheck == "")
		{
			landmarkRes.push(-69);
		}
		else
		{
			for(var l=0 ; l<6 ;l++)
			{
				connection.query("SELECT id FROM vision_api WHERE " + landmarklist[l] + " LIKE "+ "'%" +landmarkCheck+ "%'", function (err, result, fields) {
					if (err) throw err;
					for(var i=0; i < result.length ;i++)
					{
						if(landmarkRes.indexOf(result[i].id) == -1)
							landmarkRes.push(result[i].id);
					}
				});
			}
		}
		
		//搜尋category
		if(categoryCheck=="All")
		{
			categoryRes.push(-69);
		}
		else
		{
			connection.query("SELECT id FROM photo_tags WHERE (category = "+ "'" +categoryCheck+ "') OR (category = 'ALL')" , function (err, result, fields) {
					if (err) throw err;
					for(var i=0; i < result.length ;i++)
					{
						if(categoryRes.indexOf(result[i].id) == -1)
							categoryRes.push(result[i].id);
					}
			});
		}
		
		//搜尋priority
		if(priorityCheck == 0)
		{
			priorityRes.push(-69);
		}
		else
		{
			connection.query("SELECT id FROM photo_tags WHERE priority = "+ "'" +priorityCheck+ "'", function (err, result, fields) {
					if (err) throw err;
					for(var i=0; i < result.length ;i++)
					{
						if(priorityRes.indexOf(result[i].id) == -1)
							priorityRes.push(result[i].id);
					}
			});
		}
		
		//取and 跟 show出來
		connection.query("SELECT id FROM vision_api WHERE landmark0 = "+ "'" +landmarkCheck+ "'", function (err, result, fields) {
			for(var i in totalRes[req.cookies['name']])
			{
				if(labelRes[0]==-69)
					labelbool = true;
				else
					labelbool = labelRes.indexOf(totalRes[req.cookies['name']][i]) != -1;
				
				if(landmarkRes[0]==-69)
					landmarkbool = true;
				else
					landmarkbool = landmarkRes.indexOf(totalRes[req.cookies['name']][i]) != -1;
					
				if(categoryRes[0]==-69)
					categorybool = true;
				else
					categorybool = categoryRes.indexOf(totalRes[req.cookies['name']][i]) != -1;
					
				if(priorityRes[0]==-69)
					prioritybool = true;
				else
					prioritybool = priorityRes.indexOf(totalRes[req.cookies['name']][i]) != -1;
					
				if(labelbool && landmarkbool && categorybool && prioritybool)
					tempRes.push(totalRes[req.cookies['name']][i]);
			}
			if (err) throw err;
			console.log("totalRes[req.cookies['name']]為:");
			console.log(totalRes[req.cookies['name']]);
			console.log("categoryRes為:");
			console.log(categoryRes);
			console.log("priorityRes為:");
			console.log(priorityRes);
			console.log("labelRes為:");
			console.log(labelRes);
			console.log("landmarkRes為:");
			console.log(landmarkRes);
			console.log("tempRes為:");
			console.log(tempRes);
			totalRes[req.cookies['name']] = tempRes;
			
		});
	}
		//設定pic line url
		connection.query("SELECT title FROM photo_tags", function (err, result, fields) {
			temp_result[req.cookies['name']] = result;
			if(totalRes[req.cookies['name']].length <= (spg[req.cookies['name']]) * 20 && spg[req.cookies['name']] != 0)
				spg[req.cookies['name']]--;
			if (err) throw err;
			res.send(render('search.html', {
				choosed_pic_1 : choosed_pic[req.cookies['name']].length>0 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][0] + ').jpg"' : '""',
				choosed_pic_2 : choosed_pic[req.cookies['name']].length>1 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][1] + ').jpg"' : '""',
				choosed_pic_3 : choosed_pic[req.cookies['name']].length>2 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][2] + ').jpg"' : '""',
				choosed_pic_4 : choosed_pic[req.cookies['name']].length>3 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][3] + ').jpg"' : '""',
				choosed_pic_5 : choosed_pic[req.cookies['name']].length>4 ? '"http://140.116.82.135:8000/photo_server/photo%20(' + choosed_pic[req.cookies['name']][4] + ').jpg"' : '""',
				
				del1 : choosed_pic[req.cookies['name']].length>0 ? '<input class="w3-button w3-grey" type="submit" name="del" value="刪除"/>' : '',
				del2 : choosed_pic[req.cookies['name']].length>1 ? '<input class="w3-button w3-grey" type="submit" name="del" value="刪除"/>' : '',
				del3 : choosed_pic[req.cookies['name']].length>2 ? '<input class="w3-button w3-grey" type="submit" name="del" value="刪除"/>' : '',
				del4 : choosed_pic[req.cookies['name']].length>3 ? '<input class="w3-button w3-grey" type="submit" name="del" value="刪除"/>' : '',
				del5 : choosed_pic[req.cookies['name']].length>4 ? '<input class="w3-button w3-grey" type="submit" name="del" value="刪除"/>' : '',
				
				title_1: totalRes[req.cookies['name']].length > 0 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][0 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_2: totalRes[req.cookies['name']].length > 1 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][1 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_3: totalRes[req.cookies['name']].length > 2 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][2 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_4: totalRes[req.cookies['name']].length > 3 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][3 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_5: totalRes[req.cookies['name']].length > 4 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][4 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_6: totalRes[req.cookies['name']].length > 5 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][5 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_7: totalRes[req.cookies['name']].length > 6 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][6 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_8: totalRes[req.cookies['name']].length > 7 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][7 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_9: totalRes[req.cookies['name']].length > 8 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][8 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_10: totalRes[req.cookies['name']].length > 9 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][9 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_11: totalRes[req.cookies['name']].length > 10 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][10 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_12: totalRes[req.cookies['name']].length > 11 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][11 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_13: totalRes[req.cookies['name']].length > 12 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][12 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_14: totalRes[req.cookies['name']].length > 13 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][13 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_15: totalRes[req.cookies['name']].length > 14 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][14 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_16: totalRes[req.cookies['name']].length > 15 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][15 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_17: totalRes[req.cookies['name']].length > 16 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][16 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_18: totalRes[req.cookies['name']].length > 17 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][17 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_19: totalRes[req.cookies['name']].length > 18 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][18 + spg[req.cookies['name']] * 20 ]-1].title : '',
				title_20: totalRes[req.cookies['name']].length > 19 + spg[req.cookies['name']] * 20 ? result[totalRes[req.cookies['name']][19 + spg[req.cookies['name']] * 20 ]-1].title : '',
				
				pic_1: totalRes[req.cookies['name']].length > 0 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][0 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_2: totalRes[req.cookies['name']].length > 1 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][1 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_3: totalRes[req.cookies['name']].length > 2 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][2 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_4: totalRes[req.cookies['name']].length > 3 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][3 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_5: totalRes[req.cookies['name']].length > 4 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][4 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_6: totalRes[req.cookies['name']].length > 5 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][5 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_7: totalRes[req.cookies['name']].length > 6 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][6 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_8: totalRes[req.cookies['name']].length > 7 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][7 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_9: totalRes[req.cookies['name']].length > 8 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][8 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_10: totalRes[req.cookies['name']].length > 9 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][9 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_11: totalRes[req.cookies['name']].length > 10 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][10 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_12: totalRes[req.cookies['name']].length > 11 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][11 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_13: totalRes[req.cookies['name']].length > 12 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][12 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_14: totalRes[req.cookies['name']].length > 13 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][13 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_15: totalRes[req.cookies['name']].length > 14 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][14 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_16: totalRes[req.cookies['name']].length > 15 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][15 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_17: totalRes[req.cookies['name']].length > 16 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][16 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_18: totalRes[req.cookies['name']].length > 17 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][17 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_19: totalRes[req.cookies['name']].length > 18 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][18 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				pic_20: totalRes[req.cookies['name']].length > 19 + spg[req.cookies['name']] * 20 ? head + totalRes[req.cookies['name']][19 + spg[req.cookies['name']] * 20 ].toString() +rear : '""',
				
				line_1: totalRes[req.cookies['name']].length > 0 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_2: totalRes[req.cookies['name']].length > 1 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_3: totalRes[req.cookies['name']].length > 2 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_4: totalRes[req.cookies['name']].length > 3 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_5: totalRes[req.cookies['name']].length > 4 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_6: totalRes[req.cookies['name']].length > 5 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_7: totalRes[req.cookies['name']].length > 6 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_8: totalRes[req.cookies['name']].length > 7 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_9: totalRes[req.cookies['name']].length > 8 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_10: totalRes[req.cookies['name']].length > 9 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_11: totalRes[req.cookies['name']].length > 10 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_12: totalRes[req.cookies['name']].length > 11 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_13: totalRes[req.cookies['name']].length > 12 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_14: totalRes[req.cookies['name']].length > 13 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_15: totalRes[req.cookies['name']].length > 14 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_16: totalRes[req.cookies['name']].length > 15 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_17: totalRes[req.cookies['name']].length > 16 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_18: totalRes[req.cookies['name']].length > 17 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_19: totalRes[req.cookies['name']].length > 18 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '',
				line_20: totalRes[req.cookies['name']].length > 19 + spg[req.cookies['name']] * 20 ? '-----------------------------------------------------': '""'	
			}));
			//console.log(result);
			
		});
	//});
});

app.get("/search/:pick", function(req, res) {
	connection.query("SELECT * FROM photo_tags AS a INNER JOIN vision_api AS b ON a.id=b.id WHERE a.id=" + "'" + totalRes[req.cookies['name']][req.params.pick-1] + "'", function (err, result, fields) {
		var label = [], landmark = []
		var k=0;
		for(var i=0; i<31; ++i) {
			label.push("NULL");
			if(result[0]["label"+i.toString()]!="NULL")
				label[k++]=(result[0]["label"+i.toString()]);
		}
		k=0;
		for(var i=0; i<6; ++i) {
			landmark.push("NULL");
			if(result[0]["landmark"+i.toString()]!="NULL")
				landmark[k++]=(result[0]["landmark"+i.toString()]);
		}
		res.send(render('pic_info.html', {
			pic : '"http://140.116.82.135:8000/photo_server/photo%20(' + totalRes[req.cookies['name']][req.params.pick-1 +spg[req.cookies['name']]*20] + ').jpg"',
			title: result[0].title=='NULL' ? '' : result[0].title,
			date: result[0].date=='NULL' ? '' : result[0].date,
			latitude: result[0].latitude=='NULL' ? '' : result[0].latitude,
			altitude: result[0].altitude=='NULL' ? '' : result[0].altitude,
			longitude: result[0].longitude=='NULL' ? '' : result[0].longitude,
			orientation: result[0].orientation=='NULL' ? '' : result[0].orientation,
			azimuth: result[0].azimuth=='NULL' ? '' : result[0].azimuth,
			weather: result[0].weather=='NULL' ? '' : result[0].weather,
			address: result[0].address=='NULL' ? '' : result[0].address,
			era: result[0].era=='NULL' ? '' : result[0].era,
			category: result[0].category=='NULL' ? '' : result[0].category,
			keyword: result[0].keyword=='NULL' ? '' : result[0].keyword,
			description: result[0].description=='NULL' ? '' : result[0].description,
			reference: result[0].reference=='NULL' ? '' : result[0].reference,
			companion: result[0].companion=='NULL' ? '' : result[0].companion,
			priority: result[0].priority=='NULL' ? '' : result[0].priority,
			contributor: result[0].contributor=='NULL' ? '' : result[0].contributor,
			label0: label[0]=='NULL' ? '' : label[0],
			label1: label[1]=='NULL' ? '' : label[1],
			label2: label[2]=='NULL' ? '' : label[2],
			label3: label[3]=='NULL' ? '' : label[3],
			label4: label[4]=='NULL' ? '' : label[4],
			label5: label[5]=='NULL' ? '' : label[5],
			label6: label[6]=='NULL' ? '' : label[6],
			label7: label[7]=='NULL' ? '' : label[7],
			label8: label[8]=='NULL' ? '' : label[8],
			label9: label[9]=='NULL' ? '' : label[9],
			label10: label[10]=='NULL' ? '' : label[10],
			label11: label[11]=='NULL' ? '' : label[11],
			label12: label[12]=='NULL' ? '' : label[12],
			label13: label[13]=='NULL' ? '' : label[13],
			label14: label[14]=='NULL' ? '' : label[14],
			label15: label[15]=='NULL' ? '' : label[15],
			label16: label[16]=='NULL' ? '' : label[16],
			label17: label[17]=='NULL' ? '' : label[17],
			label18: label[18]=='NULL' ? '' : label[18],
			label19: label[19]=='NULL' ? '' : label[19],
			label20: label[20]=='NULL' ? '' : label[20],
			label21: label[21]=='NULL' ? '' : label[21],
			label22: label[22]=='NULL' ? '' : label[22],
			label23: label[23]=='NULL' ? '' : label[23],
			label24: label[24]=='NULL' ? '' : label[24],
			label25: label[25]=='NULL' ? '' : label[25],
			label26: label[26]=='NULL' ? '' : label[26],
			label27: label[27]=='NULL' ? '' : label[27],
			label28: label[28]=='NULL' ? '' : label[28],
			label29: label[29]=='NULL' ? '' : label[29],
			label30: label[30]=='NULL' ? '' : label[30],
			landmark0: landmark[0]=='NULL' ? '' : landmark[0],
			landmark1: landmark[1]=='NULL' ? '' : landmark[1],
			landmark2: landmark[2]=='NULL' ? '' : landmark[2],
			landmark3: landmark[3]=='NULL' ? '' : landmark[3],
			landmark4: landmark[4]=='NULL' ? '' : landmark[4],
			landmark5: landmark[5]=='NULL' ? '' : landmark[5]
		}));
	});	
});

port = process.env.PORT || 1001;
server.listen(port, function() {
    console.log("Listening on " + port);
});
//const io = require('socket.io')(server).listen(port);