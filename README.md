# AWS IoT Demo - Visualize Accelerator Sensor Data

## Specification

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

