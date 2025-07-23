# Sistema de Evaluación IA para Startups

## 🚀 Descripción General

Este sistema implementa un flujo completo de evaluación automática de startups utilizando inteligencia artificial, basado en el libro "The Art of Startup Fundraising" como base de conocimiento y una rúbrica estructurada de criterios.

## 📋 Flujo de Evaluación

### 1. **Listado de Evaluaciones** (`/admin/evaluaciones`)
- Muestra todas las evaluaciones de startups
- Las evaluaciones con estado `PENDIENTE` se enlazan a la página de respuestas
- Las evaluaciones completadas se enlazan a la revisión IA

### 2. **Revisión de Respuestas** (`/admin/evaluaciones/[id]/respuestas`)
- Muestra las 16 respuestas de la startup agrupadas por categoría en un acordeón
- Permite agregar comentarios y solicitar aclaraciones
- Botón para iniciar evaluación IA (si no existe)
- Botón para ver evaluación IA (si ya existe)

### 3. **Revisión IA** (`/admin/evaluaciones/[id]/revision-ia`)
- Muestra evaluación completa generada por IA
- Incluye puntuaciones por criterio con justificaciones
- Análisis de fortalezas, debilidades y recomendaciones
- Rúbrica de criterios visible para el administrador
- Formulario para decisión final (Aprobar/Rechazar/Requiere Revisión)

## 🧠 Arquitectura IA

### **Evaluador de Startups** (`startup-evaluator.ts`)
- **Singleton Pattern**: Una instancia global del evaluador
- **Evaluación por Categorías**: Procesa las 4 categorías de criterios
- **Integración Vector Store**: Utiliza conocimiento del libro para contexto
- **Generación de Justificaciones**: Basadas en mejores prácticas del sector

### **Vector Store** (`vector-store-config.ts`)
- **Base de Conocimiento**: Contenido del libro "The Art of Startup Fundraising"
- **Chunking por Categorías**: Conocimiento organizado por criterios de evaluación
- **Búsqueda Semántica**: Embeddings para encontrar contenido relevante
- **Contexto Enriquecido**: Proporciona contexto específico para cada evaluación

### **Criterios de Evaluación** (`criteria.ts`)
- **4 Categorías Principales**:
  1. Complejidad del Problema
  2. Tamaño y Validación de Mercado
  3. Potencial de Escalabilidad
  4. Experiencia y Capacidad del Equipo
- **Rúbrica de 4 Niveles**: Cada categoría tiene 4 niveles de cumplimiento
- **Ponderación**: Cada criterio tiene un peso específico en la evaluación

## 🔄 Flujo de Datos

```
1. Usuario inicia evaluación IA
   ↓
2. Sistema obtiene respuestas de la startup
   ↓
3. Para cada categoría:
   - Busca contexto relevante en vector store
   - Genera prompt con contexto y respuestas
   - Llama a GPT-4 para evaluación
   - Parsea respuesta JSON
   ↓
4. Calcula puntaje total y confianza
   ↓
5. Genera análisis general (fortalezas, debilidades, recomendaciones)
   ↓
6. Determina decisión final
   ↓
7. Guarda evaluación completa
```

## 🎯 Criterios de Evaluación

### **Complejidad del Problema**
- **Nivel 1**: Problema simple, solución básica
- **Nivel 2**: Problema moderado, requiere innovación
- **Nivel 3**: Problema complejo, solución innovadora
- **Nivel 4**: Problema crítico, solución revolucionaria

### **Tamaño y Validación de Mercado**
- **Nivel 1**: Mercado pequeño, sin validación
- **Nivel 2**: Mercado mediano, validación inicial
- **Nivel 3**: Mercado grande, validación sólida
- **Nivel 4**: Mercado masivo, validación completa

### **Potencial de Escalabilidad**
- **Nivel 1**: Modelo no escalable
- **Nivel 2**: Escalabilidad limitada
- **Nivel 3**: Alto potencial de escalabilidad
- **Nivel 4**: Escalabilidad exponencial

### **Experiencia y Capacidad del Equipo**
- **Nivel 1**: Equipo inexperto
- **Nivel 2**: Experiencia básica
- **Nivel 3**: Experiencia sólida
- **Nivel 4**: Equipo excepcional

## 📊 Decisiones Finales

### **APROBADA**
- Puntaje total ≥ 75
- Todos los criterios ≥ Nivel 3

### **RECHAZADA**
- Puntaje total < 50
- Algún criterio ≤ Nivel 1

### **REQUIERE_REVISION**
- Puntaje total entre 50-74
- Criterios mixtos

## 🔧 Configuración

### **Variables de Entorno**
```env
OPENAI_API_KEY=tu_api_key_de_openai
```

### **Modelos Utilizados**
- **GPT-4 Turbo**: Para evaluación y análisis
- **Text Embedding 3 Small**: Para embeddings del vector store

## 📁 Estructura de Archivos

```
src/
├── lib/ai/
│   ├── startup-evaluator.ts      # Evaluador principal
│   ├── vector-store-config.ts    # Vector store y base de conocimiento
│   ├── criteria.ts               # Criterios y rúbrica
│   └── openai-config.ts          # Configuración OpenAI
├── data/mock/
│   ├── database.ts               # Base de datos simulada
│   ├── repository.ts             # Acceso a datos
│   └── services.ts               # Servicios de evaluación
├── types/
│   └── evaluacion.ts             # Tipos TypeScript
└── app/(dashboard)/admin/evaluaciones/
    ├── page.tsx                  # Listado de evaluaciones
    ├── [id]/respuestas/
    │   └── page.tsx              # Revisión de respuestas
    └── [id]/revision-ia/
        └── page.tsx              # Revisión IA
```

## 🚀 Uso

1. **Configurar API Key**: Asegurar que `OPENAI_API_KEY` esté configurada
2. **Navegar a Evaluaciones**: Ir a `/admin/evaluaciones`
3. **Revisar Respuestas**: Hacer clic en evaluación pendiente
4. **Iniciar IA**: Hacer clic en "Iniciar Evaluación IA"
5. **Revisar Resultados**: Ver evaluación completa con justificaciones
6. **Tomar Decisión**: Aprobar, rechazar o solicitar revisión

## 🎨 Características de la UI

- **Diseño Responsivo**: Funciona en desktop y móvil
- **Acordeón por Categorías**: Organización clara de respuestas
- **Rúbrica Visible**: Criterios siempre accesibles
- **Colores Intuitivos**: Indicadores visuales de niveles
- **Navegación Clara**: Flujo intuitivo entre páginas
- **Estados Visuales**: Indicadores de progreso y estado

## 🔮 Próximas Mejoras

- [ ] Integración con base de datos real
- [ ] Historial de evaluaciones
- [ ] Exportación de reportes
- [ ] Comparación entre startups
- [ ] Dashboard de métricas
- [ ] Notificaciones automáticas
- [ ] Workflow de aprobación multi-nivel 