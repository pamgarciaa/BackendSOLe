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

## ⚙️ Configuración y Ejecución

### **1. Requisitos**
* Node.js (versión 18.x o superior).
* Una instancia de MongoDB.

### **2. Instalación**
Clona el repositorio e instala las dependencias:

```bash
git clone <repository_url>
cd BackendSOLe
npm install
