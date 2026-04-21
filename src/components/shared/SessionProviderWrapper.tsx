"use client"

import { SessionProvider } from "next-auth/react"

type SessionProviderWrapperProps = Readonly<{
	children: React.ReactNode
}>

export default function SessionProviderWrapper({ children }: SessionProviderWrapperProps) {
	return <SessionProvider>{children}</SessionProvider>
}
