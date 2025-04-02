import type { Alert as AlertType } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock } from "lucide-react"

interface AlertsPanelProps {
  alerts: AlertType[]
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Comportamento</CardTitle>
          <CardDescription>Nenhum alerta detectado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Quando o sistema identificar sinais de ansiedade ou padrões de estresse, os alertas aparecerão aqui.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Comportamento</CardTitle>
        <CardDescription>Padrões Comportamentais Detectados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <Alert key={index} variant={alert.severity === "high" ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center gap-2">
                {alert.title}
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

