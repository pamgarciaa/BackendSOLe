# BackendSOLe
BackendSOLe es el trabajo final de un proyecto de e-commerce. Se trata de un potente backend construido con Node.js y TypeScript, utilizando Express para el enrutamiento y MongoDB (a través de Mongoose) para la persistencia de datos.

## 🚀 Características Principales

Este backend implementa todas las funcionalidades esenciales para una plataforma de comercio electrónico y un sistema de gestión de contenido (CMS):

### **Autenticación y Usuarios**
* Registro de usuarios con cifrado de contraseñas utilizando `bcrypt`.
* Login y Logout con gestión de sesión a través de JWT almacenado en cookies HTTP-only.
* Funcionalidades de "Olvidé mi Contraseña" y "Restablecer Contraseña" mediante un PIN temporal de 6 dígitos enviado por correo electrónico.
* Actualización de perfil y cambio de contraseña para usuarios autenticados.

### **Roles y Autorización (ACL)**
* Manejo de tres roles: `user`, `moderator`, y `admin`.
* Middleware de protección de rutas por rol (`checkRole`) para restringir el acceso a funcionalidades sensibles como el CRUD de productos y blogs.

### **Gestión de Productos y Blog (CMS)**
* API RESTful completa (CRUD) para Productos y Artículos de Blog, con rutas protegidas por rol.
* Funcionalidad para obtener "Kits" (productos con `category: "kit"`) ordenados por nivel (`level`).
* Manejo de carga de archivos (imágenes de productos, blog, perfil) con Multer y almacenamiento en la carpeta `/uploads`.

### **Flujo de Compra (E-commerce)**
* **Carrito de Compras:** Funcionalidades para añadir, obtener, y eliminar ítems del carrito.
* **Checkout:** Proceso de finalización de compra que genera una `Order` con estado `pending` y vacía el carrito.
* **Órdenes:** Rutas para obtener las órdenes del usuario logueado y listar todas las órdenes (solo para `admin`).

## 🗺️ Rutas de API (Endpoints)

El servidor base se ejecuta en el puerto especificado (por defecto `3000`) y todas las rutas principales tienen el prefijo `/api`.

| Categoría | Ruta Base | Métodos Clave | Requisitos de Rol |
| :--- | :--- | :--- | :--- |
| **Autenticación** | `/api/users` | `POST /register`, `POST /login`, `POST /logout` | Público |
| **Usuarios (Admin)** | `/api/users` | `GET /all`, `DELETE /:id` | Admin |
| **Productos** | `/api/products` | `GET /` | Público |
| **Productos (CRUD)** | `/api/products` | `POST /`, `PATCH /:id`, `DELETE /:id` | Admin, Moderator |
| **Kits** | `/api/kits` | `GET /` | Público |
| **Blog (CRUD)** | `/api/blogs` | `POST /`, `PATCH /:id`, `DELETE /:id` | Admin, Moderator |
| **Carrito** | `/api/cart` | `POST /add`, `GET /`, `DELETE /:productId` | Autenticado (`protect`) |
| **Checkout** | `/api/cart/checkout` | `POST /` | Autenticado (`protect`) |
| **Órdenes** | `/api/orders` | `GET /myorders` | Autenticado (`protect`) |
| **Órdenes (Admin)** | `/api/orders` | `GET /all` | Admin |

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología | Versión Clave |
|---|---|---|
| **Lenguaje** | TypeScript | 5.9.3 |
| **Runtime** | Node.js | >= 18.0.0 (Recomendado) |
| **Framework** | Express.js | 5.2.1 |
| **Base de Datos** | MongoDB (Mongoose) | 9.0.1 |
| **Testing** | Jest, Supertest | 30.2.0, 7.1.4 |
| **Transpilación/Ejecución** | tsx, ts-node, tsc-alias | 4.21.0, 10.9.2, 1.8.16 |

### **Dependencias Clave**
`bcrypt`, `compression`, `cookie-parser`, `cors`, `dotenv`, `express`, `fs-extra`, `jsonwebtoken`, `mongoose`, `multer`, `nodemailer`.

## 📁 Estructura de Carpetas

El código principal se encuentra en la carpeta `src` y sigue una arquitectura Model-Service-Controller (MSC), facilitando la navegación y el mantenimiento:

| Carpeta | Propósito |
| :--- | :--- |
| `src/models` | Contiene los esquemas de Mongoose para la base de datos (Usuario, Producto, Orden, Carrito).|
| `src/services` | Contiene la lógica de negocio pura, interactuando con la base de datos y aislando la complejidad.|
| `src/controllers` | Funciones que reciben la solicitud (Request) y envían la respuesta (Response), actuando como intermediarios entre las rutas y los servicios.|
| `src/routes` | Define los endpoints de la API (`/api/users`, `/api/products`, etc.) y dirige el tráfico a los controladores.|
| `src/middlewares` | Lógica de autenticación (`protect`), autorización (`checkRole`) y manejo de archivos (`multer`).|
| `src/utils` | Funciones de ayuda reutilizables (Manejo de errores `AppError`, JWT, Envío de correos).|
| `src/__tests__` | Contiene los tests unitarios y de integración del proyecto. |

## ⚙️ Configuración y Ejecución
Requisitos
* Node.js (versión 18.x o superior).
* Una instancia de MongoDB.

### **1. Instalación**
Clona el repositorio e instala las dependencias:

```bash
# 1. Clona el repositorio (si aún no lo has hecho)
# git clone <URL_DEL_REPOSITORIO>
# cd BackendSOLe 

# 2. Instala todas las dependencias del proyecto
npm install

