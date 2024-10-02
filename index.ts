import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import { clerkClient, clerkMiddleware, getAuth, requireAuth, type User } from '@clerk/express';
import cors from "cors"
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT;

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



interface UserStructure {
    id:         String;  
    username?:       String;
    firstName?:      String;
    imageUrl?:       String;
}

const storeUserInDatabase = () => {
  const storeUserDetails = {}
}


// you can do networkless verification of tokens using jwt library if you have the signing key

// protect your routes by redirecting unauthenticated users to the sign-in page
// requireAuth is used to protect the /protected route
// if user is not authenticated and enters a protected route they are redirected to the sign-in route
// QUESTION: Where does the requireAuth middleware get instantiated?
// How can I use requireAuth with React rather than redirecting to a server url
app.get('/protected', requireAuth({ signInUrl: '/sign-in' }), async (req, res) => {
  console.log("in protected")
  try {
    // if the user is authenticated, this helper is used to the get the userId
  const {userId} = getAuth(req)
  // this process fethces the current user's User object
  const user = await clerkClient.users.getUser(userId)

  const userEmail:string = user.emailAddresses[0]?.emailAddress
  const userAuthSource:string = user.emailAddresses[0]?.linkedTo[0]?.type ?? 'unknown';
  const { 
    id: userID, 
    imageUrl, 
    username, 
    firstName,
  } = user

  console.log("######")
  // console.log(userEmail, '\n', userAuthSource, '\n', userID,'\n', imageUrl, '\n',username, '\n',firstName )

  const storeUserInDatabase = await prisma.user.create({
    data: {
      userId: userID,
      username: username,
      firstName: firstName,
      userEmail: userEmail,
      imageUrl: imageUrl,
      userAuthSource: userAuthSource
    }
  })
  console.log(storeUserInDatabase);
  return res.json({storeUserInDatabase});
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        console.log(
          'There is a unique constraint violation, a new user cannot be created with this userId'
        )
        return res.status(409).json({
          error: 'User already exists',
          message: 'A user with this ID already exists in the database.'
        });
      }
    }
    console.error('Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while processing your request.'
    });
  }
}
)
// the sign-in route
app.get('/sign-in', (req, res) => {
  res.render('sign-in')
})


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})