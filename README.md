# Gestion de Contactos

Aplicacion web para gestionar contactos con Node.js, Express, MongoDB Atlas y una interfaz web para agregar, buscar, actualizar y eliminar registros.

## Requisitos

- Node.js 20 o superior
- npm
- Docker Desktop, opcional para ejecutar en contenedor
- Cuenta o cluster activo en MongoDB Atlas

## Estructura

```text
gestion-contactos/
├── app.js
├── models/
│   └── Contact.js
├── routes/
│   └── contactRoutes.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── Dockerfile
├── .dockerignore
├── .gitignore
├── package.json
└── README.md
```

## Instalacion

```bash
npm install
```

## Ejecucion local

```bash
npm start
```

Despues abre en el navegador:

```text
http://localhost:3000
```

## Docker

Construir la imagen:

```bash
docker build -t gestion-contactos-api .
```

Ejecutar el contenedor:

```bash
docker run -p 3000:3000 gestion-contactos-api
```

Luego abre:

```text
http://localhost:3000
```

## API

Ruta base:

```text
/api/contacts
```

### Listar contactos

```http
GET /api/contacts
```

### Buscar contactos

```http
GET /api/contacts?search=texto
```

Busca por nombre, correo, telefono, empresa o notas.

### Obtener un contacto por ID

```http
GET /api/contacts/:id
```

### Crear contacto

```http
POST /api/contacts
```

Ejemplo de cuerpo JSON:

```json
{
  "name": "Maria Lopez",
  "email": "maria@correo.com",
  "phone": "999888777",
  "company": "Senati",
  "notes": "Contacto principal"
}
```

### Actualizar contacto

```http
PUT /api/contacts/:id
```

### Eliminar contacto

```http
DELETE /api/contacts/:id
```

## Modelo de contacto

Campos principales:

- `name`: nombre del contacto, obligatorio
- `email`: correo del contacto, obligatorio
- `phone`: telefono del contacto, obligatorio
- `company`: empresa o institucion
- `notes`: notas adicionales

## Variables de entorno

La aplicacion puede usar la variable `MONGODB_URI` para configurar la conexion a MongoDB:

```bash
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/gestion-contactos
```

Si no se define, `app.js` usa la cadena configurada directamente en el archivo.
