import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useEvaluation } from './temp_useEvaluation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'

export default function EvaluationPage() {
  const params = useParams()
  const router = useRouter()
  const { evaluation, isLoading, error, evaluateStartup } = useEvaluation(
    params.id as string
  )

  const handleEvaluate = async () => {
    try {
      await evaluateStartup(params.id as string)
      // No redirigimos automáticamente, dejamos que el usuario vea el reporte
    } catch (error) {
      console.error('Error en evaluación:', error)
    }
  }

  const handleBackToList = () => {
    router.push('/admin/evaluaciones')
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Progress value={45} className="w-1/2 mb-4" />
        <p className="text-muted-foreground">Cargando evaluación...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={handleBackToList}>Volver a la lista</Button>
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-muted-foreground mb-4">Evaluación no encontrada</p>
        <Button onClick={handleBackToList}>Volver a la lista</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Evaluación: {evaluation.startup?.name}
        </h1>
        <Button onClick={handleBackToList}>Volver a la lista</Button>
      </div>

      <div className="grid gap-6">
        {!evaluation.completedAt ? (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Evaluación Pendiente</h2>
            <p className="text-muted-foreground mb-4">
              Esta startup aún no ha sido evaluada. Haz clic en el botón para
              iniciar la evaluación.
            </p>
            <Button onClick={handleEvaluate}>Evaluar Startup</Button>
          </Card>
        ) : (
          <ScrollArea className="h-[600px]">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Reporte de Evaluación</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Puntaje Final</h3>
                  <p className="text-2xl font-bold">{evaluation.score}/100</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Fortalezas</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {evaluation.strengths?.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Áreas de Mejora</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {evaluation.weaknesses?.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Análisis Detallado</h3>
                  <div className="whitespace-pre-wrap">
                    {evaluation.detailedAnalysis}
                  </div>
                </div>
              </div>
            </Card>
          </ScrollArea>
        )}
      </div>
    </div>
  )
} 