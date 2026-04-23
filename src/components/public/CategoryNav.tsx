"use client"

import { useSearchParamsHook } from "@/hooks/useSearchParamsHook"
import { useRouterHook } from "@/hooks/useRouter.Hook"
import { Button } from "@/components/ui/button"

type Category = {
    id: string
    label: string
}

export default function CategoryNav({ categories }: { categories: Category[] }) {
	const { searchParams, pathname } = useSearchParamsHook()
	const { replace } = useRouterHook()
	
	const currentCategoryId = searchParams.get("categoryIds")

	const handleSelect = (categoryId: string | null) => {
		const params = new URLSearchParams(searchParams.toString())
		if (categoryId) {
			params.set("categoryIds", categoryId)
		} else {
			params.delete("categoryIds")
		}
		replace(`${pathname}?${params.toString()}`)
	}

	return (
		<div className="space-y-4">
			<h3 className="font-semibold text-lg tracking-tight">Categories</h3>
			<div className="flex flex-col space-y-1">
				<Button
					variant={!currentCategoryId ? "secondary" : "ghost"}
					className="justify-start font-medium"
					onClick={() => handleSelect(null)}
				>
					All Categories
				</Button>
				{categories.map((category) => (
					<Button
						key={category.id}
						variant={currentCategoryId === category.id ? "secondary" : "ghost"}
						className="justify-start font-normal"
						onClick={() => handleSelect(category.id)}
					>
						{category.label}
					</Button>
				))}
			</div>
		</div>
	)
}
