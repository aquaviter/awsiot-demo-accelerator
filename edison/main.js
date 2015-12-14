var awsIot = require('aws-iot-device-sdk');
var adxl345 = require('jsupm_adxl345');

// Instantiate on I2C bus
var adxl = new adxl345.Adxl345(0);

// Define MQTT topic
var topic = 'edison/accl';

// Define paramerters to publish a message
var device = awsIot.device({
    keyPath: 'privatekey.pem',
    certPath: 'cert.pem',
    caPath: 'rootca.pem',
    clientId: 'eison_pub_client',
    region: 'us-east-1'
});

// Connect to AWS IoT Message Broker via MQTTS
device.on('connect', function() {
    console.log('Connected to Message Broker.');

    // Loop in 1s
    setInterval( function() {
	adxl.update(); // Update the data
	var raw = adxl.getRawValues(); // Read raw sensor data
	var force = adxl.getAcceleration(); // Read acceleration force (g) region: 'us-east-1'
	var rawvalues = raw.getitem(0) + " " + raw.getitem(1) + " " + raw.getitem(2);

	console.log("Raw Values: " + rawvalues);
	console.log("ForceX: " + force.getitem(0).toFixed(2) + " g");
	console.log("ForceY: " + force.getitem(1).toFixed(2) + " g");
	console.log("ForceZ: " + force.getitem(2).toFixed(2) + " g");

	// Compose records
	var record = {
	    "timestamp": (new Date).getTime()/1000|0,
	    "acclX":  force.getitem(0).toFixed(2),
	    "acclY":  force.getitem(1).toFixed(2),
	    "acclZ":  force.getitem(2).toFixed(2)
	};
	
	// Serialize record to JSON format and publish a message
	var message = JSON.stringify(record);
	console.log("Publish: " + message);
	device.publish(topic, message);
	
    }, 1000);
});

