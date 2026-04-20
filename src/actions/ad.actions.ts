"use server"
export async function createdAd(formData: FormData){
    const session = await getServerSession (authOptions);

    if (!session?.user){
        throw new Error("Unathorize");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.)
}