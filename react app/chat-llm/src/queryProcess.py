import google.generativeai as genai
from langchain_community.graphs import Neo4jGraph
from neo4j import GraphDatabase
import neo4j
import pandas as pd
from langchain.chains import GraphCypherQAChain
import os
from langchain_google_genai import ChatGoogleGenerativeAI

os.environ["GOOGLE_API_KEY"] = "AIzaSyCRMHHFXXVVJeox6SOgxN3jTapn4IAFz1o"

# Initialize a Fireworks chat model

genai.configure(api_key='AIzaSyCRMHHFXXVVJeox6SOgxN3jTapn4IAFz1o')

model = genai.GenerativeModel('gemini-pro')

uri = "bolt://localhost:7687"  # Adjust as necessary
username = "neo4j"
password = "12345678"

graph = Neo4jGraph(url=uri, username=username, password=password)
chat = ChatGoogleGenerativeAI(model="gemini-pro")

cypher_chain = GraphCypherQAChain.from_llm(
    cypher_llm=chat,
    qa_llm=chat,
    graph=graph,
    verbose=True,
    return_intermediate_steps=True
)
chain = GraphCypherQAChain.from_llm(
    chat, graph=graph, verbose=True, return_intermediate_steps=True
)

def getCypher(query):
    
    
    # print(graph.schema)
    # prompt = f""" 
    #     you are given the following schema for a database about Hayao Miyazaki:
    #     {graph.schema}
        
        
        
    #     write a cypher query to query the noe4j database for the following input from the user in natural language
    #     {query}
        
    #     if the query doesn't have enough context, assume that we are talking about "Hayao Miyazaki" (Always use full name) and write the cypher query on that respect.
        
    #     i need you to return only the query, and nothing else in the response.
    #     """
    # response = model.generate_content(prompt)
    
    return chain(query)


def getResponse(get_cypher):
    return chain(get_cypher)