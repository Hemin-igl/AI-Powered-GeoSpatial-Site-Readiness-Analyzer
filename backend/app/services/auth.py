import time
import hashlib
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import jwt

from ..schemas.auth import UserRegister, UserResponse

SECRET_KEY = "geospatial-site-readiness-secret-key-2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

def hash_password(password: str) -> str:
    """Hash password using SHA-256 with static salt for clean cross-platform execution."""
    salt = "geo_ready_salt_2026"
    return hashlib.sha256(f"{salt}_{password}".encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

# In-memory user database initialized with pre-configured analyst account
USERS_DB: Dict[str, Dict[str, Any]] = {
    "analyst@geoready.ai": {
        "id": "usr_001",
        "email": "analyst@geoready.ai",
        "hashed_password": hash_password("password123"),
        "full_name": "Rahul Patel",
        "organization": "GeoReady Spatial Intelligence",
        "role": "Senior GIS Analyst",
        "created_at": "2026-09-20 00:00:00 UTC",
    }
}

class AuthService:
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire, "iat": datetime.utcnow()})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    def decode_access_token(token: str) -> Optional[dict]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except Exception:
            return None

    @classmethod
    def register(cls, req: UserRegister) -> UserResponse:
        email = req.email.lower().strip()
        if email in USERS_DB:
            raise ValueError("User with this email already exists")

        user_id = f"usr_{uuid.uuid4().hex[:8]}"
        created_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

        user_record = {
            "id": user_id,
            "email": email,
            "hashed_password": hash_password(req.password),
            "full_name": req.full_name,
            "organization": req.organization or "GeoAnalytics Corp",
            "role": req.role or "GIS Analyst",
            "created_at": created_at,
        }
        USERS_DB[email] = user_record

        return UserResponse(
            id=user_id,
            email=email,
            full_name=req.full_name,
            organization=user_record["organization"],
            role=user_record["role"],
            created_at=created_at,
        )

    @classmethod
    def authenticate(cls, email: str, password: str) -> Optional[UserResponse]:
        email_clean = email.lower().strip()
        user_record = USERS_DB.get(email_clean)
        if not user_record:
            return None
        if not verify_password(password, user_record["hashed_password"]):
            return None

        return UserResponse(
            id=user_record["id"],
            email=user_record["email"],
            full_name=user_record["full_name"],
            organization=user_record["organization"],
            role=user_record["role"],
            created_at=user_record["created_at"],
        )

    @classmethod
    def get_user_by_email(cls, email: str) -> Optional[UserResponse]:
        user_record = USERS_DB.get(email.lower().strip())
        if not user_record:
            return None
        return UserResponse(
            id=user_record["id"],
            email=user_record["email"],
            full_name=user_record["full_name"],
            organization=user_record["organization"],
            role=user_record["role"],
            created_at=user_record["created_at"],
        )
