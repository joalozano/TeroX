# TeroX

<p align="center">
  <img src="./public/assets/logo.jpg" alt="TeroX Logo" width="200"/>
</p>

## 📌 Descripción general

**TeroX** es un marketplace full-stack que permite a los usuarios **comprar y vender productos** de forma simple.  
Incluye gestión de usuarios, catálogo de productos, compras, simulación de envíos y un sistema de rating.  

Su diseño busca modelar las interacciones esenciales de un marketplace real.

---

## ✨ Funcionalidades principales

### 👤 **Usuarios**
- Registro, login y autenticación con hash seguro.
- Identidad fiscal asociada a cada usuario.
- Baja lógica para cuentas eliminadas.

### 📦 **Productos**
- Crear, editar, eliminar y listar productos.
- Subida y administración de imágenes.
- Búsqueda por nombre y filtros dinámicos.
- Sistema de rating promedio con recálculo automático.

### 🛒 **Compras y órdenes**
- Creación de órdenes con precio y stock congelado.
- Simulación de envíos mediante un **mock del sistema logístico** que avanza estados automáticamente.
- Generación automática de pagos al vendedor cuando el paquete llega al centro de distribución.
- Cancelación automática en casos especiales (baja de usuario o eliminación del producto).

### ⭐ **Ratings**
- Rating asignado por el comprador una vez recibido el producto.
- Recalculo del rating del producto usando el historial completo.

### 🧾 **Facturación**
- Generación de facturas basada en la identidad fiscal del comprador y vendedor.

---

## 📚 Arquitectura y tecnologías

| Módulo | Tecnología |
|-------|------------|
| Backend | Node.js + TypeScript |
| Frontend | HTML, CSS, JS vanilla |
| Base de datos | PostgreSQL |

---
## 🚀 Instrucciones de uso

### Requisitos previos
- Node.js v18+
- TypeScript
- PostgreSQL 18+

### Instalación
#### Clonar el repositorio
```bash
git clone https://github.com/cozin101/TeroX.git;
cd TeroX;
```
#### Instalar dependencias
```bash
npm install;
```
#### Inicializar la base de datos para uso local

Antes de correr este script, se debe de proporcionar un usuario y contraseña de PostgreSQL capaces de crear una nueva base de datos y un usuario nuevo. Para esto, considere modificar el siguiente script antes de correrlo (o establecer las variables de ambiente PGUSER y PGPASSWORD al correrlo).

Windows:
```bash
.\recursos\inicializar-postgreSQL.bat;
```
Linux:
```bash
./recursos/inicializar-postgreSQL.sh;
```
#### Antes de correr la aplicación en modo local


Windows:
```
.\recursos\local.bat;
```
Linux:
```cmd
source recursos/local.env;
```
#### Iniciar la aplicación en modo local
```bash
npm run build;
npm run start;
```

También es posible usar esta aplicación desde su [buscador](https://terox.onrender.com).
