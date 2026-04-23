import { notFound } from "next/navigation"
import { auth } from "@/src/lib/auth"
import { prisma } from "@/src/lib/prisma"
import Header from "@/src/components/shared/Header"
import Footer from "@/src/components/shared/Footer"
import AdDetail from "@/src/components/public/AdDetail"

type PublicAdDetailPageProps = Readonly<{
	params: Promise<{ id: string }>
}>

export default async function PublicAdDetailPage({ params }: PublicAdDetailPageProps) {
	const { id } = await params

	const ad = await prisma.advertisement.findFirst({
		where: {
			id,
			status: "ACTIVE",
			user: {
				status: "ACTIVE",
			},
		},
		select: {
			id: true,
			title: true,
			description: true,
			price: true,
			category: {
				select: {
					name: true,
				},
			},
			location: {
				select: {
					name: true,
				},
			},
			images: {
				select: {
					filePath: true,
					isPrimary: true,
				},
				orderBy: {
					isPrimary: "desc",
				},
			},
			user: {
				select: {
					name: true,
					email: true,
				},
			},
		},
	})

	if (!ad) {
		notFound()
	}

	const session = await auth()
	const showSellerContact = Boolean(session?.user)

	return (
		<div className="min-h-screen bg-linear-to-b from-background via-emerald-50/20 to-background">
			<Header />
			<main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
				<AdDetail
					ad={{
						...ad,
						price: Number(ad.price),
					}}
					showSellerContact={showSellerContact}
				/>
			</main>
			<Footer />
		</div>
	)
}
