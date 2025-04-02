"use client"

import { useState, useEffect, useCallback } from "react"

export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)

  useEffect(() => {

    // Em uma aplicação real, esta parte conecta ao seu servidor WebSocket
    // Para fins de simulação,  Vamos fazer uma implementação simulada de WebSocket.

    const mockSocket = new MockWebSocket()
    setSocket(mockSocket)

    mockSocket.onopen = () => {
      setIsConnected(true)
      console.log("WebSocket connected")
    }

    mockSocket.onmessage = (event) => {
      setLastMessage(event)
    }

    mockSocket.onclose = () => {
      setIsConnected(false)
      console.log("WebSocket disconnected")
    }

    return () => {
      mockSocket.close()
    }
  }, [])

  const sendMessage = useCallback(
    (message: string) => {
      if (socket && isConnected) {
        socket.send(message)
      }
    },
    [socket, isConnected],
  )

  return { isConnected, lastMessage, sendMessage }
}

// Implementação da versão mockada do websocket
class MockWebSocket {
  onopen: (() => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onclose: (() => void) | null = null

  private simulationInterval: NodeJS.Timeout | null = null
  private isSimulating = false
  private lastHeartRate = 75
  private lastHrv = 50
  private lastEda = 2.5
  private lastSkinTemp = 36.5
  private lastMovementX = 0
  private lastMovementY = 0
  private lastMovementZ = 0
  private stressLevel = 0
  private stressIncreasing = false
  private alertTimeout: NodeJS.Timeout | null = null

  constructor() {
    // Simula a conecção com um pequeno dalay
    setTimeout(() => {
      if (this.onopen) this.onopen()
    }, 500)
  }

  send(message: string) {
    try {
      const data = JSON.parse(message)

      if (data.action === "startSimulation" && !this.isSimulating) {
        this.startSimulation()
      } else if (data.action === "stopSimulation" && this.isSimulating) {
        this.stopSimulation()
      }
    } catch (error) {
      console.error("Failed to parse message:", error)
    }
  }

  close() {
    this.stopSimulation()
    setTimeout(() => {
      if (this.onclose) this.onclose()
    }, 100)
  }

  private startSimulation() {
    this.isSimulating = true

    // Gera dados do sensor a cada segundo
    this.simulationInterval = setInterval(() => {
      this.generateSensorData()
    }, 1000)

    // Gera randomicamentos os padrões
    this.scheduleStressEvent()
  }

  private stopSimulation() {
    this.isSimulating = false

    if (this.simulationInterval) {
      clearInterval(this.simulationInterval)
      this.simulationInterval = null
    }

    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout)
      this.alertTimeout = null
    }
  }

  private generateSensorData() {
    // Adiciona os dados Randomicamente
    if (this.stressIncreasing) {
      // Durante eventual Stress, aumenta os parametros
      this.lastHeartRate += Math.random() * 2 - 0.5 + 0.5
      this.lastHrv -= Math.random() * 2 - 0.5 + 0.5
      this.lastEda += Math.random() * 0.2 - 0.05 + 0.1
      this.stressLevel += 0.1
    } else {
      // Variação normal
      this.lastHeartRate += Math.random() * 2 - 1
      this.lastHrv += Math.random() * 2 - 1
      this.lastEda += Math.random() * 0.2 - 0.1
      this.stressLevel = Math.max(0, this.stressLevel - 0.05)
    }

    // Mantenha os valores em faixas realistas
    this.lastHeartRate = Math.max(60, Math.min(120, this.lastHeartRate))
    this.lastHrv = Math.max(20, Math.min(80, this.lastHrv))
    this.lastEda = Math.max(1, Math.min(10, this.lastEda))

   // Oscilações aleatórias da temperatura da pele
    this.lastSkinTemp += Math.random() * 0.2 - 0.1
    this.lastSkinTemp = Math.max(35, Math.min(38, this.lastSkinTemp))

    // Movimento randômico
    this.lastMovementX = Math.random() * 2 - 1
    this.lastMovementY = Math.random() * 2 - 1
    this.lastMovementZ = Math.random() * 2 - 1

    const sensorData = {
      timestamp: Date.now(),
      heartRate: this.lastHeartRate,
      hrv: this.lastHrv,
      eda: this.lastEda,
      skinTemp: this.lastSkinTemp,
      movement: {
        x: this.lastMovementX,
        y: this.lastMovementY,
        z: this.lastMovementZ,
      },
    }

    // Enviar os dados por meio do WebSocket
    if (this.onmessage) {
      const event = new MessageEvent("message", {
        data: JSON.stringify({
          type: "sensorData",
          payload: sensorData,
        }),
      })
      this.onmessage(event)
    }

    // Verificar se é necessário gerar um alerta
    if (this.stressLevel > 0.8) {
      this.generateAlert(sensorData)
      this.stressLevel = 0
      this.stressIncreasing = false
    }
  }

  private generateAlert(sensorData: any) {
    const alertTypes = [
      {
        title: "Possível Ansiedade Detectada",
        description: "Detectamos uma frequência cardíaca elevada e mudanças na condutância da pele, o que pode ser um sinal de ansiedade. Fique tranquilo, estamos aqui para ajudar!",
        severity: "medium",
      },
      {
        title: "Padrão de Estresse Elevado",
        description: "Seus indicadores apontam para uma resposta intensa ao estresse. Estamos aqui para ajudar você a entender melhor o que pode estar acontecendo.",
        severity: "high",
      },
      {
        title: "Padrão de Movimento Repetitivo",
        description: "Detectamos movimentos repetitivos. Isso pode ser uma forma natural de autorregulação e conforto. Tudo bem se você precisar desse momento!",
        severity: "low",
      },
    ]

    const selectedAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)]

    const alert = {
      id: `alert-${Date.now()}`,
      timestamp: Date.now(),
      title: selectedAlert.title,
      description: selectedAlert.description,
      severity: selectedAlert.severity as "low" | "medium" | "high",
      sensorData: sensorData,
    }

    // Enviar o alerta por meio do WebSocket
    if (this.onmessage) {
      const event = new MessageEvent("message", {
        data: JSON.stringify({
          type: "alert",
          payload: alert,
        }),
      })
      this.onmessage(event)
    }
  }

  private scheduleStressEvent() {
    // Programa um evento de estresse após um intervalo aleatório
    const randomTime = 30000 + Math.random() * 60000 // Entre 30s e 90s

    this.alertTimeout = setTimeout(() => {
      this.stressIncreasing = true

      // O evento de estresse dura de 15 a 30 segundos
      setTimeout(
        () => {
          this.stressIncreasing = false

          // Programa o próximo evento de estresse
          this.scheduleStressEvent()
        },
        15000 + Math.random() * 15000,
      )
    }, randomTime)
  }
}

