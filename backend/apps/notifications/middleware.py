from urllib.parse import parse_qs
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

User = get_user_model()


class JWTAuthMiddleware:
    """
    ASGI middleware que extrae ?token=... de la querystring y coloca user en scope.
    Uso: wrap your URLRouter with JWTAuthMiddleware.
    """
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return JWTAuthMiddlewareInstance(scope, self.inner)


class JWTAuthMiddlewareInstance:
    def __init__(self, scope, inner):
        self.scope = dict(scope)
        self.inner = inner

    async def __call__(self, receive, send):
        query_string = self.scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        token_list = params.get("token") or params.get("access_token") or []
        user = AnonymousUser()

        if token_list:
            token = token_list[0]
            try:
                access = AccessToken(token)
                user_id = access.get("user_id") or access.get("user_id")
                if user_id:
                    user = await database_sync_to_async(User.objects.get)(pk=user_id)
            except Exception:
                user = AnonymousUser()

        self.scope["user"] = user
        inner = self.inner(self.scope)
        return await inner(receive, send)


def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
