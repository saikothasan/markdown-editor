import { MarkdownEditor } from "@/components/markdown-editor"
import { WelcomeDialog } from "@/components/welcome-dialog"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <WelcomeDialog />
      <MarkdownEditor />
    </main>
  )
}

