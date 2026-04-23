"use client"

import { useStateHook } from "@/hooks/useStateHook"

export function useModerationReviewHook() {
	const modeState = useStateHook<"approve" | "reject">("approve")

	return {
		mode: modeState.value,
		setApproveMode: () => modeState.setValue("approve"),
		setRejectMode: () => modeState.setValue("reject"),
	}
}
