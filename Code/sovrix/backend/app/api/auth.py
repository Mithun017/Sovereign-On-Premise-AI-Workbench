from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import User
from app.schemas.schemas import UserLogin, UserCreate, UserOut, Token
from app.core.security import verify_password, get_password_hash, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_data.username).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials for sovereign workbench"
        )
    
    token = create_access_token(user.username)
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(user)
    )

@router.get("/me", response_model=UserOut)
def get_current_user_info(db: Session = Depends(get_db)):
    # Default engineer profile for air-gapped terminal
    user = db.query(User).first()
    if not user:
        user = User(
            username="sovrix_admin",
            email="admin@refinery.internal",
            hashed_password=get_password_hash("sovrix2026"),
            full_name="Senior Chief Reliability Engineer",
            role="Admin",
            department="Asset Integrity & Reliability"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return UserOut.model_validate(user)
