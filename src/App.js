import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Task Manager</h1>
      </header>
      <Auth user={user} />
      {user ? (
        <>
          <AddTask user={user} />
          <TaskList user={user} />
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>Please sign in to manage your tasks.</p>
      )}
    </div>
  );
}

export default App;