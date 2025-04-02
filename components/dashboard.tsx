"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import SensorDataChart from "./sensor-data-chart"
import AlertsPanel from "./alerts-panel"
import type { Alert, SensorData } from "@/lib/types"
import { useWebSocket } from "@/hooks/use-websocket"

export default function Dashboard() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const { lastMessage, sendMessage } = useWebSocket()

  // Lida com as mensagens recebidas pelo WebSocket
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data)

        if (data.type === "sensorData") {
          setSensorData((prev) => {
            const newData = [...prev, data.payload]
            // Mantém apenas os últimos 100 pontos de dados
            return newData.length > 100 ? newData.slice(-100) : newData
          })
        } else if (data.type === "alert") {
          setAlerts((prev) => [data.payload, ...prev])
        }
      } catch (error) {
        console.error("Falha ao analisar a mensagem do WebSocket:", error)
      }
    }
  }, [lastMessage])

  // Inicia ou para a simulação
  const toggleSimulation = () => {
    const newState = !isSimulating
    setIsSimulating(newState)
    sendMessage(
      JSON.stringify({
        action: newState ? "startSimulation" : "stopSimulation",
      }),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Simulação de Sensores Wearables</h2>
        <Button
          onClick={toggleSimulation}
          className={isSimulating ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
        >
          {isSimulating ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> Parar Simulação
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Iniciar Simulação
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>FC</CardTitle>
            <CardDescription>Frequência Cardíaca</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {sensorData.length > 0 ? Math.round(sensorData[sensorData.length - 1]?.heartRate || 0) : "--"} BPM
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>VFC</CardTitle>
            <CardDescription>Variabilidade da Frequência Cardíaca</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {sensorData.length > 0 ? Math.round(sensorData[sensorData.length - 1]?.hrv || 0) : "--"} ms
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>EDA</CardTitle>
            <CardDescription>Atividade Eletrodérmica</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {sensorData.length > 0 ? sensorData[sensorData.length - 1]?.eda.toFixed(2) : "--"} μS
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Temperatura da Pele</CardTitle>
            <CardDescription>Temperatura Superficial</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {sensorData.length > 0 ? sensorData[sensorData.length - 1]?.skinTemp.toFixed(1) : "--"}°C
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts">
        <TabsList>
          <TabsTrigger value="charts">Dados Monitorados</TabsTrigger>
          <TabsTrigger value="alerts">
            Alertas
            {alerts.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {alerts.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="space-y-4">
          <SensorDataChart data={sensorData} />
        </TabsContent>
        <TabsContent value="alerts">
          <AlertsPanel alerts={alerts} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
