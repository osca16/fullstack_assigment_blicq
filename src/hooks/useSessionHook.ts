"use client"

import { useSession } from "next-auth/react"

export function useSessionHook() {
	const { data, status, update } = useSession()

	return {
		session: data,
		status,
		update,
		isAuthenticated: status === "authenticated",
		isLoading: status === "loading",
	}
}
