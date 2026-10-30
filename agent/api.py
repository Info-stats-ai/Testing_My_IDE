"""HTTP front for the agent, called by the Express server."""
from fastapi import FastAPI
from pydantic import BaseModel

from agent.support_graph import answer

app = FastAPI()


class Question(BaseModel):
    message: str


@app.post("/answer")
def post_answer(question: Question):
    result = answer(question.message)
    return {"intent": result["intent"], "reply": result["reply"]}
