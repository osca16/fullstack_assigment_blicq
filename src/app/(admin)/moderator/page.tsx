import Link from "next/link"
import { redirect } from "next/navigation"
import { getModeratorDashboardStats, getPendingAdvertisements } from "@/src/actions/moderation.actions"
import Footer from "@/src/components/shared/Footer"
import Header from "@/src/components/shared/Header"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { auth } from "@/src/lib/auth"
import StatusCard from "@/src/components/moderator/StatusCard"
import PendingAdRow from "@/src/components/moderator/PendingAdRow"

export default async function ModeratorPage() {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	if (session.user.role !== "MODERATOR") {
		redirect("/")
	}

	const [stats, pendingAds] = await Promise.all([
		getModeratorDashboardStats(),
		getPendingAdvertisements(),
	])

	return (
		<div className="min-h-screen bg-linear-to-b from-background via-emerald-50/40 to-background">
			<Header activePath="/moderator" />
			<main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<p className="text-xs font-medium uppercase tracking-wide text-primary">Moderator Panel</p>
						<h1 className="text-2xl font-semibold">Dashboard</h1>
					</div>
					<div className="flex flex-wrap gap-2">
						<Button asChild variant="outline">
							<Link href="/moderator/pending">Pending Queue</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/moderator/categories">Categories</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/moderator/locations">Locations</Link>
						</Button>
					</div>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<StatusCard title="Pending Ads" value={stats.pendingCount} description="Waiting for moderation review." />
					<StatusCard title="Active Ads" value={stats.activeCount} description="Currently visible to public users." />
					<StatusCard title="Rejected Ads" value={stats.rejectedCount} description="Need fixes before activation." />
					<StatusCard title="Total Ads" value={stats.totalAds} description="All advertisements across statuses." />
					<StatusCard title="Categories" value={stats.categoryCount} description="Taxonomy groups available." />
					<StatusCard title="Locations" value={stats.locationCount} description="Supported marketplace regions." />
				</div>

				<Card>
					<CardHeader>
						<div className="flex items-center justify-between gap-3">
							<div>
								<CardTitle>Latest Pending Ads</CardTitle>
								<CardDescription>Review the newest submissions quickly.</CardDescription>
							</div>
							<Button asChild size="sm">
								<Link href="/moderator/pending">Open Full Queue</Link>
							</Button>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{pendingAds.length === 0 ? (
							<p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
								No pending advertisements right now.
							</p>
						) : (
							pendingAds.slice(0, 5).map((ad) => <PendingAdRow key={ad.id} ad={ad} />)
						)}
					</CardContent>
				</Card>
			</main>
			<Footer />
		</div>
	)
}
