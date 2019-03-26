const http = require('http');
const uuidv4 = require('uuid/v4');
const shell = require('shelljs');
const formidable = require('formidable');
const readChunk = require('read-chunk');
const fileType = require('file-type');
var cmds = require('./snap-processor-cmds.js');

corsVar = process.env.CORSVAR || 'https://dtube.nannal.com';

// variable to assure only one upload request happens
var reqhappened = false;

// generated token
const genToken = uuidv4();


http.createServer(function (req, res) {


<<<<<<< HEAD
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, Authorization, Accept');
	res.setHeader('Access-Control-Allow-Headers', 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range');
	res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
	res.setHeader('access-control-allow-origin', corsVar);
	res.setHeader('Access-Control-Max-Age', '1728000');
	res.setHeader('Connection', 'keep-alive');
	// res.setHeader('Content-Type', 'application/json; charset=utf-8');
	// res.setHeader('Content-Type', 'text/plain; charset=utf-8');

	if (req.url == '/getStatus') {
	res.statusCode = 200;
	res.end('{"version":"0.7.5","currentWaitingInQueue":{"audioCpuToEncode":0,"videoGpuToEncode":0,"audioVideoCpuToEncode":0,"spriteToCreate":0,"ipfsToAdd":0}}');
	};
=======
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Headers', 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('access-control-allow-origin', corsVar);
  res.setHeader('Access-Control-Max-Age', '1728000');
  res.setHeader('Connection', 'keep-alive');
  // res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (req.url == '/getStatus') {
    res.statusCode = 200;
    res.end('{"version":"0.7.5","currentWaitingInQueue":{"audioCpuToEncode":0,"videoGpuToEncode":0,"audioVideoCpuToEncode":0,"spriteToCreate":0,"ipfsToAdd":0}}');
  };
>>>>>>> 4234e7a... tabs to spaces

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

<<<<<<< HEAD
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
=======
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
>>>>>>> 4234e7a... tabs to spaces

	form.on('file', function (name, file) {

	//frontend needs to know if upload was successful and receive the token
	var successResponse = { success: "", token: ""};
	var allowedExtensions = ['jpg', 'jpeg', 'bmp', 'png'];

	const buffer = readChunk.sync(file.path, 0, fileType.minimumBytes);

	var uploadedFileType = fileType(buffer).ext;
	console.log(uploadedFileType);

	if (!allowedExtensions.includes(uploadedFileType)){

<<<<<<< HEAD
	// if not image, success is false, no token, end process
	successResponse.success = "false";
	res.end(JSON.stringify(successResponse));
	process.exit();
=======
          // if not image, success is false, no token, end process
          successResponse.success = "false";
          res.end(JSON.stringify(successResponse));
          process.exit();
>>>>>>> 4234e7a... tabs to spaces

	} else {

<<<<<<< HEAD
	// if file is valid, success is true and provide token
	successResponse.success = "true";
	successResponse.token = genToken;
	res.end(JSON.stringify(successResponse));

	// resize the image with shell command
	shell.exec(cmds.shell_cmds.createResizeCmd(file.path), function(code, stdout, stderr) {
	// if code aint 0 there's an error
	if (code) {
	console.log(stderr);
	process.exit();
	}
	// upload resized (called source for some reason) image to ipfs
	cmds.ipfs_cmds.ipfsUpload("./snap/resizedImg", "ipfsAddSource");
=======
          // if file is valid, success is true and provide token
          successResponse.success = "true";
          successResponse.token = genToken;
          res.end(JSON.stringify(successResponse));

          // resize the image with shell command
          shell.exec(cmds.shell_cmds.createResizeCmd(file.path), function(code, stdout, stderr) {
            // if code aint 0 there's an error
            if (code) {
              console.log(stderr);
              process.exit();
            }
            // upload resized (called source for some reason) image to ipfs
            cmds.ipfs_cmds.ipfsUpload("./snap/resizedImg", "ipfsAddSource");
>>>>>>> 4234e7a... tabs to spaces

	// overlay dtube logo on image with shell command
	shell.exec(cmds.shell_cmds.createOverlayCmd("./snap/resizedImg"), function(code, stdout, stderr){
	// if code aint 0 there's an error
	if (code) {
	console.log(stderr);
	process.exit();
	}
	// upload overlayed image to ipfs
	cmds.ipfs_cmds.ipfsUpload("./snap/overlayedImg", "ipfsAddOverlay");

	// check if finished and exit if done.
	cmds.checkIfFinished();

	});

	});

	}

	});

<<<<<<< HEAD
	form.on('error', function(err) {
	console.error('Error', err)
	process.exit();
	});
=======
      form.on('error', function(err) {
        console.error('Error', err)
        process.exit();
      });
>>>>>>> 4234e7a... tabs to spaces

	}

	} else {
	res.end("There's nothing here for you");
	}

}).listen(5000, ()=> {

  console.log("listening on port 5000");

});
