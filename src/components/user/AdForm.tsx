"use client"

import {
  createAdvertisement,
  type CreateAdvertisementState,
} from "@/src/actions/ad.actions"
import { useFormStateHook } from "@/src/hooks/useFormStateHook"
import { useRouterHook } from "@/src/hooks/useRouter.Hook"
import { useStateHook } from "@/src/hooks/useStateHook"
import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { useEffect } from "react"

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
  const imagePath = useStateHook("")
  const { state, formAction, isPending } = useFormStateHook(
    createAdvertisement,
    initialState
  )

  useEffect(() => {
    if (state.success) {
      imagePath.reset()
      router.push("/dashboard")
      router.refresh()
    }
  }, [state.success, imagePath, router])

  const fieldErrors = state.error?.fieldErrors ?? {}

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
              <label htmlFor="images" className="text-sm font-medium">Primary Image Path</label>
              <input
                id="images"
                name="images"
                value={imagePath.value}
                onChange={(event) => imagePath.setValue(event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="/uploads/ads/1.jpg"
              />
              {fieldErrors.images?.[0] && (
                <p className="text-sm text-destructive">{fieldErrors.images[0]}</p>
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Create Ad"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}