"""Intent classifier for support messages: TF-IDF features + logistic regression."""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

TRAINING_DATA = [
    ("my card was charged twice", "billing"),
    ("refund my last payment", "billing"),
    ("why is my invoice higher this month", "billing"),
    ("i can't log in to my account", "account"),
    ("reset my password please", "account"),
    ("change the email on my profile", "account"),
    ("the app crashes when i upload a file", "technical"),
    ("the page shows a 500 error", "technical"),
    ("sync is stuck at 90 percent", "technical"),
]


def train() -> Pipeline:
    texts, labels = zip(*TRAINING_DATA)
    model = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2))),
        ("classifier", LogisticRegression(max_iter=1000)),
    ])
    model.fit(texts, labels)
    return model


_model = None


def classify(text: str) -> str:
    global _model
    if _model is None:
        _model = train()
    return _model.predict([text])[0]
