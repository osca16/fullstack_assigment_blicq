"use client"

import { useMemo } from "react"
import { useStateHook } from "@/src/hooks/useStateHook"

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

export function useModeratorPendingFilterHook(ads: PendingAd[]) {
	const query = useStateHook("")

	const filteredAds = useMemo(() => {
		const keyword = query.value.trim().toLowerCase()
		if (!keyword) {
			return ads
		}

		return ads.filter((ad) => {
			const seller = ad.user.name ?? ad.user.email
			return (
				ad.title.toLowerCase().includes(keyword) ||
				seller.toLowerCase().includes(keyword) ||
				ad.category.name.toLowerCase().includes(keyword) ||
				ad.location.name.toLowerCase().includes(keyword)
			)
		})
	}, [ads, query.value])

	return {
		query: query.value,
		setQuery: query.setValue,
		filteredAds,
	}
}
