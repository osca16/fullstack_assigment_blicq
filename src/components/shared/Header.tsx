import Link from "next/link"
import { auth } from "@/lib/auth"
import { logout } from "@/actions/auth.actions"
import { Button } from "@/components/ui/button"

type HeaderProps = Readonly<{
    /** Pathname of the currently active page (e.g. "/search").
     *  When provided the matching nav link is visually highlighted. */
    activePath?: string
}>

export default async function Header({ activePath }: HeaderProps) {
    const session = await auth()
    const role = session?.user?.role  // "USER" | "MODERATOR" | undefined

    const isModerator = role === "MODERATOR"
    const isUser = role === "USER"
    const isGuest = !session?.user

    /** Returns "default" variant when this path is active, otherwise "ghost". */
    function navVariant(path: string): "default" | "ghost" {
        return activePath === path ? "default" : "ghost"
    }

    return (
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    <Link href="/" prefetch={false} className="text-sm font-semibold tracking-tight">
                        Classified Hub
                    </Link>
                </div>

                {/* Nav — buttons differ by role */}
                <nav className="flex items-center gap-2">

                    {/* ── GUEST ── Browse Ads (active) + Login */}
                    {isGuest && (
                        <>
                            <Button asChild variant={navVariant("/search")} size="sm">
                                <Link href="/search" prefetch={false}>Browse Ads</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href="/login" prefetch={false}>Login</Link>
                            </Button>
                        </>
                    )}

                    {/* ── USER ── Browse Ads (active) + Dashboard + Post Ad + Sign out */}
                    {isUser && (
                        <>
                            <Button asChild variant={navVariant("/search")} size="sm">
                                <Link href="/search" prefetch={false}>Browse Ads</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/dashboard" prefetch={false}>Dashboard</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/ads/new" prefetch={false}>Post Ad</Link>
                            </Button>
                            <form action={logout}>
                                <Button type="submit" variant="outline" size="sm">
                                    Sign out
                                </Button>
                            </form>
                        </>
                    )}

                    {/* ── MODERATOR ── Dashboard + Sign out only */}
                    {isModerator && (
                        <>
                            <Button asChild variant={navVariant("/moderator")} size="sm">
                                <Link href="/moderator" prefetch={false}>Moderator Dashboard</Link>
                            </Button>
                            <form action={logout}>
                                <Button type="submit" variant="outline" size="sm">
                                    Sign out
                                </Button>
                            </form>
                        </>
                    )}

                </nav>
            </div>
        </header>
    )
}
