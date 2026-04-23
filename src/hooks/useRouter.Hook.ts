"use client"

import { useRouter } from "next/navigation"

export function useRouterHook() {
	const router = useRouter()

	return {
		push: router.push,
		replace: router.replace,
		back: router.back,
		refresh: router.refresh,
		prefetch: router.prefetch,
	}
}
