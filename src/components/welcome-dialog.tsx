"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"

export function WelcomeDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hasShownWelcome = localStorage.getItem("hasShownWelcome")
    if (!hasShownWelcome) {
      setOpen(true)
      localStorage.setItem("hasShownWelcome", "true")
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Markdown Editor</DialogTitle>
          <DialogDescription>Start writing and previewing your markdown in real-time.</DialogDescription>
        </DialogHeader>
        <p>This editor supports standard Markdown syntax. Use the toolbar for quick formatting.</p>
        <div className="mt-4 flex items-center justify-between bg-primary/10 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <span className="font-medium">Join our community</span>
          </div>
          <a
            href="https://t.me/drkingbd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Telegram Channel
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}

