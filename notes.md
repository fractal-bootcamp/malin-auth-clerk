### How does auth work when I am using a third-party auth provider.

### There are 3 main components of the system (at the beginning):

1. My Server
2. My Client
3. The 3rd Party Auth Server (Clerk)

### Client-side:

- My clients ask Clerk for a token and get one.
- It clients must send that token on all future requests to My Server, if it wants to be authed.

### Server-side:

1. My express server receives a request
2. The request goes through clerkMiddleware(); this adds the Auth object to req.auth, and allows me to use clerk functions like getAuth and clerkClient.
3. Once the request has gone through clerkMiddleware, it goes through MY middleware `userIdentificationMiddleware`
   The user is already authenticated, and I know who they are in Clerk's database, but I also want to know who they are in MY database. Or, if they don't exist, I'd like to create them in my database.
   SO I will:
   3a1. make sure the user exists `if(!req.auth.userId) next()`
   3a. check my database for a record with clerkId == req.auth.userId
   `prisma.user.findUnique({data: {clerkId: req.auth.userId}})
3b. if that record does not exist, create a user. `prisma.user.create`
3c. in either case, add the found user in the database to`req.user`
3d.`next()` (e.g. call the next middleware)
4. On my routes, I will use the requireAuth() middleware to protect routes that should only be accessed by users.
   inside the route, i can get user data and auth data using the `getAuth()` function
   `{userId} = getAuth(req)`
   I can also use the clerk client
   `await clerkClient.users.get(userId)` // or whatever
