"use client"

import { useEffect, type DependencyList, type EffectCallback } from "react"

export function useEffectHook(effect: EffectCallback, deps?: DependencyList) {
	useEffect(effect, deps)
}
