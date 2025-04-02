export interface SensorData {
  timestamp: number
  heartRate: number
  hrv: number
  eda: number
  skinTemp: number
  movement: {
    x: number
    y: number
    z: number
  }
}

export interface Alert {
  id: string
  timestamp: number
  title: string
  description: string
  severity: "low" | "medium" | "high"
  sensorData: SensorData
}

