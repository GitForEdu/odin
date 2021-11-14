import { useEffect } from "react"
import { useSession, signIn } from "next-auth/react"


export default function withAuth(Component) {
  return function Auth(props) {
    const { data: session, status } = useSession()
    const loading = status === "loading"
    const unauthorized = !loading && (!session || session.error === "AccessTokenExpired")
    useEffect(() => {
      unauthorized && signIn("dataporten")
    }, [unauthorized])

    if(loading || !session) {
      return null
    }

    return <Component {...props} session={session}/>
  }
}