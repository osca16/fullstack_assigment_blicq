import { notFound, redirect } from "next/navigation"
import Image from "next/image"
import { getAdvertisementForModeration } from "@/actions/moderation.actions"
import ReviewPanel from "@/components/moderator/ReviewPanel"
import Footer from "@/components/shared/Footer"
import Header from "@/components/shared/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"

type ModeratorAdPageProps = Readonly<{
	params: Promise<{ id: string }>
}>

export default async function ModeratorAdPage({ params }: ModeratorAdPageProps) {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	if (session.user.role !== "MODERATOR") {
		redirect("/")
	}

	const { id } = await params
	const ad = await getAdvertisementForModeration(id)

	if (!ad) {
		notFound()
	}

	const primaryImage = ad.images.find((image: { isPrimary: boolean; filePath: string }) => image.isPrimary)?.filePath ?? ad.images[0]?.filePath

	return (
		<div className="min-h-screen bg-linear-to-b from-background via-emerald-50/20 to-background">
			<Header />
			<main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[2fr_1fr] lg:px-8">
				<Card>
					<CardHeader>
						<CardTitle>{ad.title}</CardTitle>
						<CardDescription>
							Submitted by {ad.user.name ?? "Unknown"} ({ad.user.email})
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{primaryImage && (
							<Image
								src={primaryImage}
								alt={ad.title}
								width={1200}
								height={720}
								className="h-72 w-full rounded-md object-cover"
								unoptimized
							/>
						)}

						<div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
							<p>Category: {ad.category.name}</p>
							<p>Location: {ad.location.name}</p>
							<p>Price: Rs. {Number(ad.price)}</p>
							<p>Status: {ad.status}</p>
						</div>

						<div>
							<h2 className="mb-2 text-sm font-medium">Description</h2>
							<p className="whitespace-pre-wrap text-sm text-muted-foreground">{ad.description}</p>
						</div>

						{ad.moderationNote && (
							<div className="rounded-md border bg-muted/40 p-3">
								<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Last moderation note</p>
								<p className="mt-1 text-sm">{ad.moderationNote}</p>
							</div>
						)}
					</CardContent>
				</Card>

				<ReviewPanel adId={ad.id} />
			</main>
			<Footer />
		</div>
	)
}
