# AWS IoT Demo - Visualize Accelerator Sensor Data

## Specification

### Message Format

Here is a message format edison publishes to AWS IoT.

```
{
  "timestamp" : <Number: Epoch>,
  "accX" : <Number: float>,
  "accY" : <Number: float>,
  "accZ" : <Number: float>
}
```

