import * as React from 'react'
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function DashboardLayout() {
  const { userId, isLoaded } = useAuth()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken()
        console.log(token)
        const response = await axios.get('http://localhost:3001/protected', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response)
        setData(response.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  console.log('test', userId)



  React.useEffect(() => {
    if (isLoaded && !userId) {
      navigate('/sign-in')
    }
  }, [isLoaded])

  if (!isLoaded) return 'Loading...'

  return <Outlet />
}