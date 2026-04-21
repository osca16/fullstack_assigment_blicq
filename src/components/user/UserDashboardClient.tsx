"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card"
import MyAdCard from "@/src/components/user/MyAdCard"
import { useRouterHook } from "@/src/hooks/useRouter.Hook"
import { useSearchParamsHook } from "@/src/hooks/useSearchParamsHook"
import { useStateHook } from "@/src/hooks/useStateHook"

type DashboardAd = {
	id: string
	title: string
	description: string
	price: number
	status: "PENDING" | "ACTIVE" | "REJECTED"
	createdAt: string
	location: { name: string } | null
	images: Array<{ filePath: string; isPrimary: boolean }>
}

type UserDashboardClientProps = Readonly<{
	userName: string
	ads: DashboardAd[]
}>

const DASHBOARD_STATUSES = ["ALL", "PENDING", "ACTIVE", "REJECTED"] as const

type DashboardStatus = (typeof DASHBOARD_STATUSES)[number]

export default function UserDashboardClient({ userName, ads }: UserDashboardClientProps) {
	const router = useRouterHook()
	const { getParam, setParam, removeParam } = useSearchParamsHook()
	const queryState = useStateHook("")

	const selectedStatusParam = getParam("status")
	const selectedStatus: DashboardStatus = DASHBOARD_STATUSES.includes(
		selectedStatusParam as DashboardStatus
	)
		? (selectedStatusParam as DashboardStatus)
		: "ALL"

	const filteredAds = useMemo(() => {
		const query = queryState.value.trim().toLowerCase()

		return ads.filter((ad) => {
			const matchesStatus = selectedStatus === "ALL" || ad.status === selectedStatus
			const matchesQuery =
				query.length === 0 ||
				ad.title.toLowerCase().includes(query) ||
				ad.description.toLowerCase().includes(query)

			return matchesStatus && matchesQuery
		})
	}, [ads, queryState.value, selectedStatus])

	const pendingCount = ads.filter((ad) => ad.status === "PENDING").length
	const activeCount = ads.filter((ad) => ad.status === "ACTIVE").length
	const rejectedCount = ads.filter((ad) => ad.status === "REJECTED").length

	return (
		<div className="space-y-6">
			<Card className="border-none bg-linear-to-r from-primary/10 via-background to-emerald-100/60 ring-1 ring-border">
				<CardHeader>
					<CardTitle className="text-2xl">Welcome back, {userName}</CardTitle>
					<CardDescription>
						Manage your listings, monitor moderation status, and publish faster.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-wrap items-center gap-3">
					<Button onClick={() => router.push("/ads/new")}>
						<Plus className="mr-1.5 h-4 w-4" />
						Create New Ad
					</Button>
					<Button asChild variant="outline">
						<Link href="/search">Browse Marketplace</Link>
					</Button>
				</CardContent>
			</Card>

			<div className="grid gap-4 sm:grid-cols-3">
				<Card>
					<CardHeader>
						<CardDescription>Pending</CardDescription>
						<CardTitle>{pendingCount}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Active</CardDescription>
						<CardTitle>{activeCount}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Rejected</CardDescription>
						<CardTitle>{rejectedCount}</CardTitle>
					</CardHeader>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>My Advertisements</CardTitle>
					<CardDescription>
						Search quickly and filter by moderation status.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div className="relative w-full md:max-w-sm">
							<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<input
								type="text"
								value={queryState.value}
								onChange={(event) => queryState.setValue(event.target.value)}
								placeholder="Search your ads..."
								className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm"
							/>
						</div>

						<div className="flex flex-wrap gap-2">
							{DASHBOARD_STATUSES.map((status) => (
								<Button
									key={status}
									type="button"
									variant={selectedStatus === status ? "default" : "outline"}
									size="sm"
									onClick={() => {
										if (status === "ALL") {
											removeParam("status")
											return
										}
										setParam("status", status)
									}}
								>
									{status}
								</Button>
							))}
						</div>
					</div>

					{filteredAds.length === 0 ? (
						<div className="rounded-lg border border-dashed p-8 text-center">
							<p className="text-sm text-muted-foreground">
								No ads found for current filters.
							</p>
							<Button className="mt-3" onClick={() => router.push("/ads/new")}>
								Create Your First Ad
							</Button>
						</div>
					) : (
						<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
							{filteredAds.map((ad) => (
								<MyAdCard key={ad.id} ad={{ ...ad, location: ad.location ?? undefined }} />
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
