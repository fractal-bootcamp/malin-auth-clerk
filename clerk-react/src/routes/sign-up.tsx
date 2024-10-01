import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return <SignUp path="/sign-up" />
}

// anywhere on the client, you can just include the token
// {getToken} = useAuth() react hook for hooking into the clerk provider's state
// const await myToken = getToken()
// any time you send an HTTP request to your server
// if you would like the sender of that request to be KNOWN to the server
// and therefore to be able to access any of their own data
// then you must include the token in the Authorization header.