BackendSOLe
BackendSOLe es el trabajo final de un proyecto de e-commerce. Se trata de un potente backend construido con Node.js y TypeScript, utilizando Express para el enrutamiento y MongoDB (a través de Mongoose) para la persistencia de datos.

🚀 Características Principales
Este backend implementa todas las funcionalidades esenciales para una plataforma de comercio electrónico y un sistema de gestión de contenido (CMS):

Autenticación Completa

Registro de usuarios con cifrado de contraseñas (bcrypt).

Login y Logout con gestión de sesión a través de JWT almacenado en cookies.

Funcionalidades de "Olvidé mi Contraseña" y "Restablecer Contraseña" mediante PIN temporal enviado por correo electrónico.

Actualización de perfil y cambio de contraseña para usuarios autenticados.

Roles y Autorización (ACL)

Manejo de tres roles: user, moderator, y admin.

Middleware de protección de rutas por rol (checkRole).

Gestión de Productos y Blog (CMS)

API RESTful completa (CRUD) para Productos y Artículos de Blog.

Funcionalidad para obtener "Kits" (productos con category: "kit") ordenados por nivel.

Funcionalidad de Compra

Carrito de Compras: Añadir, obtener, y eliminar ítems.

Checkout: Proceso de finalización de compra que genera una Orden.

Órdenes: Obtención de órdenes por usuario y listado de todas las órdenes (solo para admin).

Utilidades:

Manejo de carga de archivos (imágenes de productos, blog, perfil) con Multer y fs-extra.

Manejo centralizado de errores con AppError y middleware de errores.

🛠️ Tecnologías Utilizadas
Lenguaje: TypeScript

Framework: Express.js

Base de Datos: MongoDB (a través de Mongoose)

Compilador/Ejecutor: tsc, ts-node, tsx

Testing: Jest, Supertest

Dependencias Adicionales: bcrypt, jsonwebtoken, multer, cookie-parser, cors, dotenv, nodemailer

⚙️ Configuración y Ejecución
Requisitos
Node.js (ver engines en package-lock.json, preferentemente ^18.14.0 o superior).

Una instancia de MongoDB.
