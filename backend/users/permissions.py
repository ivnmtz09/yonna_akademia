from rest_framework.permissions import BasePermission, SAFE_METHODS

# --- ADMINISTRADOR ---
class IsAdmin(BasePermission):
    """
    Permite acceso completo a los usuarios con rol admin.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "admin"


# --- TEACHER ---
class IsTeacher(BasePermission):
    """
    Permite acceso a usuarios con rol teacher.
    - Pueden crear/editar cursos y contenidos.
    - Pueden leer sus propios contenidos y estadísticas de estudiantes.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "teacher"


# --- STUDENT ---
class IsStudent(BasePermission):
    """
    Permite acceso a usuarios con rol student.
    - Solo lectura de contenidos (GET, HEAD, OPTIONS).
    - No pueden crear/editar ni eliminar recursos.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "student"


# --- MIXTOS ---
class IsAdminOrReadOnly(BasePermission):
    """
    Admin tiene permisos completos, los demás solo lectura.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:  # GET, HEAD, OPTIONS
            return True
        return request.user.is_authenticated and request.user.role == "admin"


class IsTeacherOrReadOnly(BasePermission):
    """
    Teachers pueden crear/editar contenido, los demás solo lectura.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ["teacher", "admin"]
