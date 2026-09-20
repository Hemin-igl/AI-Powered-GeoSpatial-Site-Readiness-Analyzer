import sys
import os

# Ensure backend root is in python path
sys.path.insert(0, os.path.dirname(__file__))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"

    resp2 = client.get("/api/v1/health")
    assert resp2.status_code == 200
    assert resp2.json()["status"] == "ok"
    print("[PASS] Health endpoints verified")

def test_layers():
    resp = client.get("/api/v1/layers")
    assert resp.status_code == 200
    data = resp.json()
    assert "layers" in data
    assert len(data["layers"]) >= 5
    print(f"[PASS] Layers endpoint verified ({len(data['layers'])} layers)")

def test_site_analyze():
    payload = {
        "latitude": 21.1702,
        "longitude": 72.8311,
        "business_type": "retail",
        "radius_km": 5.0,
        "weights": {
            "population": 0.30,
            "accessibility": 0.25,
            "competition": 0.15,
            "land_use": 0.15,
            "risk": 0.15
        }
    }
    resp = client.post("/api/v1/sites/analyze", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "score" in data
    assert "factors" in data
    assert "contributions" in data
    assert "metrics" in data
    assert "site_id" in data
    assert 0.0 <= data["score"] <= 100.0
    print(f"[PASS] Site analysis endpoint verified (Score: {data['score']})")

def test_opportunity_search():
    payload = {
        "business_type": "retail",
        "minimum_score": 70,
        "filters": {
            "population": "high",
            "competition": "low",
            "accessibility": "high",
            "risk": "low"
        }
    }
    resp = client.post("/api/v1/opportunities/search", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "zones" in data
    assert len(data["zones"]) > 0
    print(f"[PASS] Opportunity search verified ({len(data['zones'])} zones found)")

def test_accessibility_isochrone():
    payload = {
        "latitude": 21.1702,
        "longitude": 72.8311,
        "mode": "drive",
        "minutes": [10, 20, 30]
    }
    resp = client.post("/api/v1/accessibility/isochrone", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["mode"] == "drive"
    assert len(data["bands"]) == 3
    print(f"[PASS] Isochrone endpoint verified (3 bands generated)")

def test_competition_analyze():
    payload = {
        "latitude": 21.1702,
        "longitude": 72.8311,
        "radius_km": 5.0,
        "decay": {
            "type": "exponential",
            "k": 0.5
        }
    }
    resp = client.post("/api/v1/competition/analyze", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "competitors" in data
    assert "total_pressure" in data
    assert "normalized_score" in data
    print(f"[PASS] Competition analyze verified ({data['competitor_count']} competitors, pressure: {data['total_pressure']})")

def test_hotspots():
    for algo in ["h3", "dbscan", "gi_star"]:
        resp = client.get(f"/api/v1/hotspots?algorithm={algo}&layer=readiness")
        assert resp.status_code == 200
        data = resp.json()
        assert data["type"] == "FeatureCollection"
        assert len(data["features"]) > 0
        print(f"[PASS] Hotspot algorithm '{algo}' verified ({len(data['features'])} features)")

def test_ai_explain():
    payload = {
        "analysis": {
            "score": 84.5,
            "factors": {
                "population": 91.0,
                "accessibility": 87.0,
                "competition": 63.0,
                "land_use": 95.0,
                "risk": 78.0
            },
            "contributions": {
                "population": 27.3,
                "accessibility": 21.75,
                "competition": 9.45,
                "land_use": 14.25,
                "risk": 11.7
            },
            "metrics": {
                "population_10min": 18400,
                "population_30min": 142700,
                "competitors_1km": 2,
                "competitors_5km": 11
            }
        },
        "question": "Why does this site have this score?"
    }
    resp = client.post("/api/v1/ai/explain", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "explanation" in data
    assert len(data["explanation"]) > 50
    print("[PASS] AI explain endpoint verified")

def test_reports():
    payload = {
        "site_analysis": {
            "score": 84.5,
            "factors": {"population": 91.0, "accessibility": 87.0, "competition": 63.0, "land_use": 95.0, "risk": 78.0},
            "metrics": {"population_10min": 18400, "population_30min": 142700, "competitors_1km": 2, "competitors_3km": 5, "competitors_5km": 11}
        },
        "site_name": "Test Arterial Site",
        "business_type": "retail"
    }
    resp = client.post("/api/v1/reports/generate", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "summary_markdown" in data
    assert "report_id" in data
    print("[PASS] Reports generate endpoint verified")

def test_auth():
    # Test Login with pre-configured analyst account
    login_resp = client.post("/api/v1/auth/login", json={"email": "analyst@geoready.ai", "password": "password123"})
    assert login_resp.status_code == 200
    token_data = login_resp.json()
    assert "access_token" in token_data
    token = token_data["access_token"]
    assert token_data["user"]["email"] == "analyst@geoready.ai"

    # Test /me with token
    me_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "analyst@geoready.ai"

    # Test Register
    reg_resp = client.post("/api/v1/auth/register", json={
        "email": "newuser@enterprise.com",
        "password": "securepassword99",
        "full_name": "Dr. Sarah Jenkins",
        "organization": "OmniSpatial Corp",
        "role": "Chief Geospatial Officer"
    })
    assert reg_resp.status_code == 200
    reg_data = reg_resp.json()
    assert reg_data["user"]["email"] == "newuser@enterprise.com"

    print("[PASS] Authentication (Login, /me, Register, Token) verified")

if __name__ == "__main__":
    test_health()
    test_auth()
    test_layers()
    test_site_analyze()
    test_opportunity_search()
    test_accessibility_isochrone()
    test_competition_analyze()
    test_hotspots()
    test_ai_explain()
    test_reports()
    print("\n==========================================")
    print("ALL BACKEND API & AUTH TESTS PASSED!")
    print("==========================================")
