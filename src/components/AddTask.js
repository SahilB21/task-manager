import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function AddTask({ user }) {
  const [task, setTask] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    try {
      await addDoc(collection(db, 'tasks'), {
        text: task,
        completed: false,
        createdAt: serverTimestamp(),
        uid: user.uid,
        userName: user.displayName
      });
      setTask('');
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Enter new task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{ padding: '10px', width: '70%' }}
      />
      <button type="submit" style={{ padding: '10px', marginLeft: '10px' }}>
        Add Task
      </button>
    </form>
  );
}

export default AddTask;