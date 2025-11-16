from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

def verify_google_token(id_token_str):
    """Valida el token de Google y devuelve los datos del usuario"""
    try:
        info = id_token.verify_oauth2_token(
            id_token_str,
            requests.Request(),
            settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
        )
        return info  # contiene email, name, picture, sub, etc.
    except Exception:
        return None


def google_authenticate(id_token_str):
    info = verify_google_token(id_token_str)
    if not info or not info.get("email"):
        return None, None

    email = info["email"]
    first_name = info.get("given_name", "")
    last_name = info.get("family_name", "")

    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "first_name": first_name,
            "last_name": last_name,
            "username": f"{first_name} {last_name}".strip(),
            "role": "user",  # Nuevo rol por defecto
            "is_active": True,
        },
    )

    refresh = RefreshToken.for_user(user)
    tokens = {"refresh": str(refresh), "access": str(refresh.access_token)}

    return user, tokens
