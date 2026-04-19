import { loginWithGoogle } from "@/src/actions/auth.actions";

export function LoginPage() {
    return(
        <div className="flex h-screen items-center justify-center">
            <form action={loginWithGoogle}>
                <button className="px-6 py-3 bg-black text-white rounded">
                    Sign in with Google
                </button>
            </form>
        </div>
    )
}

export default LoginPage;