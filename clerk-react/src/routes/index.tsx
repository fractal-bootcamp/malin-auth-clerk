import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react';

export default function IndexPage() {

  const { getToken } = useAuth()

  useEffect(() => {
    // Something missing here is middleware that checks whether the user already exists
    // Only if they do not should the database be written to
    const fetchData = async () => {
      try {
        const token = await getToken()
        if (token) {
          const response = await axios.get('http://localhost:3001/protected', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log(response)
        } else {
          console.log("User not authenticated")
          return null
        }

      } catch (err: unknown) {
        console.error('Error:', err.response.data.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>This is the index page</h1>
      <div>
        <ul>
          <li>
            <Link to="/sign-up">Sign Up</Link>
          </li>
          <li>
            <Link to="/sign-in">Sign In</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}