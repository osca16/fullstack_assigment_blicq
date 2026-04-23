"use client"

import { useSearchParamsHook } from "@/hooks/useSearchParamsHook"
import { useStateHook } from "@/hooks/useStateHook"
import { useRouterHook } from "@/hooks/useRouter.Hook"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
	const { searchParams, pathname } = useSearchParamsHook()
	const { replace } = useRouterHook()
	
	const queryState = useStateHook(searchParams.get("query") || "")
	const minPriceState = useStateHook(searchParams.get("minPrice") || "")
	const maxPriceState = useStateHook(searchParams.get("maxPrice") || "")

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		const params = new URLSearchParams(searchParams.toString())
		
		if (queryState.value) params.set("query", queryState.value)
		else params.delete("query")
		
		if (minPriceState.value) params.set("minPrice", minPriceState.value)
		else params.delete("minPrice")
		
		if (maxPriceState.value) params.set("maxPrice", maxPriceState.value)
		else params.delete("maxPrice")

		replace(`${pathname}?${params.toString()}`)
	}

	return (
		<form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border">
			<div className="flex-1 relative min-w-[200px]">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<input 
					type="text" 
					placeholder="Search for anything..." 
					className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					value={queryState.value}
					onChange={(e) => queryState.setValue(e.target.value)}
				/>
			</div>
			<div className="flex items-center gap-2">
				<input 
					type="number" 
					placeholder="Min Rs." 
					className="w-24 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					value={minPriceState.value}
					onChange={(e) => minPriceState.setValue(e.target.value)}
				/>
				<span className="text-muted-foreground">-</span>
				<input 
					type="number" 
					placeholder="Max Rs." 
					className="w-24 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					value={maxPriceState.value}
					onChange={(e) => maxPriceState.setValue(e.target.value)}
				/>
			</div>
			<Button type="submit">Search</Button>
		</form>
	)
}
