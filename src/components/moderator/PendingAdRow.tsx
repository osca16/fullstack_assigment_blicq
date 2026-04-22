import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";

type PendingAdRowProps = Readonly<{
	ad: {
		id: string;
		title: string;
		price: string | number;
		createdAt: string;
		user: { name: string | null; email: string };
		category: { name: string };
		location: { name: string };
		images: Array<{ filePath: string }>;
	};
}>;

export default function PendingAdRow({ ad }: PendingAdRowProps) {
	const imagePath = ad.images[0]?.filePath;
	const createdLabel = new Date(ad.createdAt).toLocaleDateString();

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-3">
					<div>
						<CardTitle className="line-clamp-1">{ad.title}</CardTitle>
						<CardDescription>
							Seller: {ad.user.name ?? "Unknown"} ({ad.user.email})
						</CardDescription>
					</div>
					<span className="rounded-md border border-amber-200 bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
						PENDING
					</span>
				</div>
			</CardHeader>

			<CardContent className="space-y-3">
				<div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
					<p>Category: {ad.category.name}</p>
					<p>Location: {ad.location.name}</p>
					<p>Price: Rs. {ad.price}</p>
					<p>Submitted: {createdLabel}</p>
				</div>

				{imagePath && (
					<Image
						src={imagePath}
						alt={ad.title}
						width={800}
						height={440}
						className="h-44 w-full rounded-md object-cover"
						unoptimized
					/>
				)}

				<div className="flex justify-end">
					<Button asChild size="sm">
						<Link href={`/moderator/ads/${ad.id}`}>Review Ad</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
