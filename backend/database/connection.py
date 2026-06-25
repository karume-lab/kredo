import json
import os

MOCK_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "mock_data", "seed_graph.json")

class Neo4jConnection:
    def __init__(self, uri):
        self.uri = uri
        self.driver = None
        # Setup real connection if URI is present, though we mock it here if not
        if self.uri:
            # from neo4j import GraphDatabase
            # self.driver = GraphDatabase.driver(uri, auth=("neo4j", "password"))
            pass

    def get_graph_data(self, phone_number: str):
        if not self.uri or not self.driver:
            # Fallback to mock data
            try:
                with open(MOCK_DATA_PATH, "r") as f:
                    data = json.load(f)
                    return data
            except FileNotFoundError:
                return {"nodes": [], "edges": []}
        else:
            # Implement real neo4j logic here
            pass

    def close(self):
        if self.driver:
            self.driver.close()

def get_connection():
    from dotenv import load_dotenv
    load_dotenv()
    uri = os.getenv("NEO4J_URI", "")
    return Neo4jConnection(uri)
