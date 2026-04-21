"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function useSearchParamsHook() {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()

	const getParam = (key: string) => searchParams.get(key)

	const setParam = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set(key, value)
		router.replace(`${pathname}?${params.toString()}`)
	}

	const removeParam = (key: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.delete(key)
		const query = params.toString()
		router.replace(query ? `${pathname}?${query}` : pathname)
	}

	return {
		pathname,
		searchParams,
		getParam,
		setParam,
		removeParam,
	}
}
