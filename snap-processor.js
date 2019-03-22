const http = require('http');
const uuidv4 = require('uuid/v4');
const shell = require('shelljs');
const formidable = require('formidable');
const ifIsImage = require('if-is-image');
const readChunk = require('read-chunk');
const fileType = require('file-type');
var cmds = require('./snap-processor-cmds.js');


//Clean Up
shell.rm('-f', './upload/*');

// variable to assure only one upload request happens
var reqhappened = false;

// generated token
const genToken = uuidv4();


http.createServer(function (req, res) {


  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Headers', 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Origin', 'https://d.tube');
  res.setHeader('Access-Control-Max-Age', '1728000');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (req.url == '/getStatus') {
		res.statusCode = 200;
		res.end('{"version":"0.7.5","currentWaitingInQueue":{"audioCpuToEncode":0,"videoGpuToEncode":0,"audioVideoCpuToEncode":0,"spriteToCreate":0,"ipfsToAdd":0}}');
	};

  // sending progress to user
   if (req.url.match(/\/getProgressByToken.*/)) {
     res.end(JSON.stringify(cmds.processResponse));
   };




   if (req.url == '/uploadImage' && !reqhappened) {

         if (req.method === 'OPTIONS'){
             res.statusCode = 204;
             res.end();


          } else {

             res.statusCode = 200;

             reqhappened = true;
             var form = new formidable.IncomingForm();

               //Sane Form options
     				  form.maxFields = 1
     					form.encoding = 'utf-8';
     					form.maxFileSize = '1024000';

              form.parse(req, function (err, fields, files) {
    						});

              // file is moved to upload folder and renamed to uuid
    					form.on('fileBegin', function (name, file){
    			        file.path = "./upload/" + genToken;
    			    	});


              form.on('file', function (name, file) {

                    //frontend needs to know if upload was successful and receive the token
                    var successResponse = { success: "", token: ""};

                    const buffer = readChunk.sync(file.path, 0, fileType.minimumBytes);

                    console.log(fileType(buffer));

                    res.end("done for now");

              });



            }


   } else {
     res.end("There's nothing here for you");
   }

}).listen(5000, ()=> {

	console.log("listening on port 5000");

});
