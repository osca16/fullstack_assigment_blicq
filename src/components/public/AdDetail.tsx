import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { getAdImageUrl } from "@/lib/image-utils"

type AdDetailProps = Readonly<{
	ad: {
		id: string
		title: string
		description: string
		price: number
		category: { name: string }
		location: { name: string }
		images: Array<{ filePath: string; isPrimary: boolean }>
		user: { name: string | null; email: string }
	}
	showSellerContact: boolean
}>

export default function AdDetail({ ad, showSellerContact }: AdDetailProps) {
	// Business logic: resolve the primary image to a browser-accessible URL.
	const primaryFilePath =
		ad.images.find((image) => image.isPrimary)?.filePath ?? ad.images[0]?.filePath

	const primaryImageUrl = getAdImageUrl(primaryFilePath)

	return (
		<div className="space-y-6">
			{/* Image gallery – primary image */}
			<div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
				<Image
					src={primaryImageUrl}
					alt={ad.title}
					fill
					className="object-cover"
					sizes="(max-width: 1024px) 100vw, 900px"
					unoptimized
				/>
			</div>

			{/* Multiple images strip */}
			{ad.images.length > 1 && (
				<div className="flex gap-3 overflow-x-auto pb-2">
					{ad.images.map((image, index) => (
						<div
							key={image.filePath}
							className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border bg-muted"
						>
							<Image
								src={getAdImageUrl(image.filePath)}
								alt={`${ad.title} image ${index + 1}`}
								fill
								className="object-cover"
								sizes="112px"
								unoptimized
							/>
						</div>
					))}
				</div>
			)}

			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">{ad.title}</CardTitle>
					<CardDescription className="flex items-center gap-2 text-sm">
						<span>{ad.category.name}</span>
						<span>•</span>
						<MapPin className="h-3.5 w-3.5" />
						<span>{ad.location.name}</span>
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<p className="text-2xl font-bold text-primary">
						Rs. {Number(ad.price).toLocaleString()}
					</p>

					<div>
						<p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
							Description
						</p>
						<p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
							{ad.description}
						</p>
					</div>

					{/* Seller contact block
					    - Guests:        show generic "Seller" label + login prompt (name hidden)
					    - Logged-in:     show real name + email                                   */}
					<div className="rounded-md border bg-muted/40 p-4">
						<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
							Seller
						</p>

						{showSellerContact ? (
							/* Authenticated user — reveal full contact details */
							<>
								<p className="mt-1 font-medium">{ad.user.name ?? "Seller"}</p>
								<p className="text-sm text-muted-foreground">{ad.user.email}</p>
							</>
						) : (
							/* Guest — mask identity, prompt to login */
							<>
								<p className="mt-1 font-medium text-muted-foreground">Seller</p>
								<div className="mt-2 flex flex-wrap items-center gap-2">
									<p className="text-sm text-muted-foreground">
										Login to view seller contact details.
									</p>
									<Button asChild size="sm" variant="outline">
										<Link href="/login">Login</Link>
									</Button>
								</div>
							</>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
