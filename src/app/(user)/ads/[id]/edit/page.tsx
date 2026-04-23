import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import Footer from "@/src/components/shared/Footer"
import Header from "@/src/components/shared/Header"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { auth } from "@/src/lib/auth"
import { prisma } from "@/src/lib/prisma"

type EditAdPageProps = Readonly<{
	params: Promise<{ id: string }>
}>

export default async function EditAdPage({ params }: EditAdPageProps) {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	if (session.user.role !== "USER") {
		redirect("/")
	}

	const { id } = await params

	const ad = await prisma.advertisement.findFirst({
		where: {
			id,
			userId: session.user.id,
		},
		select: {
			id: true,
			title: true,
			status: true,
			moderationNote: true,
		},
	})

	if (!ad) {
		notFound()
	}

	return (
		<div className="min-h-screen bg-linear-to-b from-background via-emerald-50/30 to-background">
			<Header />
			<main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
				<Card>
					<CardHeader>
						<CardTitle>Edit Advertisement</CardTitle>
						<CardDescription>
							Editing for <span className="font-medium">{ad.title}</span>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm text-muted-foreground">
							This page route is now active and secured. You can add full edit form fields next.
						</p>

						<div className="rounded-md border bg-muted/40 p-3 text-sm">
							<p>Status: <span className="font-medium">{ad.status}</span></p>
							{ad.moderationNote && (
								<p className="mt-2 text-muted-foreground">Moderator note: {ad.moderationNote}</p>
							)}
						</div>

						<div className="flex flex-wrap gap-2">
							<Button asChild>
								<Link href="/dashboard">Back to Dashboard</Link>
							</Button>
							<Button asChild variant="outline">
								<Link href={`/ads/${ad.id}`}>View Public Ad</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</main>
			<Footer />
		</div>
	)
}
