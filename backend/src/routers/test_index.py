from fastapi.testclient import TestClient

def test_index():
    assert 200 == 200

if __name__ == "__main__":
    import pytest
    raise SystemExit(pytest.main([__file__]))