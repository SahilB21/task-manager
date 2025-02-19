import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase';

function Auth({ user }) {
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {user ? (
        <>
          <p>Signed in as {user.displayName}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign in with Google</button>
      )}
    </div>
  );
}

export default Auth;