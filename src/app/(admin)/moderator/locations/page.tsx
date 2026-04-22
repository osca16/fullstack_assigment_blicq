import { redirect } from "next/navigation"
import { createLocation, getLocations } from "@/src/actions/moderation.actions"
import ModeratorFormCard from "@/src/components/moderator/ModeratorFormCard"
import Footer from "@/src/components/shared/Footer"
import Header from "@/src/components/shared/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { auth } from "@/src/lib/auth"

export default async function ModeratorLocationsPage() {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	if (session.user.role !== "MODERATOR") {
		redirect("/")
	}

	const locations = await getLocations()

	return (
		<div className="min-h-screen bg-linear-to-b from-background via-emerald-50/20 to-background">
			<Header />
			<main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
				<ModeratorFormCard
					title="Create Location"
					description="Add marketplace regions used by search and ad listings."
					submitLabel="Create Location"
					namePlaceholder="Colombo"
					action={createLocation}
				/>

				<Card>
					<CardHeader>
						<CardTitle>Existing Locations</CardTitle>
						<CardDescription>All locations available to users while posting ads.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{locations.length === 0 ? (
							<p className="text-sm text-muted-foreground">No locations added yet.</p>
						) : (
							locations.map((location) => (
								<div key={location.id} className="rounded-md border p-3">
									<p className="text-sm font-medium">{location.name}</p>
									<p className="text-xs text-muted-foreground">Slug: {location.slug}</p>
								</div>
							))
						)}
					</CardContent>
				</Card>
			</main>
			<Footer />
		</div>
	)
}
