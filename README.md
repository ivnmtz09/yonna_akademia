# 🎓 Yonna Akademia

## 📖 Descripción General
Yonna Akademia es una plataforma educativa gamificada para el aprendizaje del idioma Wayuunaiki desde el español. Inspirada en Duolingo, combina lecciones interactivas, retos y progresión por niveles para hacer el aprendizaje accesible y atractivo.

## 🧰 Tecnologías
- Backend: Django + Django REST Framework  
- Frontend: React + Vite + TailwindCSS  
- Base de datos: PostgreSQL

---

## 🏗️ Arquitectura del Backend

Estructura de aplicaciones Django:

```
backend/
├── apps/
│   ├── users/         # Gestión de usuarios, perfiles y autenticación
│   │   - Registro y login
│   │   - Perfiles de estudiante
│   │   - Autenticación JWT y OAuth (Google)
│   │   - Roles y permisos
│   ├── courses/       # Cursos, lecciones y contenido
│   │   - Estructura de cursos y niveles
│   │   - Lecciones (vocabulario y gramática)
│   │   - Contenido multimedia
│   ├── quizzes/       # Sistema de evaluaciones
│   │   - Quizzes por lección
│   │   - Preguntas de opción múltiple
│   │   - Ejercicios de emparejamiento y pronunciación
│   ├── progress/      # Seguimiento de progreso
│   │   - Sistema de XP, niveles y logros
│   │   - Streaks y estadísticas
│   ├── notifications/ # Notificaciones (push y in-app)
│   ├── stats/         # Analytics y métricas
│   ├── media_content/ # Gestión de multimedia (imágenes, audio, video)
│   └── core/          # Configuración base y utilidades
```

---

## ✨ Características Principales
- Aprendizaje gamificado: niveles, XP, logros, streaks, leaderboards.  
- Contenido estructurado: cursos por dificultad, lecciones progresivas, enfoque práctico y contenido cultural Wayuu.  
- Evaluaciones interactivas: quizzes adaptativos, ejercicios de listening/speaking, retroalimentación inmediata, repetición espaciada.

---

## 🛠️ Requisitos del Sistema

Backend
- Python 3.11+
- PostgreSQL 13+
- Django 4.2+
- Django REST Framework

Frontend
- Node.js 18+
- React 18+
- Vite
- TailwindCSS

---

## 🚀 Configuración Inicial

### Backend
Clonar y configurar el entorno:
```bash
git clone https://github.com/ivnmtz09/yonna_akademia.git
cd yonna_akademia/backend
```

Crear y activar entorno virtual:
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate
```

Instalar dependencias:
```bash
pip install -r requirements.txt
```

Configurar variables de entorno (.env):
```
# Django
DEBUG=true
SECRET_KEY=tu-clave-secreta-aqui

# Database
DB_NAME=yonna_akademia
DB_USER=postgres
DB_PASSWORD=tu-password
DB_HOST=localhost
DB_PORT=5432

# Google OAuth
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-client-secret
```

Migraciones y superusuario:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

Ejecutar servidor:
```bash
python manage.py runserver
```
Backend disponible en: http://localhost:8000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend disponible en: http://localhost:5173

---

## 📡 API — Endpoints Principales
- GET /api/courses/ — Lista de cursos  
- GET /api/courses/{id}/lessons/ — Lecciones por curso  
- POST /api/quizzes/{id}/submit/ — Envío de respuestas  
- GET /api/progress/stats/ — Estadísticas de progreso  
- GET /api/users/profile/ — Perfil de usuario

(La documentación Swagger está disponible en /api/docs/)

---

## 🤝 Desarrollo y Contribución
Ramas:
- main — versión estable  
- develop — desarrollo activo  
- feature/nombre-feature — nuevas características  
- hotfix/nombre-fix — correcciones críticas

Flujo de contribución:
```bash
# Fork -> crear rama -> commit -> push -> pull request
git checkout -b feature/nueva-caracteristica
git commit -m "feat: añadir nueva característica"
git push origin feature/nueva-caracteristica
```

---

## 📄 Documentación Adicional
- API Docs: /api/docs/ (Swagger)  
- Diagrama ER: /docs/database/  
- Autenticación: JWT + OAuth2 (Google)

---

Desarrollado por: Iván Martínez  
Universidad de La Guajira — Ingeniería de Sistemas

Yonna Akademia — Aprendiendo Wayuunaiki, preservando cultura
