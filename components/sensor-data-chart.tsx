"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SensorData } from "@/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface SensorDataChartProps {
  data: SensorData[]
}

export default function SensorDataChart({ data }: SensorDataChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const formattedData = data.map((item, index) => ({
      name: index,
      heartRate: item.heartRate,
      hrv: item.hrv,
      eda: item.eda,
      skinTemp: item.skinTemp,
      movementX: item.movement.x,
      movementY: item.movement.y,
      movementZ: item.movement.z,
    }))

    setChartData(formattedData)
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualização dos Dados</CardTitle>
        <CardDescription>Leituras dos sensores em tempo real do dispositivo</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vitals">
          <TabsList>
            <TabsTrigger value="vitals">Sinais Vitais</TabsTrigger>
            <TabsTrigger value="movement">Movimento</TabsTrigger>
          </TabsList>
          <TabsContent value="vitals" className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: "Tempo", position: "insideBottomRight", offset: -5 }} />
                <YAxis
                  yAxisId="left"
                  label={{ value: "FC (BPM) / VFC (ms)", angle: -90, position: "insideLeft" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: "EDA (μS) / Temp (°C)", angle: -90, position: "insideRight" }}
                />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="heartRate" stroke="#8884d8" name="FC (BPM)" />
                <Line yAxisId="left" type="monotone" dataKey="hrv" stroke="#82ca9d" name="VFC (ms)" />
                <Line yAxisId="right" type="monotone" dataKey="eda" stroke="#ff7300" name="EDA (μS)" />
                <Line yAxisId="right" type="monotone" dataKey="skinTemp" stroke="#ff0000" name="Temperatura da Pele (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="movement" className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: "Tempo", position: "insideBottomRight", offset: -5 }} />
                <YAxis label={{ value: "Aceleração (g)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="movementX" stroke="#8884d8" name="Eixo X" />
                <Line type="monotone" dataKey="movementY" stroke="#82ca9d" name="Eixo Y" />
                <Line type="monotone" dataKey="movementZ" stroke="#ff7300" name="Eixo Z" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
