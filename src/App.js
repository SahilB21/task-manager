import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Task Manager</h1>
      <Auth user={user} />
      {user ? (
        <>
          <AddTask user={user} />
          <TaskList user={user} />
        </>
      ) : (
        <p>Please sign in to manage your tasks.</p>
      )}
    </div>
  );
}

export default App;