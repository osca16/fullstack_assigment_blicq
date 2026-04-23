import { auth } from "@/src/lib/auth"
import { redirect } from "next/navigation"
import { getUserAdvertisements } from "@/src/actions/ad.actions"
import Header from "@/src/components/shared/Header"
import Footer from "@/src/components/shared/Footer"
import AuthGuard from "@/src/components/shared/AuthGuard"
import UserDashboardClient from "@/src/components/user/UserDashboardClient"

export default async function UserDashboardPage() {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	if (session.user.role === "MODERATOR") {
		redirect("/moderator")
	}

	if (session.user.role !== "USER") {
		redirect("/")
	}

	const ads = await getUserAdvertisements(session.user.id)
	const userName = session.user.name ?? "User"

	return (
		<div className="min-h-screen bg-linear-to-b from-background via-emerald-50/50 to-background">
			<Header />
			<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<AuthGuard allowedRoles={["USER"]}>
					<UserDashboardClient userName={userName} ads={ads} />
				</AuthGuard>
			</main>
			<Footer />
		</div>
	)
}
