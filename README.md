# Yonna Akademia

## Descripción General

Yonna Akademia es una plataforma educativa gamificada para el aprendizaje del idioma Wayuunaiki desde el español. Inspirada en el modelo de Duolingo, combina lecciones, retos y progresión por niveles. 

La plataforma está construida con:
- **Backend**: Django + Django REST Framework
- **Frontend**: React + Vite + TailwindCSS

---

## Estructura del Proyecto

```
yonna_akademia/
├── backend/
│   ├── apps/
│   │   ├── users/              # Usuarios, perfiles y autenticación
│   │   ├── courses/            # Cursos y niveles
│   │   ├── quizzes/           # Juicios interactivos (Quizzes)
│   │   ├── progress/          # Progreso, XP, niveles y logros
│   │   ├── notifications/     # Sistema de notificaciones
│   │   ├── stats/             # Estadísticas y métricas
│   │   ├── reports/           # Reportes y análisis
│   │   ├── media_content/     # Archivos multimedia
│   │   └── core/             # Configuraciones base y endpoints generales
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── asgi.py / wsgi.py
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── context/         # Contextos de React (Auth, etc.)
│   │   ├── api/            # Configuración y servicios de API
│   │   └── assets/         # Recursos estáticos
│   ├── package.json
│   └── vite.config.js
```

---

## Requisitos del Sistema

### Backend
* Python 3.11+
* PostgreSQL 13+
* pip / virtualenv

### Frontend
* Node.js 18+
* npm o yarn

---

## Configuración Inicial

1. Clona el repositorio:
```bash
git clone https://github.com/ivnmtz09/yonna_akademia.git
cd yonna_akademia
```

### Configuración Backend

1. Crea y activa el entorno virtual:
```bash
cd backend
python -m venv venv

# En Windows:
venv\Scripts\activate

# En Linux/Mac:
source venv/bin/activate
```

2. Instala las dependencias:
```bash
pip install -r requirements.txt
```

3. Crea un archivo `.env` en la raíz del proyecto (`yonna_akademia/.env`) con las siguientes variables:

```properties
# Django
DEBUG=                    # true/false
SECRET_KEY=              # Clave secreta de Django

# Base de datos
DB_NAME=                 # Nombre de la base de datos
DB_USER=                 # Usuario de PostgreSQL
DB_PASSWORD=             # Contraseña de PostgreSQL
DB_HOST=                 # Host de la base de datos
DB_PORT=                 # Puerto de PostgreSQL (default: 5432)

# OAuth Google
GOOGLE_CLIENT_ID=        # ID de cliente de Google OAuth
GOOGLE_CLIENT_SECRET=    # Secreto de cliente de Google OAuth
```

4. Crea la base de datos en PostgreSQL:
```sql
CREATE DATABASE nombre_db;
```

5. Ejecuta las migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Crea un superusuario:
```bash
python manage.py createsuperuser
```

### Configuración Frontend

1. Instala las dependencias:
```bash
cd frontend
npm install
```

## Iniciar los Servidores

### Backend
```bash
cd backend
python manage.py runserver
```
El servidor estará disponible en http://localhost:8000

### Frontend
```bash
cd frontend
npm run dev
```
La aplicación estará disponible en http://localhost:5173

---

## Documentación Adicional

- La documentación de la API está disponible en `/api/docs/` una vez que el servidor backend esté corriendo
- Los endpoints protegidos requieren autenticación JWT
- La autenticación con Google requiere configurar las credenciales en la consola de Google Cloud Platform

---

## Contribuir

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**Autor:** Ivan Martinez  
**Universidad de La Guajira - Ingeniería de Sistemas**

Proyecto bajo desarrollo educativo Yonna Akademia.
