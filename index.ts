import 'dotenv/config';
import express from 'express';
import { clerkClient, clerkMiddleware, getAuth, requireAuth } from '@clerk/express';
const PORT = process.env.PORT;

const app = express()

// clerk middleware function checks the request cookes and headers for a session jwt.
// if found attaches the Auth object to the request object under the auth key
app.use(clerkMiddleware())

// protect your routes by redirecting unauthenticated users to the sign-in page
// requireAuth is used to protect the /protected route
// if user is not authenticated and enters a protected route they are redirected to the sign-in route
// QUESTION: Where does the requireAuth middleware get instantiated?
app.get('/protected', requireAuth({ signInUrl: '/sign-in' }), async (req, res) => {
  // if the user is authenticated, this helper is used to the get the userId
  const {userId} = getAuth(req)
  // this process fethces the current user's User object
  const user = await clerkClient.users.getUser(userId)
})
// the sign-in route
app.get('/sign-in', (req, res) => {
  res.render('sign-in')
})


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})