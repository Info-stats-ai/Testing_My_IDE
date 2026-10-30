"""LangGraph support agent: classify the message, then route it to the
matching handler. Each handler is a node; the classifier decides the edge."""
from typing import TypedDict

from langgraph.graph import END, StateGraph

from ml.intent_model import classify


class SupportState(TypedDict, total=False):
    message: str
    intent: str
    reply: str


def classify_node(state: SupportState) -> SupportState:
    return {"intent": classify(state["message"])}


def billing_node(state: SupportState) -> SupportState:
    return {"reply": "I've opened a billing ticket; refunds post in 3-5 days."}


def account_node(state: SupportState) -> SupportState:
    return {"reply": "I've sent a secure reset link to your account email."}


def technical_node(state: SupportState) -> SupportState:
    return {"reply": "I've logged the error with our engineers and attached your session details."}


def build_graph():
    graph = StateGraph(SupportState)
    graph.add_node("classify", classify_node)
    graph.add_node("billing", billing_node)
    graph.add_node("account", account_node)
    graph.add_node("technical", technical_node)
    graph.set_entry_point("classify")
    graph.add_conditional_edges("classify", lambda state: state["intent"],
                                {"billing": "billing", "account": "account", "technical": "technical"})
    for node in ("billing", "account", "technical"):
        graph.add_edge(node, END)
    return graph.compile()


def answer(message: str) -> SupportState:
    return build_graph().invoke({"message": message})
