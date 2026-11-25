"""Login admin sederhana dengan token bertanda tangan HMAC (tanpa library tambahan).

Format token: base64url("<username>|<kedaluwarsa_unix>").<tanda_tangan_hex>
Cukup untuk proyek kuliah dengan satu akun admin dari .env.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import time

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import settings

_bearer = HTTPBearer(auto_error=False)


def _sign(payload: str) -> str:
    return hmac.new(settings.secret_key.encode(), payload.encode(), hashlib.sha256).hexdigest()


def create_token(username: str) -> str:
    exp = int(time.time() + settings.token_hours * 3600)
    payload = base64.urlsafe_b64encode(f"{username}|{exp}".encode()).decode()
    return f"{payload}.{_sign(payload)}"


def verify_token(token: str) -> str | None:
    try:
        payload, sig = token.rsplit(".", 1)
        if not hmac.compare_digest(sig, _sign(payload)):
            return None
        username, exp = base64.urlsafe_b64decode(payload.encode()).decode().split("|")
        if int(exp) < time.time():
            return None
        return username
    except Exception:
        return None


def check_credentials(username: str, password: str) -> bool:
    ok_user = hmac.compare_digest(username, settings.admin_username)
    ok_pass = hmac.compare_digest(password, settings.admin_password)
    return ok_user and ok_pass


def require_admin(cred: HTTPAuthorizationCredentials | None = Depends(_bearer)) -> str:
    username = verify_token(cred.credentials) if cred else None
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesi admin tidak valid atau sudah habis. Silakan login lagi.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return username
