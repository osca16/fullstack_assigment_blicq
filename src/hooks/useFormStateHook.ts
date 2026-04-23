"use client"

import { useActionState } from "react"

type ActionHandler<TState> = (
	prevState: Awaited<TState>,
	formData: FormData
) => Promise<TState> | TState

export function useFormStateHook<TState>(
	action: ActionHandler<TState>,
	initialState: Awaited<TState>
) {
	const [state, formAction, isPending] = useActionState(action, initialState)

	return {
		state,
		formAction,
		isPending,
	}
}
