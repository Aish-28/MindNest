"use client";

import { useState } from "react";
import styles from "./questions.module.css";

// Same Navbar & Sidebar
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";

const Questions = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const handleAsk = () => {
    if (!question.trim()) return;

    // Add user question
    const newMessage = {
      type: "user",
      text: question,
    };

    // Dummy bot response
    const botReply = {
      type: "bot",
      text: "This is the AI response for: " + question,
    };

    setMessages([...messages, newMessage, botReply]);
    setQuestion("");
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className={styles.main}>
        {/* Navbar */}
        <Navbar />

        <div className={styles.chatContainer}>
          <h1 className={styles.heading}>Ask Questions</h1>

          {/* Chat Messages */}
          <div className={styles.chatBox}>
            {messages.length === 0 ? (
              <p className={styles.empty}>
                Ask anything related to your project...
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.type === "user"
                      ? styles.userMessage
                      : styles.botMessage
                  }
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Type your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={styles.input}
            />

            <button onClick={handleAsk} className={styles.button}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;