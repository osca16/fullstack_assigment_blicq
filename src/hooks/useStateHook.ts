"use client"

import { useState } from "react"

export function useStateHook<T>(initialValue: T) {
	const [value, setValue] = useState<T>(initialValue)

	const reset = () => setValue(initialValue)
	const toggle = () => {
		if (typeof value === "boolean") {
			setValue((current) => (!current) as T)
		}
	}

	return {
		value,
		setValue,
		reset,
		toggle,
	}
}
