import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {

    // Em uma aplicação real, Podemos fazer:
    // 1. Consultaria o banco de dados para obter os alertas mais recentes.
    // 2. Aplicaria os filtros especificados nos parâmetros da requisição.

    // Para fins de simulação, retornaremos dados mockados.
    const mockAlerts = [
      {
        id: "alert-1",
        timestamp: Date.now() - 1000 * 60 * 5, // 2 minutes ago
        title: "Possível Ansiedade Detectada",
        description: "Detectamos uma frequência cardíaca elevada e mudanças na condutância da pele, o que pode ser um sinal de ansiedade. Fique tranquilo, estamos aqui para ajudar!",
        severity: "medium",
        sensorData: {
          timestamp: Date.now() - 1000 * 60 * 5,
          heartRate: 95,
          hrv: 35,
          eda: 8.2,
          skinTemp: 37.1,
          movement: { x: 0.5, y: 0.3, z: 0.8 },
        },
      },
      {
        id: "alert-2",
        timestamp: Date.now() - 1000 * 60 * 30, // 2 minutes ago
        title: "Padrão de Estresse Elevado",
        description: "Vários indicadores fisiológicos apontam para uma resposta intensa ao estresse. Estamos aqui para ajudar você a entender melhor o que pode estar acontecendo.",
        severity: "high",
        sensorData: {
          timestamp: Date.now() - 1000 * 60 * 30,
          heartRate: 110,
          hrv: 25,
          eda: 9.5,
          skinTemp: 37.4,
          movement: { x: 1.2, y: 0.8, z: 1.5 },
        },
      },
    ]

    return NextResponse.json({ alerts: mockAlerts })
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

