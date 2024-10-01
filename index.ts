import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import { clerkClient, clerkMiddleware, getAuth, requireAuth, type User } from '@clerk/express';
import cors from "cors"
const PORT = process.env.PORT;
const usersInformation: User[] = []

const app = express()
app.use(cors())
app.use(express.json())
// clerk middleware function checks the request cookes and headers for a session jwt.
// if found attaches the Auth object to the request object under the auth key
app.use(clerkMiddleware())

// this is a function that returns a middleware function, and accepts a permissionNeeded argument in order to construct that function.
// this is a form of higher order function
// const hasPermissionMiddleware = (permissionNeeded: string) => (req: Request, res: Response, next: NextFunction) => {
//   const auth = getAuth(req) // get the auth object from clerk
//   console.log(auth)
//   if (!auth.has({ permission: permissionNeeded })) { // clerk lets you set up permissions out of the box
//     res.status(403).send('Forbidden') // send them to forbidden
//     return;
//   }
//   return next()
// }

// app.get('/access-user', hasPermissionMiddleware("userAccess"),  (req, res) => {
//   res.send("stub")
// })

// app.get('/access-photos', hasPermissionMiddleware("photos"), (req, res) => {
//   res.send("stub")
// })

// app.get('/access-calendar', hasPermissionMiddleware("calendar"), (req, res) => {
//   res.send("stub")
// })




// you can do networkless verification of tokens using jwt library if you have the signing key

// protect your routes by redirecting unauthenticated users to the sign-in page
// requireAuth is used to protect the /protected route
// if user is not authenticated and enters a protected route they are redirected to the sign-in route
// QUESTION: Where does the requireAuth middleware get instantiated?
// How can I use requireAuth with React rather than redirecting to a server url
app.get('/protected', requireAuth({ signInUrl: '/sign-in' }), async (req, res) => {
  console.log("in protected")
  // if the user is authenticated, this helper is used to the get the userId
  const {userId} = getAuth(req)
  // this process fethces the current user's User object
  const user = await clerkClient.users.getUser(userId)
  console.log("Logged In User Information: ", user)
  const usersInformationKeys = Object.keys(user)
  console.log(usersInformationKeys)
})
// the sign-in route
app.get('/sign-in', (req, res) => {
  res.render('sign-in')
})


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})