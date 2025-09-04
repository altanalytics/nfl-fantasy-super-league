import React, { useState, useEffect, ReactNode } from 'react';
import { get } from 'aws-amplify/api';

interface EmailGateProps {
  children: ReactNode;
}

const EmailGate: React.FC<EmailGateProps> = ({ children }) => {
  const [email, setEmail] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem('authorizedEmail');
    if (storedEmail) {
      validateEmail(storedEmail);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateEmail = async (emailToCheck: string) => {
    try {
      const restOperation = get({
        apiName: 'nfl-fantasy-api',
        path: 'teams'
      });
      const response = await restOperation.response;
      const teams = await response.body.json() as any[];
      
      const isValid = teams.some((team: any) => 
        team.email?.toLowerCase() === emailToCheck.toLowerCase()
      );
      
      if (isValid) {
        setIsAuthorized(true);
        setEmail(emailToCheck);
      } else {
        localStorage.removeItem('authorizedEmail');
      }
    } catch (error) {
      console.error('Error validating email:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const restOperation = get({
        apiName: 'nfl-fantasy-api',
        path: 'teams'
      });
      const response = await restOperation.response;
      const teams = await response.body.json() as any[];
      
      const isValid = teams.some((team: any) => 
        team.email?.toLowerCase() === email.toLowerCase()
      );
      
      if (isValid) {
        localStorage.setItem('authorizedEmail', email.toLowerCase());
        setIsAuthorized(true);
      } else {
        alert('Email not found in league roster');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      alert('Error checking email. Please try again.');
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <form onSubmit={handleSubmit} style={{ 
        padding: '2rem', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>NFL Super Fantasy League</h2>
        <p>Enter your email to access the league:</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your-email@example.com"
          required
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            marginBottom: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <button type="submit" disabled={isLoading} style={{
          width: '100%',
          padding: '0.5rem',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}>
          {isLoading ? 'Checking...' : 'Enter League'}
        </button>
      </form>
    </div>
  );
};

export default EmailGate;
