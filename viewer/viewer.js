var awsIot = require('aws-iot-device-sdk');

// Define MQTT topic
var topic = 'edison/accl';
var queue_length = 10;

// Define parameters for AWS IoT
var device = awsIot.device({
   keyPath: 'privatekey.pem',
    certPath: 'cert.pem',
    caPath: 'rootca.pem',
    clientId: 'dummyClient-sub',
    region: 'us-east-1'
});

// Define parameters for blessed 
var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , screen = blessed.screen()
  , grid = new contrib.grid({rows:12, cols:12, screen: screen})
, lineData = [
    { title: 'X', style: { line: 'red' }, x:[], y:[] },
    { title: 'Y', style: { line: 'yellow' }, x:[], y:[] },
    { title: 'Z', style: { line: 'blue' }, x:[], y:[] }
];

// Set Grid
var line = grid.set(0, 0, 6, 12, contrib.line,
             { style:
               { line: "yellow"
               , text: "green"
               , baseline: "black"
               }
               , xLabelPadding: 3
               , xPadding: 5
               , label: 'Accelerator Data Graph'
             }
           )

var log = grid.set(6, 0, 6, 12, contrib.log,
            { fg: "green"
            , label: 'Subscribed message'
            , height: "30%"
            , tags: true
            , border: {type: "line", fg: "cyan"}
            }
		  )

// Write Line
line.setData(lineData);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Connect to AWS IoT Message Broker
device
  .on('connect', function() {
    device.subscribe(topic);
    });

// Retrieve message from topic and render graph
device
    .on('message', function(topic, payload) {

	// For debug
	//console.log("subscribed: " + payload);
	
	// Parse subscribed message
	var data = JSON.parse(payload);

	// Remove oldest data if queue length over threshold
	if ( lineData[0].x.length > queue_length ) {
	    line.Data[0].x.shift();
	    line.Data[0].y.shift();
	    line.Data[1].x.shift();
	    line.Data[1].y.shift();
	    line.Data[2].x.shift();
	    line.Data[2].y.shift();
	}

	// Append new data 
	lineData[0].x.push(data.timestamp);
	lineData[0].y.push(data.acclX);
	lineData[1].x.push(data.timestamp);
	lineData[1].y.push(data.acclY);
	lineData[2].x.push(data.timestamp);
	lineData[2].y.push(data.acclZ);
      
	// Render the graph
	line.setData(lineData);
	log.log(payload.toString());
	screen.render();
});

