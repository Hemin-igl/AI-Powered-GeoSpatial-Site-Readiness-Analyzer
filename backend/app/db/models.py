import datetime
from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from .session import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="analyst")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    sites = relationship("CandidateSiteModel", back_populates="creator")
    analyses = relationship("AnalysisRunModel", back_populates="user")


class CandidateSiteModel(Base):
    __tablename__ = "candidate_sites"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    city = Column(String, index=True, nullable=False)
    area = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    business_type = Column(String, index=True, nullable=False)
    readiness_score = Column(Integer, default=0)
    status = Column(String, default="Needs Review")
    factors = Column(JSON, default=dict)
    metrics = Column(JSON, default=dict)
    summary = Column(Text, nullable=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    creator = relationship("UserModel", back_populates="sites")


class AnalysisRunModel(Base):
    __tablename__ = "analysis_runs"

    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("candidate_sites.id"), nullable=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    business_type = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    weights = Column(JSON, nullable=False)
    score = Column(Integer, nullable=False)
    factors = Column(JSON, nullable=False)
    contributions = Column(JSON, nullable=False)
    metrics = Column(JSON, nullable=False)
    algorithm_version = Column(String, default="score-v1.0")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("UserModel", back_populates="analyses")
