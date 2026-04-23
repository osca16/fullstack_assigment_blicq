import Link from "next/link"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card"
import { getAdImageUrl, PLACEHOLDER_IMAGE_URL } from "@/src/lib/image-utils"

type MyAdCardProps = Readonly<{
	ad: {
		id: string
		title: string
		description: string
		price: number | string
		status: "PENDING" | "ACTIVE" | "REJECTED"
		createdAt?: Date | string
		location?: { name: string }
		images?: Array<{ filePath: string; isPrimary?: boolean }>
	}
}>

export default function MyAdCard({ ad }: MyAdCardProps) {
	// Business logic: resolve the primary image to a browser-accessible URL.
	const primaryFilePath =
		ad.images?.find((image) => image.isPrimary)?.filePath ?? ad.images?.[0]?.filePath
	const primaryImageUrl = getAdImageUrl(primaryFilePath) 

	const statusClassName = {
		PENDING: "bg-amber-100 text-amber-700 border-amber-200",
		ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
		REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
	}[ad.status]

	return (
		<Card className="h-full">
			<div className="relative h-44 w-full overflow-hidden rounded-t-lg bg-muted">
				<Image
					src={primaryImageUrl}
					alt={ad.title}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 400px"
					unoptimized
				/>
			</div>

			<CardHeader>
				<div className="flex items-start justify-between gap-3">
					<CardTitle className="line-clamp-1">{ad.title}</CardTitle>
					<span className={`rounded-md border px-2 py-1 text-xs font-medium ${statusClassName}`}>
						{ad.status}
					</span>
				</div>
				<CardDescription className="line-clamp-2">{ad.description}</CardDescription>
			</CardHeader>

			<CardContent className="space-y-1">
				<p className="text-sm font-semibold">Rs. {ad.price}</p>
				{ad.location?.name && (
					<p className="text-sm text-muted-foreground">{ad.location.name}</p>
				)}
			</CardContent>

			<CardFooter className="flex items-center justify-end gap-2">
				<Button asChild variant="outline" size="sm">
					<Link href={`/ads/${ad.id}`}>View</Link>
				</Button>
				<Button asChild size="sm">
					<Link href={`/ads/${ad.id}/edit`}>Edit</Link>
				</Button>
			</CardFooter>
		</Card>
	)
}
