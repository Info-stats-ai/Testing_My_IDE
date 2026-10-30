from fastapi.testclient import TestClient

from agent.api import app
from agent.support_graph import answer
from ml.intent_model import classify


def test_classifier_learns_intents():
    assert classify("I was charged twice for one order") == "billing"
    assert classify("please reset my password") == "account"
    assert classify("the app crashes on upload") == "technical"


def test_graph_routes_by_intent():
    result = answer("refund the extra charge on my card")
    assert result["intent"] == "billing"
    assert "billing ticket" in result["reply"]


def test_api_answers():
    response = TestClient(app).post("/answer", json={"message": "can't log in"})
    assert response.status_code == 200
    assert response.json()["intent"] == "account"
