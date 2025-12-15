# BackendSOLe

BackendSOLe es el núcleo backend para una plataforma de e-commerce y gestión de contenido (CMS) enfocada en productos y kits holísticos. Está construido con una arquitectura robusta utilizando **Node.js**, **TypeScript**, **Express** y **MongoDB**.

## 🚀 Características Principales

Este backend implementa funcionalidades avanzadas para comercio electrónico, gestión de usuarios y almacenamiento en la nube:

### **🔐 Autenticación y Seguridad**
* **Registro y Login:** Autenticación segura con hash de contraseñas (`bcrypt`) y gestión de sesiones mediante **JWT (JSON Web Tokens)** almacenados en cookies HTTP-only.
* **Recuperación de Contraseña:** Sistema de "Olvidé mi contraseña" mediante PIN temporal enviado por correo electrónico.
* **Roles (ACL):** Sistema de permisos con tres roles: `user`, `moderator`, y `admin`.

### **☁️ Gestión de Archivos (Cloud Storage)**
* **Firebase Storage:** Integración completa para la subida y gestión de imágenes en la nube.
* **Soporte Multimedia:** Carga de imágenes de perfil, portadas de productos y artículos de blog a través de `Multer` con subida directa a Firebase.

### **🛒 E-commerce y Ventas**
* **Carrito de Compras:** Lógica persistente para añadir items, modificar cantidades y vaciar el carrito.
* **Checkout y Órdenes:** Proceso de compra que genera órdenes, calcula totales y envía un **resumen de compra por email** al usuario.
* **Kits Especiales:** Funcionalidad para solicitar información sobre "Kits" personalizados (Lead Generation).

### **📝 CMS (Gestión de Contenido)**
* **Productos:** CRUD completo con categorización, control de stock y manejo de imágenes.
* **Blog:** Sistema para crear, editar y eliminar artículos para la comunidad.

### **📧 Notificaciones**
* Envío automatizado de correos electrónicos (Nodemailer) para:
    * Recuperación de contraseñas.
    * Confirmación de pedidos.
    * Confirmación de solicitudes de contacto (Kits).
    * Alertas al administrador sobre nuevos leads.

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología |
|---|---|
| **Lenguaje** | TypeScript 5.x |
| **Runtime** | Node.js (Recomendado v18+) |
| **Framework** | Express.js 5.x |
| **Base de Datos** | MongoDB & Mongoose |
| **Almacenamiento** | Firebase Storage (Google Cloud) |
| **Emails** | Nodemailer |
| **Testing** | Jest & Supertest |

## ⚙️ Configuración y Variables de Entorno

Para ejecutar este proyecto, necesitas crear un archivo `.env` en la raíz con las siguientes variables.

```properties
# --- Configuración del Servidor ---
PORT=3000
NODE_ENV=development

# --- Base de Datos ---
MONGO_URI=mongodb://localhost:27017/backendsole_db

# --- Seguridad (JWT) ---
JWT_SECRET=tu_secreto_super_seguro_y_largo

# --- Configuración de Correo (Nodemailer) ---
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# --- Firebase Storage (Descargar JSON de Firebase Console) ---
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@tu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgk...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=tu-project.firebasestorage.app
