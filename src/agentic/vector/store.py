from __future__ import annotations

from typing import Iterable

from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings


def get_vector_store(persist_dir: str = "./data/chroma") -> Chroma:
    embeddings = OpenAIEmbeddings()
    return Chroma(persist_directory=persist_dir, embedding_function=embeddings)


def upsert_texts(texts: Iterable[str], metadatas: list[dict] | None = None) -> None:
    store = get_vector_store()
    store.add_texts(list(texts), metadatas=metadatas)
    store.persist()
