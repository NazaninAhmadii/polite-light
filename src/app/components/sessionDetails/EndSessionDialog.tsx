import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog'
import { Button } from '@/app/components/ui/button'

interface EndSessionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function EndSessionDialog({ isOpen, onClose, onConfirm }: EndSessionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End Session?</DialogTitle>
        </DialogHeader>
        <p className="text-gray-600 mb-6">
          Are you sure you want to end this session? Any unsaved progress will be lost.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            End Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 