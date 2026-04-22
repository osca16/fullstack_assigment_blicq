import Link from "next/link"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"

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
	const primaryImage = ad.images.find((image) => image.isPrimary)?.filePath ?? ad.images[0]?.filePath

	return (
		<Card>
			<CardHeader>
				<CardTitle>{ad.title}</CardTitle>
				<CardDescription>
					{ad.category.name} • {ad.location.name}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				{primaryImage && (
					<Image
						src={primaryImage}
						alt={ad.title}
						width={1200}
						height={700}
						className="h-72 w-full rounded-md object-cover"
						unoptimized
					/>
				)}

				<p className="text-lg font-semibold">Rs. {ad.price}</p>
				<p className="whitespace-pre-wrap text-sm text-muted-foreground">{ad.description}</p>

				<div className="rounded-md border bg-muted/40 p-3">
					<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Seller</p>
					<p className="mt-1 text-sm">{ad.user.name ?? "Unknown seller"}</p>
					{showSellerContact ? (
						<p className="text-sm text-muted-foreground">{ad.user.email}</p>
					) : (
						<div className="mt-2 flex flex-wrap items-center gap-2">
							<p className="text-sm text-muted-foreground">Login to view seller contact details.</p>
							<Button asChild size="sm" variant="outline">
								<Link href="/login">Login</Link>
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
