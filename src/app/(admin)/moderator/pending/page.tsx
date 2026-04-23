import { redirect } from "next/navigation"
import { getPendingAdvertisements } from "@/actions/moderation.actions"
import PendingAdsClient from "@/components/moderator/PendingAdsClient"
import Footer from "@/components/shared/Footer"
import Header from "@/components/shared/Header"
import { auth } from "@/lib/auth"

export default async function ModeratorPendingPage() {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	if (session.user.role !== "MODERATOR") {
		redirect("/")
	}

	const pendingAds = await getPendingAdvertisements()

	return (
		<div className="min-h-screen bg-linear-to-b from-background via-amber-50/30 to-background">
			<Header />
			<main className="mx-auto w-full max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
				<div>
					<p className="text-xs font-medium uppercase tracking-wide text-primary">Moderator Panel</p>
					<h1 className="text-2xl font-semibold">Pending Advertisements</h1>
					<p className="text-sm text-muted-foreground">
						Search and review all advertisements waiting for moderation.
					</p>
				</div>

				<PendingAdsClient ads={pendingAds} />
			</main>
			<Footer />
		</div>
	)
}
