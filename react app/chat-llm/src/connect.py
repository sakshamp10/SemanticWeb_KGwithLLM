from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import queryProcess as qp


app = Flask(__name__)
CORS(app)

genai.configure(api_key='AIzaSyCRMHHFXXVVJeox6SOgxN3jTapn4IAFz1o')

model = genai.GenerativeModel('gemini-pro')

print("checking")

def call_gemini_llm_api(query):
    # query_new = qp.process_query(query)
    response = model.generate_content(query)
    # print(response.text)
    return {"text": ("{}".format(response.text))}


@app.route('/send', methods=['POST'])
def handle_message():
    data = request.json
    user_message = data['message']
    get_cypher = qp.getCypher(user_message)
    print(get_cypher)
    print()
    prompt = f"""
    you are given the following context:
    {str(get_cypher)}.
    use the above information and
    now answer the following query in natural language from the user:
    {user_message}
    """
    response = call_gemini_llm_api(prompt)
    return jsonify(response)



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
