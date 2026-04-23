"use client"

import { useCallback, useState } from "react"

/**
 * Thin wrapper around useState that adds `reset` and `toggle` helpers.
 *
 * `reset` and `toggle` are stabilised with useCallback so that their
 * references do not change between renders.  This means they are safe to
 * include in useEffect dependency arrays without causing infinite loops.
 */
export function useStateHook<T>(initialValue: T) {
	const [value, setValue] = useState<T>(initialValue)

	// Stable reference — will not cause dependents to re-run on every render.
	const reset = useCallback(() => setValue(initialValue), [initialValue])

	const toggle = useCallback(() => {
		if (typeof initialValue === "boolean") {
			setValue((current) => (!current) as T)
		}
	}, [initialValue])

	return {
		value,
		setValue,
		reset,
		toggle,
	}
}
