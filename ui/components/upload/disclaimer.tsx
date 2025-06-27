import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

export function DisclaimerAlert({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>🚧 Upload Guidelines</AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            <p className="mb-3">
              <strong>What to upload:</strong>
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Clear photos of potholes and road damage</li>
              <li>Images that help identify the location and severity</li>
            </ul>

            <p className="mb-3">
              <strong>What not to upload:</strong>
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Inappropriate, violent, or offensive content</li>
              <li>Personal information (faces, license plates, addresses)</li>
              <li>Unrelated images or spam</li>
            </ul>

            <p className="mb-3">
              <strong>Privacy protection:</strong>
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Location data is automatically removed from your images</li>
              <li>Personal metadata is stripped before upload</li>
              <li>Your uploads are completely anonymous</li>
              <li>We cannot trace images back to you</li>
            </ul>

            <p className="text-sm text-muted-foreground">
              By uploading, you help improve road safety for everyone in the
              community.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setOpen(false);
              router.back();
            }}
          >
            Go back
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => setOpen(false)}>
            I understand and agree
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
