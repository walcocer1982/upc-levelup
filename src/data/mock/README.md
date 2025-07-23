# Base de Datos Mock - StartUPC

Esta es la estructura completa de la base de datos mock para el sistema StartUPC. Todos los datos están centralizados y organizados para facilitar la migración futura a una base de datos real.

## 📁 Estructura de Archivos

```
src/data/mock/
├── README.md              # Esta documentación
├── config.ts              # Configuración central del sistema mock
├── types.ts               # Tipos TypeScript centralizados
├── index.ts               # Exportaciones centralizadas
├── schema.ts              # Esquemas de criterios de evaluación
├── database.ts            # Base de datos normalizada
├── repository.ts          # Repositorio de datos
├── generator.ts           # Generador de datos mock
├── users.ts               # Datos de usuarios
├── startups.ts            # Datos de startups
├── convocatorias.ts       # Datos de convocatorias
├── postulaciones.ts       # Datos de postulaciones
├── evaluaciones.ts        # Datos de evaluaciones
├── auditoria.ts           # Datos de auditoría
└── roles.ts               # Definición de roles
```

## 🏗️ Arquitectura

### 1. **Configuración Central** (`config.ts`)
- Configuración global del sistema mock
- Parámetros de evaluación, almacenamiento, validación
- Configuración de desarrollo y producción

### 2. **Tipos Centralizados** (`types.ts`)
- Enums para roles, estados, tipos
- Interfaces para todas las entidades
- Tipos de utilidad y configuración

### 3. **Base de Datos Normalizada** (`database.ts`)
- Tablas normalizadas: startups, convocatorias, postulaciones, respuestas
- Relaciones entre entidades
- Datos consistentes y estructurados

### 4. **Repositorio de Datos** (`repository.ts`)
- Clase `PostulacionRepository` para acceso a datos
- Métodos para búsqueda, filtrado, estadísticas
- Lógica de negocio centralizada

### 5. **Generador de Datos** (`generator.ts`)
- Clase `MockDataGenerator` para crear datos de prueba
- Diferentes niveles de completitud
- Datos coherentes y realistas

## 📊 Entidades Principales

### Usuarios (`users.ts`)
- **Tipos**: ADMIN, FUNDADOR, MIEMBRO, EVALUADOR
- **Datos**: Información personal, roles, registro
- **Relaciones**: Con startups, evaluaciones, convocatorias

### Startups (`startups.ts`)
- **Información**: Nombre, descripción, categoría, sector
- **Estado**: ACTIVA, INACTIVA, SUSPENDIDA, CERRADA
- **Métricas**: Usuarios, ingresos, crecimiento
- **Impacto**: Empleos, beneficiarios, impacto social

### Convocatorias (`convocatorias.ts`)
- **Tipos**: ACELERACION, INCUBACION, CONCURSO, HACKATHON
- **Estado**: BORRADOR, ABIERTA, CERRADA, EN_EVALUACION, FINALIZADA
- **Información**: Fechas, cupos, requisitos, beneficios

### Postulaciones (`postulaciones.ts`)
- **Estado**: BORRADOR, ENVIADA, EN_REVISION, APROBADA, RECHAZADA
- **Relaciones**: Startup → Convocatoria
- **Evaluación**: Puntajes, comentarios, recomendaciones

### Respuestas (`database.ts`)
- **Criterios**: 16 criterios de evaluación (001-016)
- **Categorías**: 6 categorías principales
- **Tipos**: TEXT, NUMBER, BOOLEAN, SELECT, MULTI_SELECT, FILE

## 🎯 Criterios de Evaluación

### Categorías (6)
1. **INNOVACION** - Innovación y diferenciación
2. **VIABILIDAD_COMERCIAL** - Modelo de negocio y mercado
3. **EQUIPO** - Capacidades y experiencia del equipo
4. **IMPACTO_SOCIAL** - Beneficios sociales y ambientales
5. **ESCALABILIDAD** - Potencial de crecimiento
6. **SOSTENIBILIDAD** - Viabilidad a largo plazo

### Criterios (16)
- **001-003**: Innovación
- **004-006**: Viabilidad Comercial
- **007-009**: Equipo
- **010-012**: Impacto Social
- **013-014**: Escalabilidad
- **015-016**: Sostenibilidad

## 🔧 Uso del Sistema

### Importación Básica
```typescript
import { 
  mockUsers, 
  mockStartups, 
  mockConvocatorias,
  PostulacionRepository,
  obtenerEstadisticasCompletas 
} from '@/data/mock';
```

### Configuración
```typescript
import { MOCK_CONFIG, getMockConfig } from '@/data/mock';

// Obtener configuración
const config = getMockConfig();
console.log(config.APP_NAME); // 'StartUPC Mock'
```

### Repositorio de Datos
```typescript
import { PostulacionRepository } from '@/data/mock';

// Obtener todas las postulaciones
const postulaciones = PostulacionRepository.getAllPostulaciones();

// Buscar por startup
const postulacionesStartup = PostulacionRepository.getPostulacionesPorStartup('startup-001');

// Estadísticas de completitud
const stats = PostulacionRepository.getEstadisticasCompletitud();
```

### Generación de Datos
```typescript
import { MockDataGenerator } from '@/data/mock';

// Generar datos de prueba
await MockDataGenerator.generarDatosCompletos();

// Validar estructura
const esValida = await MockDataGenerator.validarEstructura();
```

## 📈 Estadísticas y Métricas

### Completitud de Postulaciones
- **Baja**: 25-50% (4-8 criterios respondidos)
- **Media**: 51-75% (9-12 criterios respondidos)
- **Alta**: 76-100% (13-16 criterios respondidos)

### Datos de Ejemplo
- **2 Startups** con diferentes niveles de completitud
- **1 Convocatoria** activa
- **2 Postulaciones** con respuestas variadas
- **16 Criterios** de evaluación
- **6 Categorías** principales

## 🔄 Migración Futura

### Preparación para Base de Datos Real
1. **Estructura Normalizada**: Los datos ya están normalizados
2. **Tipos TypeScript**: Interfaces listas para Prisma/SQL
3. **Repositorio Pattern**: Fácil adaptación a ORM
4. **Validaciones**: Lógica de negocio centralizada
5. **Configuración**: Parámetros configurables

### Pasos de Migración
1. Crear esquema de base de datos real
2. Adaptar interfaces a ORM (Prisma)
3. Migrar lógica del repositorio
4. Actualizar configuraciones
5. Migrar datos de prueba

## 🛠️ Desarrollo

### Agregar Nuevos Datos
1. Crear datos en el archivo correspondiente
2. Actualizar tipos en `types.ts`
3. Agregar al repositorio si es necesario
4. Exportar en `index.ts`

### Validación
```typescript
import { validarEstructuraCompleta } from '@/data/mock';

const esValida = await validarEstructuraCompleta();
if (!esValida) {
  console.error('Estructura de datos inválida');
}
```

### Estadísticas
```typescript
import { obtenerEstadisticasCompletas } from '@/data/mock';

const stats = await obtenerEstadisticasCompletas();
console.log(`Total startups: ${stats.totalStartups}`);
console.log(`Total postulaciones: ${stats.totalPostulaciones}`);
```

## 📝 Notas Importantes

- **Consistencia**: Todos los datos siguen la misma estructura
- **Tipado**: TypeScript completo para seguridad de tipos
- **Escalabilidad**: Fácil agregar nuevas entidades
- **Mantenibilidad**: Código organizado y documentado
- **Testing**: Datos consistentes para pruebas

## 🚀 Próximos Pasos

1. **Validación**: Implementar validaciones más robustas
2. **Caching**: Agregar sistema de caché para mejor rendimiento
3. **Backup**: Sistema de backup/restore de datos mock
4. **API**: Endpoints para acceso a datos mock
5. **UI**: Interfaz para gestión de datos mock 