import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
const SERVER_URL = import.meta.env.VITE_SERVER_URL

const AuthedStuff: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken()
        const response = await axios.get(`${SERVER_URL}/protected`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Protected Data:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default AuthedStuff;