import { redirect } from "next/navigation"
import { createCategory, getCategories } from "@/src/actions/moderation.actions"
import ModeratorFormCard from "@/src/components/moderator/ModeratorFormCard"
import Footer from "@/src/components/shared/Footer"
import Header from "@/src/components/shared/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { auth } from "@/src/lib/auth"

export default async function ModeratorCategoriesPage() {
	const session = await auth()

	if (!session?.user) {
		redirect("/login")
	}

	if (session.user.role !== "MODERATOR") {
		redirect("/")
	}

	const categories = await getCategories()

	return (
		<div className="min-h-screen bg-linear-to-b from-background via-emerald-50/20 to-background">
			<Header />
			<main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
				<ModeratorFormCard
					title="Create Category"
					description="Add parent or child categories used by ads and search filters."
					submitLabel="Create Category"
					namePlaceholder="Vehicles"
					action={createCategory}
					parentOptions={categories.map((category: { id: string; name: string }) => ({ id: category.id, name: category.name }))}
				/>

				<Card>
					<CardHeader>
						<CardTitle>Existing Categories</CardTitle>
						<CardDescription>Current category structure in your marketplace.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{categories.length === 0 ? (
							<p className="text-sm text-muted-foreground">No categories added yet.</p>
						) : (
							categories.map((category: { id: string; name: string; slug: string; parentId: string | null; children: any[] }) => (
								<div key={category.id} className="rounded-md border p-3">
									<p className="text-sm font-medium">{category.name}</p>
									<p className="text-xs text-muted-foreground">Slug: {category.slug}</p>
									{category.parentId && (
										<p className="text-xs text-muted-foreground">Child category</p>
									)}
									{category.children.length > 0 && (
										<p className="text-xs text-muted-foreground">Children: {category.children.length}</p>
									)}
								</div>
							))
						)}
					</CardContent>
				</Card>
			</main>
			<Footer />
		</div>
	)
}
