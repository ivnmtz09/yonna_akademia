from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """
    Permite acceso únicamente a Administradores o Superusuarios.
    """
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(
            user and user.is_authenticated and (user.is_superuser or getattr(user, "role", None) == "admin")
        )


class IsModerator(BasePermission):
    """
    Permiso jerárquico: permite acceso a Moderadores Y a Administradores/Superusuarios.
    """
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(
            user and user.is_authenticated and (user.is_superuser or getattr(user, "role", None) in ["admin", "moderator"])
        )


class IsUser(BasePermission):
    """
    Verifica que el usuario esté autenticado.
    """
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated)


class IsAdminOrModerator(BasePermission):
    """
    Sinónimo explícito de IsModerator para claridad y compatibilidad hacia atrás.
    """
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(
            user and user.is_authenticated and (user.is_superuser or getattr(user, "role", None) in ["admin", "moderator"])
        )


class IsAdminOrReadOnly(BasePermission):
    """
    Permite lectura segura a cualquier usuario, y escritura solo a Administradores.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = getattr(request, "user", None)
        return bool(
            user and user.is_authenticated and (user.is_superuser or getattr(user, "role", None) == "admin")
        )


class IsModeratorOrAdminOrReadOnly(BasePermission):
    """
    Permite lectura segura a cualquier usuario, y escritura (creación, edición, borrado)
    únicamente a Moderadores y Administradores.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = getattr(request, "user", None)
        return bool(
            user and user.is_authenticated and (user.is_superuser or getattr(user, "role", None) in ["admin", "moderator"])
        )


class IsOwnerOrAdmin(BasePermission):
    """
    Permiso a nivel de vista y de objeto (Object-level permission):
    - Requiere estar autenticado y tener rol 'admin' o 'moderator' para modificar.
    - Administradores pueden modificar cualquier objeto.
    - Moderadores solo pueden modificar o eliminar objetos que ellos mismos crearon.
    """
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not (user and user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        return bool(user.is_superuser or getattr(user, "role", None) in ["admin", "moderator"])

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not (user and user.is_authenticated):
            return False

        # Métodos de lectura segura
        if request.method in SAFE_METHODS:
            return True

        # Administrador o superusuario tiene acceso irrestricto
        if user.is_superuser or getattr(user, "role", None) == "admin":
            return True

        # Determinar el propietario del recurso
        owner = None
        for field in ["created_by", "uploaded_by", "usuario", "user", "author"]:
            if hasattr(obj, field):
                owner = getattr(obj, field)
                break

        if owner is None and isinstance(obj, type(user)):
            owner = obj

        return owner == user


class IsSelfOrAdmin(BasePermission):
    """
    Permiso específico para datos personales (perfil, progreso, intentos):
    - El propio usuario o un administrador tienen acceso.
    """
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not (user and user.is_authenticated):
            return False

        if user.is_superuser or getattr(user, "role", None) in ["admin", "moderator"]:
            return True

        owner = None
        for field in ["usuario", "user"]:
            if hasattr(obj, field):
                owner = getattr(obj, field)
                break

        if owner is None and isinstance(obj, type(user)):
            owner = obj

        return owner == user