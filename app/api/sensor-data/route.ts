import { type NextRequest, NextResponse } from "next/server"
import type { SensorData } from "@/lib/types"


export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Verifica e valida os dados recebidos.
    if (!validateSensorData(data)) {
      return NextResponse.json({ error: "Invalid sensor data format" }, { status: 400 })
    }

    // Em uma aplicação real, poderiamos seguir esse caminho:
    // 1. Armazenaria os dados no TimescaleDB/InfluxDB.
    // 2. Processaria os dados para identificar padrões.
    // 3. Geraria alertas, necessarios.

    // Para fins de simulação, vamos apenas retornar um status de sucesso.
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing sensor data:", error)
    return NextResponse.json({ error: "Failed to process sensor data" }, { status: 500 })
  }
}

function validateSensorData(data: any): data is SensorData {
  return (
    typeof data === "object" &&
    typeof data.timestamp === "number" &&
    typeof data.heartRate === "number" &&
    typeof data.hrv === "number" &&
    typeof data.eda === "number" &&
    typeof data.skinTemp === "number" &&
    typeof data.movement === "object" &&
    typeof data.movement.x === "number" &&
    typeof data.movement.y === "number" &&
    typeof data.movement.z === "number"
  )
}

