import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function GeneralMessageModal({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Bengaluru Live Pothole Map</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
          A <strong>community-powered</strong> platform to report potholes and damaged roads.
          <br/>
          Your photos and contributions could bring more accountability to local authorities and help them identify and fix issues faster — making roads safer for everyone.
          <br/>
          <br/>
          <strong>ANYONE</strong> can contribute:
          <br/>
          <br/>
          ✅ Snap a clear photo <br/>
✅ Follow simple upload guidelines <br/>
✅ Help build better, safer roads <br/>
<br/>
Let's use this platform wisely, keep it clean, and work together for smoother journeys.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setOpen(false)}>I understand</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
