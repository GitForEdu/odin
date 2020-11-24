import { useEffect } from "react"
import { useSession, signIn } from "next-auth/client"


export default function withAuth(Component) {
  return function Auth(props) {
    const [session, loading] = useSession()
    const unauthorized = !loading && (!session || session.error === "AccessTokenExpired")
    useEffect(() => {
      unauthorized && signIn("dataporten")
    }, [unauthorized])

    return <Component {...props} session={session}/>
  }
}