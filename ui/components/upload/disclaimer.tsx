import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

export function DisclaimerAlert({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const router = useRouter()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>🚧 Upload Responsibly</AlertDialogTitle>
          <AlertDialogDescription>
          Help keep our roads safe — this platform is built by the community, for the community.
<br />
Upload clear photos of potholes only.
<br />
No NSFW, offensive, violent, or unrelated content.
<br />
Avoid personal info (faces, license plates, house numbers, etc.).
<br />
👉 Use the platform wisely.
<br />
Your responsible uploads helps everyone.
<br /><br />
<strong>Note:</strong> <br />
<strong>All location data and personal metadata are automatically stripped from images before upload.</strong>
<br />
<strong>Your uploads remain completely anonymous - we cannot trace images back to you.</strong>
<br />
<strong>This platform ensures privacy while helping improve road safety.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setOpen(false)
            router.back()
          }}>I don't understand</AlertDialogCancel>
          <AlertDialogAction onClick={() => setOpen(false)}>I understand</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
