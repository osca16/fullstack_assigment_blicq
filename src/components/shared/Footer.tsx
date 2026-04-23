export default function Footer() {
	const year = new Date().getFullYear()

	return (
		<footer className="border-t bg-muted/40">
			<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
				<p>© {year} Sample Assigment Footer</p>
			</div>
		</footer>
	)
}
