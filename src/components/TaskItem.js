import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Function to generate a motivational message via OpenAI API
async function generateAIMotivation(taskText) {
    const OPENAI_API_KEY = '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'; // Replace with your valid API key
    const endpoint = "https://api.openai.com/v1/chat/completions";
    
    // Build the messages array. A system message can help set the context.
    const messages = [
      { role: "system", content: "You are a helpful assistant that provides motivational messages." },
      { role: "user", content: `Give a motivational message or fun fact related to the following task: "${taskText}"` }
    ];
    
    try {
      console.log("Sending request to OpenAI with messages:", messages);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages,
          max_tokens: 50,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API Error:", errorData);
        return "Great job!";
      }
      
      const data = await response.json();
      console.log("OpenAI API Response:", data);
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      } else {
        console.warn("No valid message found in API response.");
        return "Great job!";
      }
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
      console.log("Task marked as complete in Firestore:", task.id);

      // Call OpenAI API for a motivational message
      setLoading(true);
      const aiMessage = await generateAIMotivation(task.text);
      console.log("Received AI message:", aiMessage);
      setLoading(false);
      
      // Display the message if it exists
      if (aiMessage) {
        alert(aiMessage);
      } else {
        alert("Great job!");
      }
    } catch (error) {
      console.error("Error updating task or fetching AI message:", error);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <span>{task.text}</span>
      <button onClick={handleComplete} disabled={task.completed || loading}>
        {task.completed ? "Completed" : loading ? "Loading..." : "Mark Complete"}
      </button>
    </div>
  );
}

export default TaskItem;