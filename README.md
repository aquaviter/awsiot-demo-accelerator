# AWS IoT Demo - Visualize Accelerator Sensor Data

## Get start
1. Download source code from github repository on edison and your Mac.

2. Create privatekey, certificates on your AWS Account and save them as privatekey.pem and
cert.pem into certs dir.

3. Download Root CA and save it as rootca.pem into certs dir.

4. Execute following commands on edison and your Mac.

```Edison
node edison/main.js
```

```Mac
node viewer/viewer.js
```
Additionally, please add AWS IoT rule in order to show customers archiving data into S3
and DynamoDB, and more...

## Specification

### MQTT Topic
edison/accl

### Message Format

Here is a message format edison publishes to AWS IoT.

```
{
  "timestamp" : <Number: Epoch>,
  "acclX" : <Number: float>,
  "acclY" : <Number: float>,
  "acclZ" : <Number: float>
}
```

