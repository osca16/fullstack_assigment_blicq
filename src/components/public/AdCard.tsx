import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { MapPin } from "lucide-react"

type AdCardProps = {
	ad: {
		id: string
		title: string
		price: number
		location: {
			name: string
		}
		images: Array<{
			filePath: string
		}>
	}
}

export default function AdCard({ ad }: AdCardProps) {
	const primaryImage = ad.images[0]?.filePath ?? "/placeholder-image.jpg" // Fallback if no image

	return (
		<Link href={`/ad/${ad.id}`} className="block transition-transform duration-200 hover:scale-[1.02]">
			<Card className="h-full overflow-hidden hover:border-primary/50 hover:shadow-md">
				<div className="relative aspect-[4/3] w-full bg-muted">
					<Image
						src={primaryImage}
						alt={ad.title}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						unoptimized={!primaryImage.startsWith("http")}
					/>
				</div>
				<CardHeader className="p-4 pb-2">
					<CardTitle className="line-clamp-2 text-base">{ad.title}</CardTitle>
				</CardHeader>
				<CardContent className="p-4 pt-0 flex flex-col gap-2">
					<p className="text-lg font-bold text-primary">Rs. {ad.price.toLocaleString()}</p>
					<div className="flex items-center text-sm text-muted-foreground">
						<MapPin className="mr-1 h-3.5 w-3.5" />
						<span className="truncate">{ad.location.name}</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}
