import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default function PublicHomePage() {
    return (
        <main className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-start justify-center gap-4 px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">Classified Marketplace</p>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                Buy, sell, and manage your listings with moderation-ready workflows.
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Browse active ads publicly, or sign in to post and manage your own listings.
            </p>
            <div className="flex items-center gap-3">
                <Button asChild>
                    <Link href="/search" prefetch={false}>Browse Ads</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/login" prefetch={false}>Login with Google</Link>
                </Button>
            </div>
        </main>
    );
}
