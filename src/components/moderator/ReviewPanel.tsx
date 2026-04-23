"use client"

import { approveAdvertisements, rejectAdvertisements, type ModerationActionState } from "@/actions/moderation.actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffectHook } from "@/hooks/useEffectHook"
import { useFormStateHook } from "@/hooks/useFormStateHook"
import { useModerationReviewHook } from "@/hooks/useModerationReviewHook"
import { useRouterHook } from "@/hooks/useRouter.Hook"
import { useStateHook } from "@/hooks/useStateHook"

type ReviewPanelProps = Readonly<{
	adId: string
}>

const initialState: ModerationActionState = {
	success: false,
}

export default function ReviewPanel({ adId }: ReviewPanelProps) {
	const router = useRouterHook()
	const note = useStateHook("")
	const reason = useStateHook("")
	const { mode, setApproveMode, setRejectMode } = useModerationReviewHook()

	const {
		state: approveState,
		formAction: approveAction,
		isPending: isApprovePending,
	} = useFormStateHook(approveAdvertisements, initialState)

	const {
		state: rejectState,
		formAction: rejectAction,
		isPending: isRejectPending,
	} = useFormStateHook(rejectAdvertisements, initialState)

	useEffectHook(() => {
		if (approveState.success || rejectState.success) {
			router.refresh()
			router.push("/moderator/pending")
		}
	}, [approveState.success, rejectState.success, router])

	const isBusy = isApprovePending || isRejectPending
	const infoMessage = approveState.message ?? rejectState.message
	const errorMessage = approveState.error ?? rejectState.error

	return (
		<Card>
			<CardHeader>
				<CardTitle>Review Actions</CardTitle>
				<CardDescription>Approve with optional note or reject with mandatory reason.</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="flex gap-2">
					<Button
						type="button"
						variant={mode === "approve" ? "default" : "outline"}
						onClick={setApproveMode}
					>
						Approve
					</Button>
					<Button
						type="button"
						variant={mode === "reject" ? "destructive" : "outline"}
						onClick={setRejectMode}
					>
						Reject
					</Button>
				</div>

				{mode === "approve" ? (
					<form action={approveAction} className="space-y-3">
						<input type="hidden" name="adId" value={adId} />
						<div className="space-y-1">
							<label htmlFor="approve-note" className="text-sm font-medium">
								Approval note (optional)
							</label>
							<textarea
								id="approve-note"
								name="note"
								rows={4}
								value={note.value}
								onChange={(event) => note.setValue(event.target.value)}
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
								placeholder="Ad looks good. Approved for publication."
							/>
						</div>
						<Button type="submit" disabled={isBusy}>
							{isApprovePending ? "Approving..." : "Confirm Approval"}
						</Button>
					</form>
				) : (
					<form action={rejectAction} className="space-y-3">
						<input type="hidden" name="adId" value={adId} />
						<div className="space-y-1">
							<label htmlFor="reject-reason" className="text-sm font-medium">
								Rejection reason
							</label>
							<textarea
								id="reject-reason"
								name="reason"
								required
								rows={4}
								value={reason.value}
								onChange={(event) => reason.setValue(event.target.value)}
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
								placeholder="Please add clearer photos and a complete description."
							/>
						</div>
						<Button type="submit" variant="destructive" disabled={isBusy}>
							{isRejectPending ? "Rejecting..." : "Confirm Rejection"}
						</Button>
					</form>
				)}

				{infoMessage && (
					<p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
						{infoMessage}
					</p>
				)}

				{errorMessage && (
					<p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
						{errorMessage}
					</p>
				)}
			</CardContent>
		</Card>
	)
}
