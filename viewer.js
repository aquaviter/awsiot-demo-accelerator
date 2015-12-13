var awsIot = require('aws-iot-device-sdk');
var topic = 'edison/illuminance';

var device = awsIot.device({
   keyPath: 'privatekey.pem',
  certPath: 'cert.pem',
    caPath: 'rootca.pem',
  clientId: 'dummyClient-sub',
    region: 'us-east-1'
});

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

      // Parse subscribed message
      var data = JSON.parse(payload);
      var timestamp = moment(data.timestamp).format("HH:mm:ss");

      
      lineData[0].x.push(timestamp);
      lineData[0].y.push(data.accX);
      lineData[1].x.push(timestamp);
      lineData[1].y.push(data.accY);
      lineData[2].x.push(timestamp);
      lineData[2].y.push(data.accZ);
      
    // Render the graph
      line.setData(lineData);
      log.log(payload);
    screen.render();
});

