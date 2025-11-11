# 🚗 API de Subastas de Vehículos

Una API REST completa para gestionar un sistema de subastas y venta directa de vehículos, con autenticación segura, roles y permisos, y sistema de apuestas en tiempo real.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Arquitectura](#-arquitectura)
- [Autenticación](#-autenticación)
- [Guía de Uso](#-guía-de-uso)
  - [1. Sistema de Roles y Permisos](#1-sistema-de-roles-y-permisos)
  - [2. Gestión de Usuarios](#2-gestión-de-usuarios)
  - [3. Registro de Vehículos](#3-registro-de-vehículos)
  - [4. Sistema de Tiempos](#4-sistema-de-tiempos)
  - [5. Subastas y Apuestas](#5-subastas-y-apuestas)
  - [6. Compras Directas](#6-compras-directas)
- [Documentación de la API](#-documentación-de-la-api)
- [Tecnologías](#-tecnologías)
- [Contribución](#-contribución)

## 🌟 Características

- **Autenticación segura** con Argon2 y tokens únicos de 6 dígitos
- **Sistema de roles y permisos** granular
- **Subastas en tiempo real** con validación de disponibilidad
- **Venta directa** de vehículos
- **Gestión completa de vehículos** con imágenes
- **Sistema de tiempo configurable** para subastas
- **Validación de datos** con express-validator
- **Documentación automática** con Swagger
- **Base de datos relacional** con Sequelize ORM

## 🛠 Instalación

### Prerrequisitos

- Node.js 16+ 
- MySQL 8.0+
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/subastas.git
cd subastas
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar base de datos:**
- Crear base de datos MySQL llamada `proyecto_subastas`
- Configurar credenciales en archivo `.env`

4. **Configurar variables de entorno:**
```bash
# Crear archivo .env en la raíz del proyecto
cp .env.example .env
```

## ⚙️ Configuración

### Archivo `.env`

```env
# Configuración de base de datos
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_NAME=proyecto_subastas
DB_PORT=3306

# Puerto del servidor
PORT=3000
```

### Iniciar el servidor

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en:
- **API:** http://localhost:3000/api
- **Documentación:** http://localhost:3000/api-docs

## 🏗 Arquitectura

```
src/
├── app.js                    # Servidor principal
├── configuraciones/          # Configuraciones
│   ├── db.js                # Conexión a base de datos
│   ├── multer.js            # Configuración de archivos
│   └── swagger.js           # Documentación API
├── controladores/           # Lógica de negocio
├── modelos/                # Modelos de base de datos
├── rutas/                  # Definición de rutas
└── scripts/                # Scripts utilitarios
```

## 🔐 Autenticación

El sistema utiliza autenticación basada en tokens de 6 dígitos únicos:

1. **Registro/Login:** Genera token único
2. **Hashing:** Contraseñas hasheadas con Argon2
3. **Autorización:** Sistema de roles y permisos granular

## 📖 Guía de Uso

### 1. Sistema de Roles y Permisos

#### 🔰 Crear Permisos

**Endpoint:** `POST /api/permisos/guardar`

```json
{
    "nombre": "gestionar_vehiculos",
    "descripcion": "Permite crear, editar y eliminar vehículos"
}
```

**Permisos sugeridos:**
```json
// Permiso para administradores
{
    "nombre": "admin_total",
    "descripcion": "Acceso total al sistema"
}

// Permiso para empleados
{
    "nombre": "gestionar_subastas",
    "descripcion": "Gestionar subastas y apuestas"
}

// Permiso para vendedores
{
    "nombre": "vender_vehiculos",
    "descripcion": "Registrar y vender vehículos"
}
```

#### 👥 Crear Roles

**Endpoint:** `POST /api/roles/guardar`

```json
{
    "nombre": "Administrador",
    "descripcion": "Rol con acceso completo"
}
```

**Roles sugeridos:**
```json
// Rol Administrador (ID: 1)
{
    "nombre": "Administrador",
    "descripcion": "Acceso total al sistema"
}

// Rol Empleado (ID: 2)
{
    "nombre": "Empleado",
    "descripcion": "Gestión de subastas y operaciones"
}

// Rol Vendedor (ID: 3)
{
    "nombre": "Vendedor",
    "descripcion": "Registro y venta de vehículos"
}

// Rol Comprador (ID: 4)
{
    "nombre": "Comprador",
    "descripcion": "Participación en subastas y compras"
}
```

#### 🔗 Asignar Permisos a Roles

> **⚠️ Nota:** La asignación de permisos a roles actualmente se maneja a través de la tabla junction `rol_permiso` directamente en la base de datos. Se puede implementar un endpoint personalizado si se requiere gestión via API.

**Estructura de tabla junction:**
```sql
INSERT INTO rol_permiso (rolId, permisoId) VALUES (1, 1);
INSERT INTO rol_permiso (rolId, permisoId) VALUES (1, 2);
```

### 2. Gestión de Usuarios

#### � Flujo de Registro Completo

El sistema requiere crear primero los datos personales (empleado o comprador/vendedor) y después asociarlos a un usuario.

#### 👔 Paso 1: Registrar Empleado

**Endpoint:** `POST /api/empleados/guardar`

```json
{
    "nombre": "Juan Pérez",
    "direccion": "Calle Principal #123, Ciudad México",
    "telefono": "5551234567"
}
```

#### 👤 Paso 2: Crear Usuario y Asociar al Empleado

**Endpoint:** `POST /api/usuarios/guardar`

```json
{
    "nombre": "Juan",
    "apellido": "Pérez", 
    "email": "juan@ejemplo.com",
    "telefono": "1234567890",
    "contrasena": "contraseña123",
    "rolId": 2,
    "empleadoId": 1
}
```

#### 🏪 Paso 1: Registrar Comprador/Vendedor

**Endpoint:** `POST /api/compradoresvendedores/guardar`

```json
{
    "identidad": "0801199012345",
    "primernombre": "María",
    "segundonombre": "José",
    "primerapellido": "González",
    "segundoapellido": "López",
    "telefono": "5551234567",
    "direccion": "Calle Principal #123, Colonia Centro",
    "correo": "maria.gonzalez@email.com",
    "fechaNacimiento": "1990-05-15"
}
```

#### Paso 2: Crear Usuario para Comprador/Vendedor

**Endpoint:** `POST /api/usuarios/guardar`

```json
{
    "nombre": "Maria",
    "apellido": "González",
    "email": "maria.gonzalez@subastas.com", 
    "telefono": "5551234567",
    "contrasena": "maria123",
    "rolId": 4,
    "compradorVendedorId": 1
}
```

#### � Listar Empleados

**Endpoint:** `GET /api/empleados/listar`

#### 🔍 Buscar Empleado

**Endpoint:** `GET /api/empleados/buscar?id=1`

#### 📋 Listar Compradores/Vendedores

**Endpoint:** `GET /api/compradoresvendedores/listar`

#### 🔍 Buscar Comprador/Vendedor

**Endpoint:** `GET /api/compradoresvendedores/buscar?id=1`

#### �🔑 Login

**Endpoint:** `POST /api/auth/login`

```json
{
    "email": "juan@ejemplo.com",
    "contrasena": "contraseña123"
}
```

**Respuesta exitosa:**
```json
{
    "token": "123456",
    "usuario": {
        "id": 1,
        "nombre": "Juan",
        "email": "juan@ejemplo.com",
        "rol": "Empleado"
    }
}
```

#### 📋 Registro Alternativo

**Endpoint:** `POST /api/auth/registrar`

```json
{
    "nombre": "Usuario Nuevo",
    "email": "nuevo@ejemplo.com",
    "contrasena": "password123",
    "tipoUsuario": "cliente"
}
```

#### 👤 Ver Perfil (Protegido)

**Endpoint:** `GET /api/auth/perfil`

**Headers:**
```
Authorization: Bearer {token}
```

### 3. Registro de Vehículos

#### 🚗 Registrar Vehículo para Venta Directa

**Endpoint:** `POST /api/vehiculos/guardar`

```json
{
    "marca": "Toyota",
    "modelo": "Camry",
    "anio": 2020,
    "vin": "1HGBH41JXMN109186",
    "motor": "2.5L 4-Cylinder",
    "transmision": "Automática",
    "traccion": "Delantera",
    "combustible": "Gasolina",
    "llaves": "2 llaves completas",
    "kilometraje": 45000,
    "usuarioId": 2,
    "precioCompraDirecta": 350000.00,
    "disponibleCompraDirecta": true
}
```

#### 🏁 Registrar Vehículo Solo para Subasta

```json
{
    "marca": "BMW",
    "modelo": "X5",
    "anio": 2019,
    "vin": "5UXKR0C58K0V12345",
    "motor": "3.0L Twin Turbo",
    "transmision": "Automática 8 velocidades",
    "traccion": "Integral xDrive",
    "combustible": "Gasolina",
    "llaves": "2 llaves inteligentes",
    "kilometraje": 65000,
    "usuarioId": 2,
    "precioCompraDirecta": null,
    "disponibleCompraDirecta": false
}
```

#### 🔄 Actualizar Vehículo

**Endpoint:** `PUT /api/vehiculos/actualizar`

```json
{
    "id": 1,
    "marca": "Toyota",
    "modelo": "Corolla",
    "anio": 2021,
    "precioCompraDirecta": 380000.00
}
```

#### 🗑️ Eliminar Vehículo

**Endpoint:** `DELETE /api/vehiculos/eliminar?id=1`

#### 🔍 Buscar Vehículo por ID

**Endpoint:** `GET /api/vehiculos/buscar?id=1`

#### 📋 Listar Todos los Vehículos

**Endpoint:** `GET /api/vehiculos/listar`

### 4. Sistema de Tiempos

#### ⏰ Crear Tiempos para Subastas

**Endpoint:** `POST /api/tiempos/guardar`

```json
{
    "duracion": 300,
    "descripcion": "5 horas"
}
```

**Tiempos sugeridos:**
```json
// Subasta Express
{
    "duracion": 30,
    "descripcion": "30 minutos - Express"
}

// Subasta Corta
{
    "duracion": 120,
    "descripcion": "2 horas"
}

// Subasta Estándar
{
    "duracion": 300,
    "descripcion": "5 horas"
}

// Subasta Extendida
{
    "duracion": 1440,
    "descripcion": "24 horas"
}
```

#### 📋 Listar Tiempos Disponibles

**Endpoint:** `GET /api/tiempos/listar`

### 5. Subastas y Apuestas

#### 🎯 Crear Apuesta

**Endpoint:** `POST /api/apuestas/guardar`

```json
{
    "monto": 475000,
    "usuarioId": 1,
    "vehiculoId": 2,
    "tiempoId": 2
}
```

#### 📊 Ver Estadísticas de Subasta

**Endpoint:** `GET /api/apuestas/estadisticas/{vehiculoId}`

**Ejemplo:** `GET /api/apuestas/estadisticas/2`

#### 🏆 Finalizar Subasta

**Endpoint:** `POST /api/apuestas/finalizar`

```json
{
    "vehiculoId": 2
}
```

#### 📋 Listar Apuestas por Vehículo

**Endpoint:** `GET /api/apuestas/listarvehiculo?vehiculoId=2`

#### 📋 Listar Apuestas por Usuario

**Endpoint:** `GET /api/apuestas/listarusuario?usuarioId=1`

#### ⏰ Ver Tiempos Disponibles

**Endpoint:** `GET /api/apuestas/tiempos`

#### 🔄 Actualizar Apuesta

**Endpoint:** `PUT /api/apuestas/actualizar`

```json
{
    "id": 1,
    "estado": "finalizada",
    "ganador": true
}
```

#### ⚡ Verificar Subastas Vencidas

**Endpoint:** `POST /api/apuestas/verificar-vencidas`

### 6. Compras Directas

#### 💰 Realizar Compra Directa

**Endpoint:** `POST /api/comprasdirectas/guardar`

```json
{
    "usuarioId": 3,
    "vehiculoId": 1,
    "comprobantePago": "PAGO123456"
}
```

#### 📋 Listar Vehículos Disponibles para Compra Directa

**Endpoint:** `GET /api/vehiculos/compra-directa-disponible`

#### 📋 Listar Todas las Compras Directas

**Endpoint:** `GET /api/comprasdirectas/listar`

#### 📋 Listar Compras de un Usuario

**Endpoint:** `GET /api/comprasdirectas/listarusuario?usuarioId=3`

#### 🔄 Actualizar Estado de Compra

**Endpoint:** `PUT /api/comprasdirectas/actualizarestado`

```json
{
    "id": 1,
    "estado": "completada"
}
```

#### ❌ Cancelar Compra Directa

**Endpoint:** `DELETE /api/comprasdirectas/cancelar?id=1`

## 📚 Documentación de la API

### Swagger UI

La documentación completa de la API está disponible en:
**http://localhost:3000/api-docs**

### Rutas Principales

| Módulo | Base URL | Descripción |
|--------|----------|-------------|
| **Autenticación** | `/api/auth` | Login, registro y gestión de tokens |
| **Roles** | `/api/roles` | Gestión de roles del sistema |
| **Permisos** | `/api/permisos` | Gestión de permisos granulares |
| **Usuarios** | `/api/usuarios` | Registro y gestión de usuarios |
| **Empleados** | `/api/empleados` | Gestión de empleados |
| **Compradores/Vendedores** | `/api/compradoresvendedores` | Registro de compradores/vendedores |
| **Vehículos** | `/api/vehiculos` | Gestión completa de vehículos |
| **Tiempos** | `/api/tiempos` | Configuración de tiempos para subastas |
| **Apuestas** | `/api/apuestas` | Sistema completo de subastas |
| **Compras Directas** | `/api/comprasdirectas` | Sistema de ventas directas |
| **Imágenes** | `/api/imagenesvehiculo` | Gestión de imágenes de vehículos |
| **Ventas** | `/api/ventas` | Registro de transacciones |
| **Reportes** | `/api/reportesventa` | Reportes de ventas |
| **Notificaciones** | `/api/notificaciones` | Sistema de notificaciones |

## 🚀 Tecnologías

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para base de datos
- **MySQL** - Base de datos relacional
- **Argon2** - Hashing de contraseñas

### Validación y Documentación
- **express-validator** - Validación de datos
- **Swagger UI** - Documentación automática
- **Morgan** - Logging de requests

### Utilidades
- **Multer** - Manejo de archivos
- **dotenv** - Variables de entorno
- **CORS** - Control de acceso

## 🔄 Flujo de Trabajo Recomendado

### 1. Configuración Inicial
```bash
# 1. Crear permisos básicos
POST /api/permisos/guardar

# 2. Crear roles
POST /api/roles/guardar

# 3. Asignar permisos a roles (vía SQL o implementar endpoint)
# Insertar en tabla junction rol_permiso

# 4. Crear tiempos para subastas
POST /api/tiempos/guardar
```

### 2. Registro de Usuarios
```bash
# 1. Crear datos personales primero
POST /api/empleados/guardar
# o
POST /api/compradoresvendedores/guardar

# 2. Crear usuario y asociarlo
POST /api/usuarios/guardar (con empleadoId o compradorVendedorId)
```

### 3. Gestión de Vehículos
```bash
# 1. Registrar vehículo
POST /api/vehiculos/guardar

# 2. Para venta directa: configurar precio
# 3. Para subasta: dejar precio en null
```

### 4. Operaciones de Venta
```bash
# Venta Directa:
POST /api/comprasdirectas/guardar

# Subasta:
POST /api/apuestas/guardar
POST /api/apuestas/finalizar
```

## 🛡 Seguridad

- **Contraseñas hasheadas** con Argon2
- **Validación de entrada** en todas las rutas
- **Tokens únicos** de 6 dígitos
- **Sistema de roles** granular
- **Validación de permisos** por operación

## 📝 Ejemplos de Prueba

### Colección de Postman Completa

```json
// 1. Crear empleado administrador
POST /api/empleados/guardar
{
    "nombre": "Administrador Sistema",
    "direccion": "Oficina Central, Av. Principal 123",
    "telefono": "5551234567"
}

// 2. Crear usuario administrador y asociar
POST /api/usuarios/guardar
{
    "nombre": "Admin",
    "apellido": "Sistema",
    "email": "admin@subastas.com",
    "telefono": "1234567890",
    "contrasena": "admin123",
    "rolId": 1,
    "empleadoId": 1
}

// 2. Login
POST /api/auth/login
{
    "email": "admin@subastas.com",
    "contrasena": "admin123"
}

// 3. Registrar vehículo para subasta
POST /api/vehiculos/guardar
{
    "marca": "Mercedes-Benz",
    "modelo": "C-Class",
    "anio": 2021,
    "vin": "WDD2050291F123456",
    "motor": "2.0L Turbo",
    "transmision": "Automática",
    "traccion": "Trasera",
    "combustible": "Gasolina",
    "llaves": "2 llaves inteligentes",
    "kilometraje": 25000,
    "usuarioId": 1
}

// 4. Crear apuesta
POST /api/apuestas/guardar
{
    "monto": 550000,
    "usuarioId": 1,
    "vehiculoId": 1,
    "tiempoId": 2
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- **Email:** soporte@subastas.com
- **Documentación:** http://localhost:3000/api-docs
- **Issues:** [GitHub Issues](https://github.com/tu-usuario/subastas/issues)

---

**Desarrollado con ❤️ para gestionar subastas de vehículos de manera eficiente y segura.**