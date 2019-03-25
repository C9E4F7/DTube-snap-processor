const ipfsAPI = require('ipfs-http-client');
const fs = require('fs');


var ipfsIp = process.env.IPFSIP || '127.0.0.1';
var ipfsPort = process.env.IPFSPORT || '5001';
var ipfsProtocol = process.env.IPFSPROTOCOL || 'http';

var cmds = {

  shell_cmds: {
        // make sure all files and directories exist where they should
      createResizeCmd: (filePath) => {
          return `convert ` + filePath + ` -resize 640x360 -gravity Center -crop 640x360 ./snap/resizedImg`
      },

      // make sure all files and directories exist where they should
      createOverlayCmd: (filePath) => {
        return `composite -gravity NorthEast overlay.png ` + filePath +` ./snap/overlayedImg`
      }

  },

  ipfs_cmds: {

    // uploads file to ipfs, second parameter is the property to update within process response
    ipfsUpload: (filePath, prop) => {
      //Connceting to our http api
      const ipfs = ipfsAPI(ipfsIp, ipfsPort, {protocol: ipfsProtocol})
      let fileToUpload = fs.readFileSync(filePath);
      let testBuffer = new Buffer.from(fileToUpload);

      ipfs.add(testBuffer, function (err, file) {

          if (err) {
            console.log(err);
              process.exit();
            }
              // updating relevant process response fields
              cmds.setObjPropToValue(cmds.processResponse, prop+".progress", "100.00%");
              cmds.setObjPropToValue(cmds.processResponse, prop+".lastTimeProgress", Date());
              cmds.setObjPropToValue(cmds.processResponse, prop+".step", "success");
              cmds.setObjPropToValue(cmds.processResponse, prop+".hash", file[0].hash);
              cmds.setObjPropToValue(cmds.processResponse, prop+".fileSize", file[0].size);

          });

    }
  },

  // function for setting deep nested object property values
  setObjPropToValue: (obj, path, value) => {
    var i;
    path = path.split(/(?:\.|\[|\])+/);
    for (i = 0; i < path.length - 1; i++)
        obj = obj[path[i]];

    obj[path[i]] = value;
  },

  checkIfFinished: () => {

    var func = setInterval(()=>{

      if (cmds.processResponse.ipfsAddSource.progress == "100.00%" && cmds.processResponse.ipfsAddOverlay.progress == "100.00%"){
        clearInterval(func);
        // wait before ending process
        setTimeout(()=>{
          process.exit();
        },20000);
      }

    },2000);

  },

  processResponse: {
          "ipfsAddSource": {
            "progress": "0.00%",
            "encodeSize": "source",
            "lastTimeProgress": null,
            "errorMessage": null,
            "step": "Started",
            "positionInQueue": null,
            "hash": null,
            "fileSize": null
          },
          "ipfsAddOverlay": {
            "progress": "Waiting in queue...",
            "encodeSize": "source",
            "lastTimeProgress": null,
            "errorMessage": null,
            "step": "Waiting",
            "positionInQueue": 1,
            "hash": null,
            "fileSize": null
          }
        }

}

module.exports = cmds
