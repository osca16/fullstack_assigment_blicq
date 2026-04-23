"use client"

import PendingAdRow from "@/src/components/moderator/PendingAdRow"
import { useModeratorPendingFilterHook } from "@/src/hooks/useModeratorPendingFilterHook"

type PendingAd = {
	id: string
	title: string
	price: string | number
	createdAt: string
	user: { name: string | null; email: string }
	category: { name: string }
	location: { name: string }
	images: Array<{ filePath: string }>
}

type PendingAdsClientProps = Readonly<{
	ads: PendingAd[]
}>

export default function PendingAdsClient({ ads }: PendingAdsClientProps) {
	const { query, setQuery, filteredAds } = useModeratorPendingFilterHook(ads)

	return (
		<div className="space-y-4">
			<input
				type="text"
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				placeholder="Search by title, seller, category, or location..."
				className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
			/>

			{filteredAds.length === 0 ? (
				<div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
					No pending ads match your search.
				</div>
			) : (
				<div className="space-y-4">
					{filteredAds.map((ad) => (
						<PendingAdRow key={ad.id} ad={ad} />
					))}
				</div>
			)}
		</div>
	)
}
