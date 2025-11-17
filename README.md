🎓 Yonna Akademia

📖 Descripción General

Yonna Akademia es una plataforma educativa gamificada para el aprendizaje del idioma Wayuunaiki desde el español. Inspirada en el modelo de Duolingo, combina lecciones interactivas, retos y progresión por niveles para hacer el aprendizaje del wayuunaiki accesible y engaging.

La plataforma está construida con:

Backend: Django + Django REST Framework

Frontend: React + Vite + TailwindCSS

Base de datos: PostgreSQL

🏗️ Arquitectura del Backend

Estructura de Aplicaciones Django

El backend está organizado en aplicaciones modulares con responsabilidades específicas:

backend/
├── apps/
│ ├── users/         # Gestión de usuarios, perfiles y autenticación
│ │   - Registro y login de usuarios
│ │   - Perfiles de estudiante
│ │   - Autenticación JWT y OAuth con Google
│ │   - Gestión de roles y permisos
│ │
│ ├── courses/       # Cursos, lecciones y contenido educativo
│ │   - Estructura de cursos y niveles
│ │   - Lecciones de vocabulario y gramática
│ │   - Contenido multimedia asociado
│ │   - Secuenciación de aprendizaje
│ │
│ ├── quizzes/       # Sistema de evaluaciones interactivas
│ │   - Juicios (quizzes) por lección
│ │   - Preguntas múltiple opción
│ │   - Ejercicios de emparejamiento
│ │   - Evaluaciones de pronunciación
│ │
│ ├── progress/      # Seguimiento del progreso del usuario
│ │   - Sistema de XP (puntos de experiencia)
│ │   - Niveles y logros desbloqueables
│ │   - Streaks y estadísticas de consistencia
│ │   - Mecánicas de gamificación
│ │
│ ├── notifications/ # Sistema de notificaciones
│ │   - Recordatorios de práctica
│ │   - Logros desbloqueados
│ │   - Notificaciones push y en-app
│ │
│ ├── stats/         # Analytics y métricas
│ │   - Estadísticas de aprendizaje
│ │   - Progreso general y por habilidad
│ │   - Métricas de engagement
│ │
│ ├── media_content/ # Gestión de archivos multimedia
│ │   - Imágenes para lecciones
│ │   - Archivos de audio para pronunciación
│ │   - Videos educativos
│ │   - Optimización y almacenamiento
│ │
│ └── core/          # Configuración base y utilities
│     - Settings compartidos
│     - Middlewares personalizados
│     - Utilities comunes
│     - Endpoints generales


✨ Características Principales

🎯 Aprendizaje Gamificado

Sistema de niveles y XP

Logros y recompensas desbloqueables

Streaks para mantener la consistencia

Leaderboards competitivos

📚 Contenido Estructurado

Cursos organizados por dificultad

Lecciones progresivas de wayuunaiki

Enfoque en vocabulario práctico y gramática

Contenido cultural wayuu integrado

🎮 Evaluaciones Interactivas

Quizzes adaptativos

Ejercicios de listening y speaking

Retroalimentación inmediata

Mecánicas de repetición espaciada

🛠️ Requisitos del Sistema

Backend

Python 3.11+

PostgreSQL 13+

Django 4.2+

Django REST Framework

Frontend

Node.js 18+

React 18+

Vite

TailwindCSS

🚀 Configuración Inicial

Backend Setup

Clonar y configurar entorno:

git clone [https://github.com/ivnmtz09/yonna_akademia.git](https://github.com/ivnmtz09/yonna_akademia.git)
cd yonna_akademia/backend

# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Activar (Linux/Mac)
source venv/bin/activate


Instalar dependencias:

pip install -r requirements.txt


Configurar variables de entorno (.env):

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


Configurar base de datos y migraciones:

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser


Ejecutar servidor de desarrollo:

python manage.py runserver


Backend disponible en: http://localhost:8000

Frontend Setup

Navegar a la carpeta e instalar:

cd frontend
npm install


Ejecutar servidor de desarrollo:

npm run dev


Frontend disponible en: http://localhost:5173

📡 API Endpoints Principales

GET /api/courses/ - Lista de cursos disponibles

GET /api/courses/{id}/lessons/ - Lecciones por curso

POST /api/quizzes/{id}/submit/ - Envío de respuestas

GET /api/progress/stats/ - Estadísticas de progreso

GET /api/users/profile/ - Perfil de usuario

🤝 Desarrollo y Contribución

Estructura de ramas:

main - Versión estable en producción

develop - Desarrollo activo

feature/nombre-feature - Nuevas características

hotfix/nombre-fix - Correcciones críticas

Proceso de contribución:

Fork del repositorio

Crear rama feature: git checkout -b feature/nueva-caracteristica

Commit changes: git commit -m 'feat: añadir nueva característica'

Push: git push origin feature/nueva-caracteristica

Abrir un Pull Request

📄 Documentación Adicional

API Documentation: Disponible en /api/docs/ (Swagger)

Autenticación: JWT tokens + OAuth2 con Google

Base de datos: Diagrama ER disponible en /docs/database/

Desarrollado por: Ivan Martinez

Universidad de La Guajira - Ingeniería de Sistemas

Proyecto de preservación lingüística y cultural Wayuu

Yonna Akademia - Aprendiendo Wayuunaiki, preservando cultura