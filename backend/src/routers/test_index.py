from fastapi.testclient import TestClient

from backend.src.main import app

client = TestClient(app)

def test_index():
    response = client.get("/")
    print(response.json())
    assert response.status_code == 200
    assert response.json() == {
        "ok": True,
        "message": "Hello world",
        "error": None,
    }

if __name__ == "__main__":
    import pytest
    raise SystemExit(pytest.main([__file__]))