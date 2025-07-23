# 🎯 Entorno Ordenado - UPC LevelUp

Este entorno está configurado para una experiencia **ordenada y profesional**, basada en navegación simple y enfocada.

## 📊 Resumen del Entorno Ordenado

### 🎯 **Navegación Simple**
- **Perfil** (datos personales)
- **Startups** (gestión de startups)
- **Convocatorias** (postulaciones)

### 👥 Usuarios Configurados
- **walther.alcocer@cetemin.edu.pe** (usuario regular)
- **m.limaco0191@gmail.com** (usuario regular) 
- **admin@upc.edu.pe** (administrador)

### 🏢 Startups
- **Tech Innovators** (MVP, Tech) - 3 miembros
- **EduLearn** (Idea, EdTech) - 2 miembros

### 📅 Convocatorias
- **Inqubalab** (30/06/2025 - 14/08/2025) - ACTIVA
- **Aceleración** (14/06/2025 - 19/07/2025) - ACTIVA
- **3 convocatorias históricas** para postulaciones

### 📝 Postulaciones
- Tech Innovators → Inqubalab 2024-1 (ACEPTADA)
- Tech Innovators → Aceleración 2024-1 (EN REVISIÓN)
- EduLearn → Inqubalab 2023-2 (RECHAZADA)

## 🚀 Comandos para Configurar

### 1. Crear el entorno ordenado
```bash
node create-complete-environment.js
```

### 2. Verificar que todo esté correcto
```bash
node verify-environment.js
```

### 3. Iniciar el servidor
```bash
npm run dev -- -p 3001
```

## 🎯 Funcionalidades con Navegación Simple

### ✅ **Perfil**
- Formulario de datos personales
- Información de contacto
- Configuración de cuenta

### ✅ **Startups**
- Lista de startups del usuario
- Crear nueva startup
- Gestionar startups existentes

### ✅ **Convocatorias**
- Convocatorias disponibles
- Postulaciones anteriores
- Estados de postulaciones

## 🔧 Scripts Disponibles

### `create-complete-environment.js`
Crea el entorno ordenado y profesional:
- Usuarios con roles correctos
- Startups con datos completos
- Convocatorias activas e históricas
- Miembros de startups
- Postulaciones con estados
- Datos de impacto para formularios

### `verify-environment.js`
Verifica que todo esté configurado correctamente:
- Cuenta usuarios, startups, convocatorias
- Verifica relaciones entre entidades
- Confirma que Walther tenga DNI
- Muestra resumen completo

## 📱 Páginas con Navegación Simple

### 1. Perfil
- **URL**: `/user/profile`
- **Contenido**: Formulario de datos personales
- **Funcionalidad**: Actualizar información personal

### 2. Startups
- **URL**: `/user/startups`
- **Contenido**: Lista de startups + agregar nueva
- **Funcionalidad**: Ver detalles, agregar startup

### 3. Nueva Startup
- **URL**: `/user/startups/nueva`
- **Contenido**: Formulario completo con pestañas
- **Funcionalidad**: Registro de startup completa

### 4. Convocatorias
- **URL**: `/user/convocatorias`
- **Contenido**: Convocatorias activas + postulaciones anteriores
- **Funcionalidad**: Postular a convocatorias, ver feedback

## 🔐 Credenciales de Acceso

### Usuario Regular (Walther)
- **Email**: walther.alcocer@cetemin.edu.pe
- **DNI**: 12345678
- **Rol**: usuario
- **Funcionalidades**: Crear startups, postular a convocatorias

### Usuario Regular (Michael)
- **Email**: m.limaco0191@gmail.com
- **DNI**: 87654321
- **Rol**: usuario
- **Funcionalidades**: Crear startups, postular a convocatorias

### Administrador
- **Email**: admin@upc.edu.pe
- **DNI**: 11111111
- **Rol**: admin
- **Funcionalidades**: Gestión completa del sistema

## 🎨 Experiencia Ordenada

### Navegación Limpia
- **3 elementos principales** en la navegación lateral
- **Enfoque claro** en la tarea actual
- **Jerarquía visual** bien definida
- **Menos distracciones** visuales

### Flujo de Usuario
1. **Login** con Google OAuth
2. **Completar perfil** (si es primera vez)
3. **Navegar** entre Perfil, Startups, Convocatorias
4. **Crear startup** o ver startups existentes
5. **Postular** a convocatorias
6. **Ver feedback** de postulaciones

### Colores y Estados
- **Verde**: Convocatorias activas, postulaciones aceptadas
- **Naranja**: Postulaciones en revisión
- **Rojo**: Postulaciones rechazadas
- **Gris**: Botones y elementos inactivos

## 📋 Checklist de Verificación

- [ ] Usuarios creados con roles correctos
- [ ] Startups con datos completos
- [ ] Convocatorias activas con fechas correctas
- [ ] Convocatorias históricas para postulaciones
- [ ] Miembros asignados a startups
- [ ] Postulaciones con estados correctos
- [ ] Datos de impacto para formularios
- [ ] Walther con DNI configurado
- [ ] Servidor funcionando en puerto 3001
- [ ] Navegación simple y ordenada
- [ ] Todas las páginas accesibles

## 🚨 Solución de Problemas

### Error de conectividad a base de datos
```bash
# Verificar variables de entorno
cat .env

# Regenerar cliente Prisma
npx prisma generate

# Limpiar cache
rm -rf .next
```

### Error de autenticación
```bash
# Verificar configuración de Google OAuth
cat .env.local

# Reiniciar servidor
npm run dev -- -p 3001
```

### Datos no aparecen
```bash
# Ejecutar script de entorno
node create-complete-environment.js

# Verificar datos
node verify-environment.js
```

---

**🎯 El entorno está listo para una experiencia ordenada y profesional** 