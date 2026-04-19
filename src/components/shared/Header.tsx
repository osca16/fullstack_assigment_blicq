import { auth } from "@/src/lib/auth"

export default async function Header(){
    const session = await auth();
    return(
        <div>
            {session?.user ? (
                <p>Welcome {session.user.name} </p>
            ) : (
                <p>Not Logged in</p>
            )}
        </div>
    )
}