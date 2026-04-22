import AdForm from "@/src/components/user/AdForm";
import { getAdvertisementFormOptions } from "@/src/actions/ad.actions";
import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function NewAdPage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	if (session.user.role === "MODERATOR") {
		redirect("/moderator");
	}

	if (session.user.role !== "USER") {
		redirect("/");
	}

	const { categoryOptions, locationOptions } = await getAdvertisementFormOptions();

	return (
		<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<AdForm categories={categoryOptions} locations={locationOptions} />
		</main>
	);
}
