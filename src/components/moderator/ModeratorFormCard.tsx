"use client"

import { type ModerationActionState } from "@/src/actions/moderation.actions"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { useFormStateHook } from "@/src/hooks/useFormStateHook"

type ModeratorFormCardProps = Readonly<{
	title: string
	description: string
	submitLabel: string
	namePlaceholder: string
	action: (formData: FormData) => Promise<ModerationActionState>
	parentOptions?: Array<{ id: string; name: string }>
}>

const initialState: ModerationActionState = {
	success: false,
}

export default function ModeratorFormCard({
	title,
	description,
	submitLabel,
	namePlaceholder,
	action,
	parentOptions,
}: ModeratorFormCardProps) {
	const wrappedAction = async (_prevState: ModerationActionState, formData: FormData) => {
		return action(formData)
	}

	const { state, formAction, isPending } = useFormStateHook(wrappedAction, initialState)

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="space-y-3">
					<div className="space-y-1">
						<label htmlFor="name" className="text-sm font-medium">Name</label>
						<input
							id="name"
							name="name"
							required
							placeholder={namePlaceholder}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
						/>
					</div>

					{parentOptions && (
						<div className="space-y-1">
							<label htmlFor="parentId" className="text-sm font-medium">Parent category (optional)</label>
							<select
								id="parentId"
								name="parentId"
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							>
								<option value="">No parent</option>
								{parentOptions.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>
						</div>
					)}

					<Button type="submit" disabled={isPending}>
						{isPending ? "Saving..." : submitLabel}
					</Button>
				</form>

				{state.message && (
					<p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
						{state.message}
					</p>
				)}

				{state.error && (
					<p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
						{state.error}
					</p>
				)}
			</CardContent>
		</Card>
	)
}
