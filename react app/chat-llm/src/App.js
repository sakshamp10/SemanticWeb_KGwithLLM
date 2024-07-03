import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [conversations, setConversations] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSend = () => {
    const userMessage = inputValue.trim();
    if (userMessage) {
      console.log(userMessage);
      // Add the user's input to the conversations array
      setConversations(convs => [...convs, { text: userMessage, sender: 'user', isMarkdown: false }]);
      setInputValue('');

      // Send the input to the backend and await the LLM's response
      fetch('http://localhost:5002/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      })
      .then(response => response.json())
      .then(data => {
        // Simulate typing out the LLM's response with Markdown support
        typeMessage(data.text);
      })
      .catch(error => {
        // Handle any errors during fetch
        console.error('There was an error sending the message:', error);
        typeMessage("Error fetching response");
      });
    }
  };

  const typeMessage = (message) => {
    let i = 0;
    const speed = 30; // Typing speed in milliseconds
    const sender = 'llm';
    let typedMessage = '';

    const typingInterval = setInterval(() => {
      if (i < message.length) {
        typedMessage += message.charAt(i);
        setConversations(convs => [...convs.filter(conv => conv.sender !== 'typing'), { text: typedMessage, sender: 'typing', isMarkdown: true }]);
        i++;
      } else {
        clearInterval(typingInterval);
        setConversations(convs => [...convs.filter(conv => conv.sender !== 'typing'), { text: typedMessage, sender, isMarkdown: true }]);
      }
    }, speed);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          AI-Pilot
        </div>
        <div className="chat-body">
          {conversations.map((conv, index) => (
            <div key={index} className={`chat-message ${conv.sender}`}>
              {conv.isMarkdown ? <ReactMarkdown>{conv.text}</ReactMarkdown> : conv.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Message AI-Pilot..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
