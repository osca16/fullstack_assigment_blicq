import { searchAdvertisements, getAdvertisementFormOptions } from "@/src/actions/ad.actions"
import SearchBar from "@/src/components/public/SearchBar"
import CategoryNav from "@/src/components/public/CategoryNav"
import AdCard from "@/src/components/public/AdCard"
import Header from "@/src/components/shared/Header"
import Footer from "@/src/components/shared/Footer"
import { SearchResultAd } from "@/src/types"

export default async function PublicSearchPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const params = await searchParams;

	const query = typeof params.query === "string" ? params.query : undefined;
	const minPrice = typeof params.minPrice === "string" ? Number(params.minPrice) : undefined;
	const maxPrice = typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined;

	let categoryIds: string[] | undefined = undefined;
	if (params.categoryIds) {
		categoryIds = Array.isArray(params.categoryIds) ? params.categoryIds : [params.categoryIds];
	}

	const locationId = typeof params.locationId === "string" ? params.locationId : undefined;

	const [ads, options] = await Promise.all([
		searchAdvertisements({ query, minPrice, maxPrice, categoryIds, locationId }),
		getAdvertisementFormOptions()
	]);

	return (
		<div className="min-h-screen flex flex-col">
			{/* Header with active state on Browse Ads */}
			<Header activePath="/search" />

			<main className="flex-1 container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-foreground">
						Marketplace
					</h1>
					<SearchBar />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					<aside className="lg:col-span-1">
						<div className="sticky top-24 rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
							<CategoryNav categories={options.categoryOptions} />
						</div>
					</aside>

					<div className="lg:col-span-3">
						{ads.length === 0 ? (
							<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 p-12 text-center">
								<h3 className="mt-4 text-xl font-semibold">No advertisements found</h3>
								<p className="mt-2 text-muted-foreground">
									Try adjusting your search or filters to find what you&apos;re looking for.
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
								{ads.map((ad: SearchResultAd) => (
									<AdCard key={ad.id} ad={{ ...ad, price: Number(ad.price) }} />
								))}
							</div>
						)}
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
