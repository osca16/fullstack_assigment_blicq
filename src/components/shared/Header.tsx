import Link from "next/link"
import { auth } from "@/src/lib/auth"
import { logout } from "@/src/actions/auth.actions"
import { Button } from "@/src/components/ui/button"

export default async function Header() {
    const session = await auth()
    const isModerator = session?.user?.role === "MODERATOR"

    return (
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    <Link href="/" prefetch={false} className="text-sm font-semibold tracking-tight">
                        Classified Hub
                    </Link>
                </div>

                <nav className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/search" prefetch={false}>Browse</Link>
                    </Button>
                    {session?.user && (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/dashboard" prefetch={false}>Dashboard</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/ads/new" prefetch={false}>Post Ad</Link>
                            </Button>
                            {isModerator && (
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/moderator/pending" prefetch={false}>Moderate</Link>
                                </Button>
                            )}
                            <form action={logout}>
                                <Button type="submit" variant="outline" size="sm">
                                    Sign out
                                </Button>
                            </form>
                        </>
                    )}
                    {!session?.user && (
                        <Button asChild size="sm">
                            <Link href="/login" prefetch={false}>Login</Link>
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    )
}