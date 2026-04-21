"use client"

import {
  createAdvertisement,
  type CreateAdvertisementState,
} from "@/src/actions/ad.actions"
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

export default function AdForm() {
  const router = useRouterHook()
  const selectedImageCount = useStateHook(0)
  const clientImageError = useStateHook("")
  const { state, formAction, isPending } = useFormStateHook(
    createAdvertisement,
    initialState
  )

  useEffectHook(() => {
    if (state.success) {
      selectedImageCount.reset()
      clientImageError.reset()
      router.push("/dashboard")
      router.refresh()
    }
  }, [state.success, selectedImageCount, clientImageError, router])

  const fieldErrors = state.error?.fieldErrors ?? {}

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? [])

    const hasInvalidType = files.some((file) => !ALLOWED_IMAGE_MIME_TYPES.has(file.type))
    if (hasInvalidType) {
      clientImageError.setValue("Only .png and .jpg/.jpeg files are allowed")
      selectedImageCount.setValue(0)
      event.currentTarget.value = ""
      return
    }

    const hasOversizedFile = files.some((file) => file.size > MAX_IMAGE_SIZE_BYTES)
    if (hasOversizedFile) {
      clientImageError.setValue("Each image must be 10MB or smaller")
      selectedImageCount.setValue(0)
      event.currentTarget.value = ""
      return
    }

    clientImageError.reset()
    selectedImageCount.setValue(files.length)
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
              <label htmlFor="categoryId" className="text-sm font-medium">Category ID</label>
              <input
                id="categoryId"
                name="categoryId"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="cat_cuid"
              />
              {fieldErrors.categoryId?.[0] && (
                <p className="text-sm text-destructive">{fieldErrors.categoryId[0]}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="locationId" className="text-sm font-medium">Location ID</label>
              <input
                id="locationId"
                name="locationId"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="loc_cuid"
              />
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
            <Button type="submit" disabled={isPending || Boolean(clientImageError.value)}>
              {isPending ? "Submitting..." : "Create Ad"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}