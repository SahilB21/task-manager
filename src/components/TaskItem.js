import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Optional: AI Integration function to generate a motivational message
async function generateAIMotivation(taskText) {
  const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // WARNING: Do not expose your API key in production
  const prompt = `Give a motivational message or fun fact related to the following task: "${taskText}"`;
  
  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt,
        max_tokens: 50,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    return data.choices && data.choices.length > 0 ? data.choices[0].text.trim() : "Great job!";
  } catch (error) {
    console.error("Error fetching AI message:", error);
    return "Great job!";
  }
}

function TaskItem({ task }) {
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (task.completed) return; // Prevent duplicate completions

    try {
      // Update task status in Firestore
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        completed: true
      });

      // Optional: Get a motivational message from OpenAI
      setLoading(true);
      const aiMessage = await generateAIMotivation(task.text);
      setLoading(false);
      alert(aiMessage);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div
      style={{
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: task.completed ? '#d3ffd3' : '#f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.text}
      </span>
      <button onClick={handleComplete} disabled={task.completed || loading}>
        {task.completed ? "Completed" : loading ? "Loading..." : "Mark Complete"}
      </button>
    </div>
  );
}

export default TaskItem;