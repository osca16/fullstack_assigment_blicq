"use client"

import { createAdvertisement } from "@/src/actions/ad.actions"
import { AdvertisementFormOption, CreateAdvertisementState } from "@/src/types"
import { useFormStateHook } from "@/src/hooks/useFormStateHook"
import { useRouterHook } from "@/src/hooks/useRouter.Hook"
import { useStateHook } from "@/src/hooks/useStateHook"
import { useEffectHook } from "@/src/hooks/useEffectHook"
import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import Image from "next/image"
import { type ChangeEvent } from "react"

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg"])

const initialState: CreateAdvertisementState = {
  success: false,
  message: "",
  error: {
    formErrors: [],
    fieldErrors: {},
  },
}

type AdFormProps = Readonly<{
  categories?: AdvertisementFormOption[]
  locations?: AdvertisementFormOption[]
}>

type ImagePreview = {
  url: string
  name: string
}

export default function AdForm({ categories = [], locations = [] }: AdFormProps) {
  const router = useRouterHook()
  const selectedImageCount = useStateHook(0)
  const clientImageError = useStateHook("")
  const imagePreviews = useStateHook<ImagePreview[]>([])
  const { state, formAction, isPending } = useFormStateHook(
    createAdvertisement,
    initialState
  )

  // Destructure stable callback references so the effect dependency array
  // contains only primitives and stable functions — not whole hook objects
  // (which are new references every render and would cause an infinite loop).
  const { reset: resetImageCount } = selectedImageCount
  const { reset: resetImageError } = clientImageError
  const { value: currentPreviews, reset: resetPreviews } = imagePreviews

  useEffectHook(() => {
    if (state.success) {
      resetImageCount()
      resetImageError()
      // Cleanup object URLs to avoid memory leaks
      currentPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url)
      })
      resetPreviews()
      router.push("/dashboard")
      router.refresh()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success])

  const fieldErrors = state.error?.fieldErrors ?? {}

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? [])

    const hasInvalidType = files.some((file) => !ALLOWED_IMAGE_MIME_TYPES.has(file.type))
    if (hasInvalidType) {
      clientImageError.setValue("Only .png and .jpg/.jpeg files are allowed")
      selectedImageCount.setValue(0)
      imagePreviews.value.forEach((preview) => URL.revokeObjectURL(preview.url))
      imagePreviews.setValue([])
      event.currentTarget.value = ""
      return
    }

    const hasOversizedFile = files.some((file) => file.size > MAX_IMAGE_SIZE_BYTES)
    if (hasOversizedFile) {
      clientImageError.setValue("Each image must be 10MB or smaller")
      selectedImageCount.setValue(0)
      imagePreviews.value.forEach((preview) => URL.revokeObjectURL(preview.url))
      imagePreviews.setValue([])
      event.currentTarget.value = ""
      return
    }

    clientImageError.reset()
    selectedImageCount.setValue(files.length)

    // Create preview URLs for each image
    const newPreviews: ImagePreview[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }))
    imagePreviews.setValue(newPreviews)
  }

  function handleRemoveImage(indexToRemove: number) {
    const updatedPreviews = imagePreviews.value.filter((_, index) => index !== indexToRemove)
    // Revoke the URL of the removed image
    URL.revokeObjectURL(imagePreviews.value[indexToRemove].url)
    imagePreviews.setValue(updatedPreviews)
    selectedImageCount.setValue(updatedPreviews.length)

    // Clear the file input if no images remain
    const fileInput = document.getElementById("images") as HTMLInputElement
    if (fileInput && updatedPreviews.length === 0) {
      fileInput.value = ""
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Advertisement</CardTitle>
        <CardDescription>
          Fill in your ad details. After submission, it will be reviewed by a moderator.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <input
              id="title"
              name="title"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Used iPhone 14 Pro"
            />
            {fieldErrors.title?.[0] && (
              <p className="text-sm text-destructive">{fieldErrors.title[0]}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Device condition, accessories, and pickup details"
            />
            {fieldErrors.description?.[0] && (
              <p className="text-sm text-destructive">{fieldErrors.description[0]}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="price" className="text-sm font-medium">Price</label>
              <input
                id="price"
                name="price"
                required
                inputMode="decimal"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="250000.00"
              />
              {fieldErrors.price?.[0] && (
                <p className="text-sm text-destructive">{fieldErrors.price[0]}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="categoryId" className="text-sm font-medium">Category</label>
              <select
                id="categoryId"
                name="categoryId"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue=""
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              {fieldErrors.categoryId?.[0] && (
                <p className="text-sm text-destructive">{fieldErrors.categoryId[0]}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="locationId" className="text-sm font-medium">Location</label>
              <select
                id="locationId"
                name="locationId"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue=""
              >
                <option value="" disabled>Select a location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.label}
                  </option>
                ))}
              </select>
              {fieldErrors.locationId?.[0] && (
                <p className="text-sm text-destructive">{fieldErrors.locationId[0]}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="images" className="text-sm font-medium">Upload Images</label>
              <input
                id="images"
                name="images"
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                multiple
                onChange={handleImageChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Files are saved to your local path configured in ADVERTISEMENTS_SAVE_PATH_LOCAL.
                Each image must be .png or .jpg/.jpeg and up to 10MB.
                {selectedImageCount.value > 0 ? ` Selected: ${selectedImageCount.value}` : ""}
              </p>
              {(clientImageError.value || fieldErrors.images?.[0]) && (
                <p className="text-sm text-destructive">
                  {clientImageError.value || fieldErrors.images?.[0]}
                </p>
              )}
            </div>
          </div>

          {imagePreviews.value.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Image Previews</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {imagePreviews.value.map((preview, index) => (
                  <div
                    key={`${preview.name}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                  >
                    <Image
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                      title="Remove image"
                    >
                      <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                        Remove
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(categories.length === 0 || locations.length === 0) && (
            <p className="rounded-md border border-amber-300/50 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Categories and locations must be created by a moderator before posting ads.
            </p>
          )}

          {state.error?.formErrors?.[0] && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error.formErrors[0]}
            </p>
          )}

          {state.message && !state.error?.formErrors?.length && (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {state.message}
            </p>
          )}

          <CardFooter className="px-0 pb-0 pt-2">
            <Button
              type="submit"
              disabled={
                isPending ||
                Boolean(clientImageError.value) ||
                categories.length === 0 ||
                locations.length === 0
              }
            >
              {isPending ? "Submitting..." : "Create Ad"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}