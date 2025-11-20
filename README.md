# 🎓 Yonna Akademia

<div align="center">

![Yonna Akademia Banner](https://via.placeholder.com/800x200/1e3a8a/ffffff?text=Yonna+Akademia+-+Aprendiendo+Wayuunaiki)

**Plataforma educativa gamificada para el aprendizaje del idioma Wayuunaiki**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Django](https://img.shields.io/badge/Django-5.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.0-02569B.svg)](https://flutter.dev/)

[Demo](#-demo) • [Características](#-características-principales) • [Instalación](#-instalación) • [Documentación](#-documentación-de-la-api) • [Contribuir](#-contribución)

</div>

---

## 📖 Descripción General

**Yonna Akademia** es una plataforma educativa moderna y gamificada diseñada para facilitar el aprendizaje del idioma **Wayuunaiki** desde el español. Inspirada en aplicaciones como Duolingo, combina:

- 🎮 **Gamificación**: Sistema de XP, niveles, logros, rachas y leaderboards
- 📚 **Contenido estructurado**: Cursos progresivos con lecciones interactivas
- 🎯 **Evaluaciones inteligentes**: Quizzes adaptativos con retroalimentación inmediata
- 🌍 **Preservación cultural**: Contenido multimedia sobre la cultura Wayuu

**Objetivo**: Hacer el aprendizaje del Wayuunaiki accesible, atractivo y efectivo para hispanohablantes, contribuyendo a la preservación de esta lengua indígena colombiana.

---

## 🧰 Stack Tecnológico

### **Backend**
- **Framework**: Django 5.2 + Django REST Framework
- **Base de datos**: PostgreSQL 13+
- **Autenticación**: JWT (SimpleJWT) + OAuth 2.0 (Google)
- **WebSockets**: Django Channels (notificaciones en tiempo real)
- **Almacenamiento**: Archivos locales / AWS S3 (multimedia)

### **Frontend Web**
- **Framework**: React 18 + Vite
- **Estilos**: TailwindCSS 3
- **Estado**: React Query + Context API
- **Routing**: React Router v6

### **App Móvil**
- **Framework**: Flutter 3.0+
- **Estado**: Provider / Riverpod
- **Almacenamiento local**: Hive / SQLite
- **HTTP**: Dio

### **Infraestructura**
- **Servidor**: Gunicorn + Nginx
- **Despliegue**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

---

## 🏗️ Arquitectura del Backend
```
backend/
├── apps/
│   ├── users/              # 👤 Gestión de usuarios y autenticación
│   │   ├── models.py       # User, Profile
│   │   ├── serializers.py  # UserSerializer, RegisterSerializer
│   │   ├── views.py        # RegisterView, LoginView, ProfileView
│   │   └── permissions.py  # IsAdmin, IsModerator, IsAdminOrModerator
│   │
│   ├── courses/            # 📚 Cursos y lecciones
│   │   ├── models.py       # Course, Enrollment
│   │   ├── serializers.py  # CourseSerializer, EnrollmentSerializer
│   │   └── views.py        # AvailableCoursesView, EnrollCourseView
│   │
│   ├── quizzes/            # 📝 Sistema de evaluaciones
│   │   ├── models.py       # Quiz, Question, QuizAttempt
│   │   ├── serializers.py  # QuizSerializer, SubmitQuizSerializer
│   │   └── views.py        # QuizDetailView, SubmitQuizView
│   │
│   ├── progress/           # 📈 Seguimiento de progreso
│   │   ├── models.py       # Progress, GlobalProgress
│   │   └── views.py        # UserProgressView, LeaderboardView
│   │
│   ├── notifications/      # 🔔 Notificaciones
│   │   ├── models.py       # Notification
│   │   ├── consumers.py    # NotificationConsumer (WebSocket)
│   │   └── signals.py      # Notificaciones automáticas
│   │
│   ├── stats/              # 📊 Analytics y métricas
│   │   ├── models.py       # XpHistory, UserStatistic, PlatformStatistic
│   │   └── views.py        # StatsOverviewView, AdminStatisticsView
│   │
│   ├── media_content/      # 🎬 Contenido multimedia (Web)
│   │   └── models.py       # Video, Article, Gallery
│   │
│   └── core/               # ⚙️ Configuración base
│       ├── middleware.py   # JSONExceptionMiddleware
│       └── exceptions.py   # custom_exception_handler
│
├── backend/
│   ├── settings.py         # Configuración de Django
│   ├── urls.py             # Rutas principales
│   ├── asgi.py             # Configuración ASGI (WebSockets)
│   └── wsgi.py             # Configuración WSGI
│
├── media/                  # Archivos subidos (avatares, thumbnails, etc.)
├── staticfiles/            # Archivos estáticos compilados
├── logs/                   # Logs del sistema
├── requirements.txt        # Dependencias Python
├── manage.py               # CLI de Django
└── .env.example            # Plantilla de variables de entorno
```

---

## ✨ Características Principales

### 🎮 **Sistema de Gamificación**
- **XP y Niveles**: Gana experiencia completando quizzes y desbloquea cursos avanzados
- **Rachas (Streaks)**: Mantén días consecutivos de estudio y obtén bonificaciones
- **Logros**: Desbloquea insignias por hitos alcanzados
- **Leaderboard**: Compite con otros estudiantes en rankings globales

### 📚 **Contenido Educativo**
- **Cursos estructurados**: Organizados por nivel de dificultad (Principiante, Intermedio, Avanzado)
- **Lecciones progresivas**: Vocabulario, gramática y cultura Wayuu
- **Multimedia integrada**: Audio para pronunciación, imágenes y videos culturales
- **Desbloqueables por nivel**: Cursos avanzados requieren completar niveles previos

### 📝 **Evaluaciones Inteligentes**
- **Tipos de preguntas**: Selección múltiple, verdadero/falso, respuesta corta
- **Retroalimentación inmediata**: Explicaciones detalladas de cada respuesta
- **Sistema de intentos**: Máximo 3 intentos por quiz con mejora progresiva
- **Calificación automática**: Evaluación instantánea con asignación de XP

### 🔔 **Notificaciones en Tiempo Real**
- **WebSocket**: Notificaciones push instantáneas
- **Eventos automáticos**: Nuevos cursos, quizzes, logros y recordatorios
- **Notificaciones personalizadas**: Por rol (usuario, moderador, admin)

### 📊 **Analytics y Estadísticas**
- **Dashboard personal**: Progreso por curso, XP ganado, rachas
- **Métricas de aprendizaje**: Tasa de aprobación, tiempo de estudio, cursos completados
- **Estadísticas de admin**: Usuarios activos, cursos populares, métricas de plataforma

### 🔐 **Seguridad y Autenticación**
- **JWT Tokens**: Autenticación stateless con refresh tokens
- **OAuth Google**: Login con cuenta de Google
- **Roles y permisos**: Admin, Moderador, Usuario
- **Blacklist de tokens**: Invalidación de sesiones al logout

---

## 🚀 Instalación

### **Prerequisitos**

Asegúrate de tener instalado:

- **Python 3.11+** ([Descargar](https://www.python.org/downloads/))
- **PostgreSQL 13+** ([Descargar](https://www.postgresql.org/download/))
- **Node.js 18+** ([Descargar](https://nodejs.org/))
- **Git** ([Descargar](https://git-scm.com/downloads))
- **Flutter 3.0+** (opcional, para app móvil) ([Descargar](https://flutter.dev/docs/get-started/install))

---

### **1️⃣ Clonar el Repositorio**
```bash
git clone https://github.com/ivnmtz09/yonna_akademia.git
cd yonna_akademia
```

---

### **2️⃣ Configuración del Backend**

#### **2.1 Crear entorno virtual**
```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

#### **2.2 Instalar dependencias**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### **2.3 Configurar variables de entorno**

Crea un archivo `.env` en la carpeta `backend/`:
```bash
cp .env.example .env
```

Edita el archivo `.env`:
```env
# Django
DEBUG=True
SECRET_KEY=tu-clave-secreta-super-segura-aqui-cambiame
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=yonna_db
DB_USER=postgres
DB_PASSWORD=tu_password_postgres
DB_HOST=localhost
DB_PORT=5432

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Media y Static
MEDIA_URL=/media/
STATIC_URL=/static/
```

#### **2.4 Crear base de datos PostgreSQL**
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE yonna_db;

# Salir
\q
```

#### **2.5 Aplicar migraciones**
```bash
python manage.py makemigrations
python manage.py migrate
```

#### **2.6 Crear superusuario**
```bash
python manage.py createsuperuser
```

Ingresa:
- Email: `admin@yonna.com`
- Nombre: `Admin`
- Apellido: `Yonna`
- Contraseña: `admin123` (o la que prefieras)

#### **2.7 Cargar datos de prueba (opcional)**
```bash
python manage.py loaddata fixtures/initial_data.json
```

#### **2.8 Ejecutar servidor de desarrollo**
```bash
python manage.py runserver
```

✅ **Backend disponible en**: http://localhost:8000  
✅ **Admin panel**: http://localhost:8000/admin

---

### **3️⃣ Configuración del Frontend (React)**

#### **3.1 Instalar dependencias**
```bash
cd ../frontend
npm install
```

#### **3.2 Configurar variables de entorno**

Crea un archivo `.env` en la carpeta `frontend/`:
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
```

#### **3.3 Ejecutar servidor de desarrollo**
```bash
npm run dev
```

✅ **Frontend disponible en**: http://localhost:5173

---

### **4️⃣ Configuración de la App Móvil (Flutter)**

#### **4.1 Instalar dependencias**
```bash
cd ../yonna_app
flutter pub get
```

#### **4.2 Configurar variables de entorno**

Edita `lib/config/constants.dart`:
```dart
class AppConstants {
  static const String apiUrl = 'http://10.0.2.2:8000'; // Android Emulator
  // static const String apiUrl = 'http://localhost:8000'; // iOS Simulator
  // static const String apiUrl = 'http://192.168.1.X:8000'; // Dispositivo físico
}
```

#### **4.3 Ejecutar app**
```bash
# Android
flutter run

# iOS (solo en macOS)
flutter run -d ios
```

✅ **App móvil ejecutándose** en emulador/dispositivo

---

## 📡 Documentación de la API

### **Autenticación**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register/` | Registro de nuevo usuario | Público |
| `POST` | `/api/auth/login/` | Login con email/contraseña | Público |
| `POST` | `/api/auth/google/` | Login con Google OAuth | Público |
| `POST` | `/api/auth/logout/` | Cerrar sesión (invalidar token) | JWT |
| `GET` | `/api/auth/me/` | Datos del usuario autenticado | JWT |
| `GET/PUT` | `/api/auth/profile/` | Ver/editar perfil | JWT |

### **Cursos**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/courses/available/` | Cursos disponibles según nivel | JWT |
| `GET` | `/api/courses/{id}/` | Detalle de un curso | JWT |
| `POST` | `/api/courses/enroll/` | Inscribirse en un curso | JWT |
| `GET` | `/api/courses/my-enrollments/` | Mis cursos inscritos | JWT |
| `POST` | `/api/courses/create/` | Crear curso (admin/moderador) | JWT + Permisos |

### **Quizzes**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/quizzes/available/` | Quizzes disponibles | JWT |
| `GET` | `/api/quizzes/{id}/` | Detalle del quiz (sin respuestas) | JWT |
| `GET` | `/api/quizzes/course/{id}/` | Quizzes de un curso | JWT |
| `POST` | `/api/quizzes/submit/` | Enviar respuestas del quiz | JWT |
| `GET` | `/api/quizzes/my-attempts/` | Mis intentos de quizzes | JWT |
| `POST` | `/api/quizzes/create/` | Crear quiz (admin/moderador) | JWT + Permisos |

### **Progreso**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/progress/` | Progreso en todos los cursos | JWT |
| `GET` | `/api/progress/global/` | Progreso global del usuario | JWT |
| `GET` | `/api/progress/course/{id}/` | Progreso en un curso específico | JWT |
| `GET` | `/api/progress/leaderboard/` | Tabla de clasificación | JWT |

### **Estadísticas**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/stats/overview/` | Resumen de estadísticas | JWT |
| `GET` | `/api/stats/xp-history/` | Historial de XP ganado | JWT |
| `GET` | `/api/stats/user-statistics/` | Estadísticas detalladas | JWT |
| `GET` | `/api/stats/admin/` | Estadísticas de plataforma | JWT + Admin |

### **Notificaciones**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/notifications/` | Listar notificaciones | JWT |
| `GET` | `/api/notifications/unread-count/` | Contador de no leídas | JWT |
| `POST` | `/api/notifications/mark-read/` | Marcar como leídas | JWT |
| `WS` | `/ws/notifications/?token={jwt}` | WebSocket de notificaciones | JWT |

---

### **Ejemplos de uso**

#### **Registro de usuario**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "estudiante@example.com",
    "first_name": "Juan",
    "last_name": "Pérez",
    "password1": "Password123!",
    "password2": "Password123!"
  }'
```

**Response:**
```json
{
  "id": 5,
  "email": "estudiante@example.com",
  "first_name": "Juan",
  "last_name": "Pérez",
  "role": "user",
  "level": 1,
  "xp": 0
}
```

---

#### **Login**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "estudiante@example.com",
    "password": "Password123!"
  }'
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "id": 5,
  "email": "estudiante@example.com",
  "role": "user",
  "level": 1,
  "xp": 0
}
```

---

#### **Inscribirse en un curso**
```bash
curl -X POST http://localhost:8000/api/courses/enroll/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": 1
  }'
```

**Response:**
```json
{
  "message": "Inscripción exitosa",
  "enrollment": {
    "id": 12,
    "course": 1,
    "course_title": "Curso Nivel 1 - Introducción",
    "progress": 0.0,
    "enrolled_at": "2025-01-16T15:30:00Z"
  }
}
```

---

#### **Enviar respuestas de quiz**
```bash
curl -X POST http://localhost:8000/api/quizzes/submit/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "quiz_id": 15,
    "answers": {
      "45": "Jamaya",
      "46": "Verdadero",
      "47": "wüin"
    },
    "time_taken": 245
  }'
```

**Response:**
```json
{
  "message": "Quiz completado correctamente",
  "attempt": {
    "id": 123,
    "score": 100.0,
    "passed": true,
    "xp_gained": 50,
    "answers": {
      "45": {
        "user_answer": "Jamaya",
        "correct_answer": "Jamaya",
        "is_correct": true,
        "explanation": "Jamaya es el saludo más común..."
      }
    }
  },
  "xp_gained": 50,
  "current_level": 2,
  "total_xp": 550
}
```

---

## 🧪 Testing

### **Backend (Django)**
```bash
# Ejecutar todos los tests
python manage.py test

# Tests de una app específica
python manage.py test apps.users

# Tests con coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### **Frontend (React)**
```bash
# Ejecutar tests
npm run test

# Tests con coverage
npm run test:coverage
```

### **App Móvil (Flutter)**
```bash
# Ejecutar tests
flutter test

# Tests con coverage
flutter test --coverage
```

---

## 📦 Deployment

### **Backend (Django + Gunicorn + Nginx)**

#### **1. Configurar producción**

Edita `backend/backend/settings.py`:
```python
DEBUG = False
ALLOWED_HOSTS = ['tu-dominio.com', 'www.tu-dominio.com']

# Configurar HTTPS
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

#### **2. Recolectar archivos estáticos**
```bash
python manage.py collectstatic --noinput
```

#### **3. Ejecutar con Gunicorn**
```bash
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

#### **4. Configurar Nginx**
```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /ruta/a/yonna_akademia/backend/staticfiles/;
    }

    location /media/ {
        alias /ruta/a/yonna_akademia/backend/media/;
    }
}
```

---

### **Docker Compose**
```bash
# Construir y ejecutar contenedores
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener contenedores
docker-compose down
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Sigue estos pasos:

### **1. Fork del repositorio**

Haz clic en el botón "Fork" en la esquina superior derecha.

### **2. Clonar tu fork**
```bash
git clone https://github.com/TU-USUARIO/yonna_akademia.git
cd yonna_akademia
```

### **3. Crear una rama**
```bash
git checkout -b feature/nueva-caracteristica
```

### **4. Hacer cambios y commit**
```bash
git add .
git commit -m "feat: añadir nueva característica increíble"
```

**Convención de commits:**
- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Formato de código
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Tareas de mantenimiento

### **5. Push y Pull Request**
```bash
git push origin feature/nueva-caracteristica
```

Luego crea un **Pull Request** desde GitHub.

---

### **Estructura de ramas**

- `main` → Versión estable en producción
- `develop` → Desarrollo activo
- `feature/*` → Nuevas características
- `hotfix/*` → Correcciones críticas
- `release/*` → Preparación de releases

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.
```
MIT License

Copyright (c) 2025 Iván Martínez - Universidad de La Guajira

Se concede permiso, libre de cargos, a cualquier persona que obtenga una copia
de este software y de los archivos de documentación asociados (el "Software"),
para utilizar el Software sin restricción...
```

---

## 👨‍💻 Autor

**Iván Martínez**  
Estudiante de Ingeniería de Sistemas  
Universidad de La Guajira

- GitHub: [@ivnmtz09](https://github.com/ivnmtz09)
- Email: ivanjmm09@gmail.com
- Email: ijesusmartinez@uniguajira.edu.co

---

## 🙏 Agradecimientos

- **Comunidad Wayuu**: Por preservar su lengua y cultura
- **Universidad de La Guajira**: Por el apoyo en el desarrollo del proyecto
- **Duolingo**: Por la inspiración en gamificación educativa
- **Contribuidores**: Gracias a todos los que han aportado al proyecto

---

## 📚 Recursos Adicionales

- [Documentación de Django](https://docs.djangoproject.com/)
- [Documentación de DRF](https://www.django-rest-framework.org/)
- [Documentación de React](https://react.dev/)
- [Documentación de Flutter](https://docs.flutter.dev/)
- [Wayuunaiki - Etnias de Colombia](https://www.mincultura.gov.co/)

---

## 🗺️ Roadmap

### **v1.0 (MVP) - Q1 Nov. 2025** ✅
- [x] Sistema de autenticación
- [x] CRUD de cursos y quizzes
- [x] Sistema de XP y niveles
- [x] Notificaciones básicas
- [x] Dashboard de usuario

### **v1.1 - Q2 Feb. 2026** 🚧
- [ ] App móvil Flutter funcional
- [ ] Sistema de streaks completo
- [ ] Leaderboard global
- [ ] Notificaciones push

### **v1.2 - Q3 Jun. 2026** 📋
- [ ] Ejercicios de pronunciación
- [ ] Sistema de amigos
- [ ] Chat entre estudiantes
- [ ] Modo offline

### **v2.0 - Q4 Nov. 2026** 🔮
- [ ] IA para retroalimentación
- [ ] Reconocimiento de voz
- [ ] Curso avanzado completo
- [ ] Certificados digitales

---

<div align="center">

**Yonna Akademia** — *Aprendiendo Wayuunaiki, preservando cultura* 🌍

[⬆ Volver arriba](#-yonna-akademia)

</div>
