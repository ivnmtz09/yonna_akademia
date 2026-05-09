# 🎓 Yonna Akademia

<div align="center">

**Plataforma educativa gamificada para el aprendizaje del idioma Wayuunaiki**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Django](https://img.shields.io/badge/Django-5.2-green.svg)](https://www.djangoproject.com/)
[![Angular](https://img.shields.io/badge/Angular-21+-dd0031.svg)](https://angular.dev/)
[![Flutter](https://img.shields.io/badge/Flutter-3.0-02569B.svg)](https://flutter.dev/)

[Demo](#-demo) • [Características](#-características-principales) • [Instalación](#-instalación-local) • [Documentación](#-documentación-de-la-api-swagger) • [Contribuir](#-contribución)

</div>

---

## 📖 Descripción General

**Yonna Akademia** es una plataforma educativa moderna y gamificada diseñada para facilitar el aprendizaje del idioma **Wayuunaiki** desde el español. Inspirada en aplicaciones de aprendizaje de idiomas, combina:

- 🎮 **Gamificación**: Sistema de XP, niveles, logros, rachas (streaks) y leaderboards.
- 📚 **Contenido estructurado**: Cursos progresivos con lecciones interactivas.
- 📖 **Diccionario Interactivo**: Vocabulario con audio y sistema de repaso.
- 🎯 **Evaluaciones inteligentes**: Quizzes adaptativos con retroalimentación inmediata.
- 🌍 **Preservación cultural**: Contenido multimedia sobre la cultura Wayuu.

**Objetivo**: Hacer el aprendizaje del Wayuunaiki accesible, atractivo y efectivo para hispanohablantes, contribuyendo a la preservación de esta lengua indígena colombiana.

---

## 🧰 Stack Tecnológico

### **Backend**
- **Framework**: Django 5.2 + Django REST Framework
- **Base de datos**: PostgreSQL 13+
- **Caché & WebSockets**: Redis
- **Autenticación**: JWT (SimpleJWT) + OAuth 2.0 (Google) + Throttling
- **Almacenamiento**: Archivos locales / AWS S3 (django-storages)
- **Documentación API**: OpenAPI 3.0 (drf-spectacular / Swagger)

### **Frontend Web**
- **Framework**: Angular 21+ (Standalone Components, Signals)
- **Estilos**: TailwindCSS 3 + Lucide Icons
- **Servicios HTTP**: Generados automáticamente vía OpenAPI Generator (typescript-angular)
- **Estado**: Angular Signals con `takeUntilDestroyed` para RxJS
- **Autenticación**: JWT con interceptor HTTP y guards de ruta

### **App Móvil (Futuro)**
- **Framework**: Flutter 3.0+

### **Infraestructura**
- **Servidor**: Gunicorn + Nginx
- **Despliegue**: Docker + Docker Compose

---

## 🏗️ Arquitectura del Backend

```text
backend/
├── apps/
│   ├── users/              # 👤 Gestión de usuarios, autenticación y roles
│   ├── courses/            # 📚 Cursos, lecciones e inscripciones (Optimizado N+1)
│   ├── quizzes/            # 📝 Evaluaciones (Uso de PostgreSQL JSONField)
│   ├── progress/           # 📈 Seguimiento de avance global y por curso
│   ├── gamification/       # 🎮 Sistema de rachas, insignias y leaderboards
│   ├── vocabulary/         # 📖 Diccionario, audios y categorías de palabras
│   ├── notifications/      # 🔔 WebSockets (Redis) y notificaciones push
│   ├── stats/              # 📊 Analytics y métricas del sistema
│   └── media_content/      # 🎬 Contenido multimedia y galerías
│
├── config/                 # ⚙️ Configuración core de Django (settings, urls, asgi, wsgi)
├── media/                  # 📁 Archivos subidos localmente (si USE_S3=False)
├── staticfiles/            # 📁 Archivos estáticos compilados
├── requirements.txt        # 📦 Dependencias Python
└── manage.py               # 🛠️ CLI de Django
```

## 🖥️ Arquitectura del Frontend (Angular 21+)

```text
frontend/
├── src/app/
│   ├── api/                    # 📡 Servicios generados por OpenAPI Generator
│   │   ├── api/                # Servicios TypeScript (VocabularioService, CursosService, etc.)
│   │   ├── model/              # Interfaces de datos (Course, VocabularyEntry, etc.)
│   │   ├── configuration.ts    # Configuración de autenticación JWT
│   │   └── api.base.service.ts # Clase base para todos los servicios
│   │
│   ├── core/                   # 🧠 Lógica compartida
│   │   ├── guards/             # authGuard (protección de rutas)
│   │   ├── interceptors/       # authInterceptor (inyección de token JWT)
│   │   └── services/           # AuthService, TokenService, UiService
│   │
│   ├── features/               # 📄 Componentes de funcionalidad
│   │   ├── home/               # Página de aterrizaje
│   │   ├── dashboard/          # Panel de usuario (XP, nivel, leaderboard)
│   │   ├── courses/            # Cursos disponibles e inscripciones
│   │   ├── dictionary/         # Diccionario Wayuu-Español
│   │   └── auth/               # Modales de login y registro
│   │
│   └── shared/                 # 🔄 Componentes reutilizables
│       └── components/         # StatCardComponent, Navbar, etc.
│
├── tailwind.config.js          # 🎨 Configuración de TailwindCSS
├── angular.json                # ⚙️ Configuración de Angular CLI
└── package.json                # 📦 Dependencias
```

---

## 🚀 Instalación Local

### Prerequisitos
- Python 3.12+
- PostgreSQL 13+ (Docker recomendado)
- Redis (Docker recomendado)
- Node.js 18+ y Angular CLI

### 1. Levantar Servicios Base (Docker)

```bash
# Iniciar PostgreSQL
docker run --name pg-db -e POSTGRES_PASSWORD=tu_password -p 5432:5432 -d postgres

# Iniciar Redis (Requerido para WebSockets y Caché)
docker run --name yonna-redis -p 6379:6379 -d redis:alpine
```

### 2. Configuración del Backend

```bash
cd backend
python -m venv venv

# Activar entorno virtual
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate   # Linux/Mac

pip install --upgrade pip
pip install -r requirements.txt
```

**Variables de Entorno (`backend/.env`)**:

```env
DEBUG=True
SECRET_KEY=tu-clave-secreta
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de Datos
DB_NAME=yonna_db
DB_USER=yonna_user
DB_PASSWORD=Yonna2026*
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://127.0.0.1:6379/1

# AWS S3 (Opcional)
USE_S3=False
```

**Migraciones y Ejecución**:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 3. Configuración del Frontend (Angular 21+)

```bash
cd frontend
npm install
ng serve
```

**Características del Frontend:**
- **Standalone Components**: Sin NgModules, componentes autocontenidos con `@Component({ standalone: true })`.
- **Angular Signals**: Estado reactivo con `signal()`, `computed()` y `toSignal()` desde `@angular/core/rxjs-interop`.
- **Control de flujo integrado**: Uso de `@if`, `@for`, `@switch` en lugar de directivas estructurales.
- **Servicios OpenAPI**: Toda la comunicación con el backend se realiza mediante servicios generados automáticamente desde la especificación OpenAPI.
- **Autenticación JWT**: Interceptor HTTP que inyecta el token Bearer en cada petición, con guards de ruta para proteger rutas privadas.
- **TailwindCSS**: Sistema de diseño utilitario con colores personalizados de marca (brand-green, brand-orange).
- **Iconos Lucide**: Iconos SVG reactivos vía `lucide-angular`.
- **Consumo de datos reales**: Dashboard, cursos y diccionario conectados a la API real del backend.

**Scripts disponibles:**

| Comando | Descripción |
|---|---|
| `ng serve` | Servidor de desarrollo en `http://localhost:4200` |
| `ng build` | Compilación de producción |
| `ng test` | Ejecución de pruebas unitarias |
| `npm run generate-api` | Regenerar servicios desde OpenAPI (requiere backend corriendo) |

---

## 📡 Documentación de la API (Swagger)

El backend expone una interfaz interactiva de Swagger UI generada automáticamente a través de la especificación OpenAPI 3.0.

Una vez que el servidor esté corriendo, visita:  
👉 `http://localhost:8000/api/docs/swagger/`

**Módulos Principales de la API:**
- `/api/auth/`: Registro, login, refresh tokens y perfiles.
- `/api/courses/`: Cursos disponibles, inscripciones y estadísticas.
- `/api/quizzes/`: Evaluaciones, envíos de intentos y resultados.
- `/api/gamification/`: Leaderboard (con caché), insignias y rachas.
- `/api/vocabulary/`: Categorías, palabras, audio de pronunciación y progreso del usuario.
- `/api/progress/`: Resumen de avance del usuario.
- `/api/notifications/`: Notificaciones leídas/no leídas y conexión a WebSockets.

---

## 🗺️ Roadmap

### v1.0 (MVP Backend) - Completado ✅
- [x] Estructura modular Django (`apps/`, `config/`)
- [x] Autenticación JWT y roles
- [x] Optimización ORM y JSONFields
- [x] Módulos de Gamificación y Vocabulario
- [x] Integración Redis (Caché y Channels) y S3
- [x] Swagger / OpenAPI 3.0

### v1.1 (MVP Frontend Angular) - Completado ✅
- [x] Migración de React a Angular 21+ con Standalone Components
- [x] Generación de servicios con OpenAPI Generator (typescript-angular)
- [x] Integración TailwindCSS + Lucide Icons
- [x] Sistema de autenticación JWT (login, registro, guards, interceptor)
- [x] Dashboard con datos reales (XP, nivel, leaderboard)
- [x] Catálogo de cursos con inscripción y progreso
- [x] Diccionario interactivo conectado a la API
- [x] Manejo de estado con Angular Signals y DestroyRef
- [x] Protección de rutas con authGuard

### v2.0 (App Móvil & IA) - Futuro 🔮
- [ ] App móvil Flutter
- [ ] Reconocimiento de voz para pronunciación
- [ ] Modo offline

---

## 📝 Licencia

MIT License. Copyright (c) 2026 Iván Martínez - Universidad de La Guajira.

## 👨‍💻 Autor

**Iván Martínez** | Estudiante de Ingeniería de Sistemas | Universidad de La Guajira

GitHub: [@ivnmtz09](https://github.com/ivnmtz09)
