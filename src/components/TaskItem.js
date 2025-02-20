import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc} from 'firebase/firestore';
import { db } from '../firebase';

async function generateAIMotivation(taskText) {
    try {
      const response = await fetch("https://us-central1-upahead-assignment.cloudfunctions.net/getMotivation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskText })
      });
      const data = await response.json();
      console.log("Client received:", data);
      return data.message || "Great job!";
    } catch (error) {
      console.error("Error calling Cloud Function:", error);
      return "Great job!";
    }
  }

function TaskItem({ task }) {
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (task.completed) return;

    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        completed: true
      });
      console.log("Task marked as complete in Firestore:", task.id);

      setLoading(true);
      const aiMessage = await generateAIMotivation(task.text);
      console.log("Received AI message:", aiMessage);
      setLoading(false);
      
      if (aiMessage) {
        alert(aiMessage);
      } else {
        alert("Great job!");
      }
    } catch (error) {
      console.error("Error updating task or fetching AI message:", error);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm(`Are you sure you want to remove "${task.text}"?`)) {
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', task.id);
      await deleteDoc(taskRef);
      alert("Task removed!");
    } catch (error) {
      console.error("Error removing task:", error);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <span>{task.text}</span>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleComplete}
          disabled={task.completed || loading}
        >
          {task.completed ? "Completed" : loading ? "Loading..." : "Mark Complete"}
        </button>
        <button onClick={handleRemove} style={{ backgroundColor: '#dc3545' }}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default TaskItem;