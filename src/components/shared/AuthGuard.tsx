"use client"

import { useEffectHook } from "@/src/hooks/useEffectHook"
import { useRouterHook } from "@/src/hooks/useRouter.Hook"
import { useSessionHook } from "@/src/hooks/useSessionHook"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"

type AuthGuardProps = Readonly<{
	children: React.ReactNode
	allowedRoles?: Array<"USER" | "MODERATOR">
	redirectTo?: string
}>

export default function AuthGuard({
	children,
	allowedRoles,
	redirectTo = "/login",
}: AuthGuardProps) {
	const { session, isLoading, isAuthenticated } = useSessionHook()
	const router = useRouterHook()

	useEffectHook(() => {
		if (isLoading) {
			return
		}

		if (!isAuthenticated) {
			router.replace(redirectTo)
			return
		}

		if (
			allowedRoles?.length &&
			session?.user?.role &&
			!allowedRoles.includes(session.user.role)
		) {
			router.replace("/")
		}
	}, [allowedRoles, isAuthenticated, isLoading, redirectTo, router, session?.user?.role])

	if (isLoading || !isAuthenticated) {
		return (
			<div className="mx-auto flex min-h-[40vh] w-full max-w-md items-center justify-center px-4">
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Checking your access...</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						Please wait while we verify your account.
					</CardContent>
				</Card>
			</div>
		)
	}

	return <>{children}</>
}
