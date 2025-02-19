import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import TaskItem from './TaskItem';

function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'tasks'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [user.uid]);

  return (
    <div>
      {tasks.length > 0 ? (
        tasks.map((task) => <TaskItem key={task.id} task={task} />)
      ) : (
        <p>No tasks yet.</p>
      )}
    </div>
  );
}

export default TaskList;