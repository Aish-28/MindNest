"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import styles from "./questions.module.css";

import Sidebar from "../../../components/sidebar";
import Navbar from "../../../components/navbar";

const Questions = () => {

  // Get projectId from URL
  const { projectId } = useParams();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {

    if (!question.trim()) return;

    // Add user message instantly
    const userMessage = {
      type: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = question;

    setQuestion("");
    setLoading(true);

    try {

      const response = await fetch("/api/content/gen/qna", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          question: currentQuestion,
          projectId: projectId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Bot response
      const botMessage = {
        type: "bot",
        text: data.answer,
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {

      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text:
            error.message ||
            "Failed to get response from chatbot.",
        },
      ]);

    } finally {

      setLoading(false);
    }
  };

  // Enter key support
  const handleKeyDown = (e) => {

    if (e.key === "Enter") {
      handleAsk();
    }
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

          <h1 className={styles.heading}>
            Ask Questions
          </h1>

          {/* Chat Messages */}
          <div className={styles.chatBox}>

            {messages.length === 0 ? (

              <p className={styles.empty}>
                Ask anything related to this project...
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

            {/* Loading */}
            {loading && (

              <div className={styles.botMessage}>
                Thinking...
              </div>

            )}

          </div>

          {/* Input */}
          <div className={styles.inputContainer}>

            <input
              type="text"
              placeholder="Type your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.input}
            />

            <button
              onClick={handleAsk}
              className={styles.button}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Questions;