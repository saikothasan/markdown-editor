"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Sun, Moon, Code, Eye, Info, MessageCircle, Save, Download, Upload, Copy, Check, Menu } from "lucide-react"
import { marked } from "marked"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { EditorToolbar } from "./editor-toolbar"
import { EditorStatusBar } from "./editor-statusbar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { useHotkeys } from "react-hotkeys-hook"
import { KeyboardShortcuts } from "./keyboard-shortcuts"
import hljs from "highlight.js"
import "highlight.js/styles/github-dark.css"
import { useMediaQuery } from "@/hooks/use-media-query"

// Sample markdown content
const initialMarkdown = `# Welcome to Enhanced Markdown Editor

This editor now supports an extended set of features. Let's explore them!

## New Features

1. **Syntax Highlighting**: Code blocks are now beautifully highlighted.
2. **Table of Contents**: Automatically generated based on your headings.
3. **Image Upload**: Drag and drop images directly into the editor.
4. **Emoji Support**: Type ':' followed by the emoji name, like :smile:
5. **Math Equations**: Use LaTeX syntax between $$ delimiters.
6. **Keyboard Shortcuts**: Press Ctrl+/ to see all available shortcuts.
7. **Word Count Goal**: Set a goal and track your progress.
8. **Auto-save**: Your work is automatically saved every few seconds.
9. **Version History**: Access previous versions of your document.
10. **Export to PDF**: In addition to Markdown export.

## Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, ${name}! Welcome to the enhanced editor.\`;
}

console.log(greet('User'));
\`\`\`

## Math Equation

Here's a sample equation:

$$
E = mc^2
$$

## Image Example

![Example Image](/placeholder.svg?height=200&width=400)

## Task List

- [x] Implement basic Markdown support
- [x] Add syntax highlighting
- [ ] Implement collaborative editing
- [ ] Add more export options

Happy writing!
`

const parseMarkdown = (markdown: string) => {
  return marked(markdown, {
    gfm: true,
    breaks: true,
    highlight: (code, lang) => {
      const language = hljs.getLanguage(lang) ? lang : "plaintext"
      return hljs.highlight(code, { language }).value
    },
  })
}

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown)
  const [html, setHtml] = useState<string>("")
  const [viewMode, setViewMode] = useState<string>("preview")
  const { theme, setTheme } = useTheme()
  const [lineCount, setLineCount] = useState<number>(0)
  const [wordCount, setWordCount] = useState<number>(0)
  const [charCount, setCharCount] = useState<number>(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [currentLine, setCurrentLine] = useState<number>(1)
  const [currentColumn, setCurrentColumn] = useState<number>(1)
  const [wordCountGoal, setWordCountGoal] = useState<number>(500)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const { toast } = useToast()

  const updateCursorPosition = useCallback((textarea: HTMLTextAreaElement) => {
    const cursorPosition = textarea.selectionStart
    const text = textarea.value.substring(0, cursorPosition)
    const lines = text.split("\n")
    const currentLineNumber = lines.length
    const currentColumnNumber = lines[lines.length - 1].length + 1

    setCurrentLine(currentLineNumber)
    setCurrentColumn(currentColumnNumber)
  }, [])

  useEffect(() => {
    try {
      const parsedHtml = parseMarkdown(markdown)
      setHtml(parsedHtml)

      const lines = markdown.split("\n").length
      setLineCount(lines)

      const text = markdown.trim()
      setCharCount(text.length)
      setWordCount(text ? text.split(/\s+/).length : 0)

      // Auto-save
      const timeoutId = setTimeout(() => {
        localStorage.setItem("markdown-editor-content", markdown)
        toast({
          title: "Auto-saved",
          description: "Your content has been automatically saved.",
        })
      }, 5000)

      return () => clearTimeout(timeoutId)
    } catch (error) {
      console.error("Error parsing markdown:", error)
    }
  }, [markdown, toast])

  const handleMarkdownChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMarkdown(e.target.value)
      if (e.target) {
        updateCursorPosition(e.target)
      }
    },
    [updateCursorPosition],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      updateCursorPosition(e.currentTarget)

      if (e.key === "Tab") {
        e.preventDefault()
        const textarea = e.currentTarget
        const start = textarea.selectionStart
        const end = textarea.selectionEnd

        const newValue = textarea.value.substring(0, start) + "  " + textarea.value.substring(end)
        setMarkdown(newValue)

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2
        }, 0)
      }
    },
    [updateCursorPosition],
  )

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLTextAreaElement>) => {
      updateCursorPosition(e.currentTarget)
    },
    [updateCursorPosition],
  )

  const handleToolbarAction = useCallback((action: string, defaultText?: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const text = selectedText || defaultText || ""

    let newText = ""
    let cursorOffset = 0

    switch (action) {
      case "bold":
        newText = `**${text}**`
        cursorOffset = selectedText ? 0 : -2
        break
      case "italic":
        newText = `*${text}*`
        cursorOffset = selectedText ? 0 : -1
        break
      case "strikethrough":
        newText = `~~${text}~~`
        cursorOffset = selectedText ? 0 : -2
        break
      case "h1":
        newText = `# ${text}`
        cursorOffset = selectedText ? 0 : 0
        break
      case "h2":
        newText = `## ${text}`
        cursorOffset = selectedText ? 0 : 0
        break
      case "h3":
        newText = `### ${text}`
        cursorOffset = selectedText ? 0 : 0
        break
      case "ul":
        newText = `- ${text}`
        cursorOffset = selectedText ? 0 : 0
        break
      case "ol":
        newText = `1. ${text}`
        cursorOffset = selectedText ? 0 : 0
        break
      case "task":
        newText = `- [ ] ${text}`
        cursorOffset = selectedText ? 0 : 0
        break
      case "quote":
        newText = `> ${text}`
        cursorOffset = selectedText ? 0 : 0
        break
      case "code":
        newText = selectedText.includes("\n") ? `\`\`\`\n${text}\n\`\`\`` : `\`${text}\``
        cursorOffset = selectedText ? 0 : selectedText.includes("\n") ? -4 : -1
        break
      case "link":
        newText = `[${text}](url)`
        cursorOffset = -1
        break
      case "image":
        newText = `![${text}](url)`
        cursorOffset = -1
        break
      case "table":
        newText = `| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |`
        cursorOffset = 0
        break
      default:
        return
    }

    const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end)
    setMarkdown(newValue)

    setTimeout(() => {
      textarea.focus()
      const newPosition = start + newText.length + cursorOffset
      textarea.selectionStart = textarea.selectionEnd = newPosition
    }, 0)
  }, [])

  const handleSave = useCallback(() => {
    localStorage.setItem("markdown-editor-content", markdown)
    toast({
      title: "Saved",
      description: "Your content has been saved successfully.",
    })
  }, [markdown, toast])

  const handleExport = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Exported",
      description: "Your markdown file has been exported.",
    })
  }, [markdown, toast])

  const handleImport = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".md,.markdown,text/markdown"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setMarkdown(content)
          toast({
            title: "Imported",
            description: "Your markdown file has been imported successfully.",
          })
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [toast])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(markdown).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      toast({
        title: "Copied",
        description: "Markdown content copied to clipboard.",
      })
    })
  }, [markdown, toast])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLTextAreaElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const img = new Image()
          img.onload = () => {
            const imageMarkdown = `![${file.name}](${event.target?.result})`
            setMarkdown((prev) => prev + "\n\n" + imageMarkdown)
            toast({
              title: "Image Added",
              description: "The image has been added to your document.",
            })
          }
          img.src = event.target?.result as string
        }
        reader.readAsDataURL(file)
      }
    },
    [toast],
  )

  useHotkeys("ctrl+s", handleSave, [handleSave])
  useHotkeys("ctrl+e", handleExport, [handleExport])
  useHotkeys("ctrl+i", handleImport, [handleImport])
  useHotkeys("ctrl+c", handleCopy, [handleCopy])

  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground p-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          <div className="text-lg font-semibold">Enhanced Markdown Editor</div>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  aria-label="Toggle theme"
                  pressed={theme === "dark"}
                  onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
                  className="bg-primary-foreground/10 hover:bg-primary-foreground/20 data-[state=on]:bg-primary-foreground/20"
                >
                  {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">{theme === "dark" ? "Light mode" : "Dark mode"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-primary-foreground/10 hover:bg-primary-foreground/20">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Access additional features and information.</SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <Button variant="outline" size="sm" onClick={handleSave} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleImport} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopy} className="w-full">
                    {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <Info className="h-4 w-4 mr-2" />
                        About
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>About Enhanced Markdown Editor</DialogTitle>
                        <DialogDescription>
                          A feature-rich markdown editor with real-time preview, syntax highlighting, and more.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>This editor supports extended Markdown syntax and features:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Syntax highlighting for code blocks</li>
                          <li>LaTeX math equations</li>
                          <li>Image drag-and-drop</li>
                          <li>Auto-save and version history</li>
                          <li>Word count goals</li>
                          <li>Keyboard shortcuts</li>
                          <li>Export to PDF (coming soon)</li>
                        </ul>
                        <KeyboardShortcuts />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <a
                    href="https://t.me/drkingbd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <MessageCircle className="h-4 w-4 inline-block mr-2" />
                    Join Telegram Channel
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-primary-foreground/10 hover:bg-primary-foreground/20"
                  >
                    <Info className="h-4 w-4" />
                    <span className="sr-only">About</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>About Enhanced Markdown Editor</DialogTitle>
                    <DialogDescription>
                      A feature-rich markdown editor with real-time preview, syntax highlighting, and more.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>This editor supports extended Markdown syntax and features:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Syntax highlighting for code blocks</li>
                      <li>LaTeX math equations</li>
                      <li>Image drag-and-drop</li>
                      <li>Auto-save and version history</li>
                      <li>Word count goals</li>
                      <li>Keyboard shortcuts</li>
                      <li>Export to PDF (coming soon)</li>
                    </ul>
                    <KeyboardShortcuts />
                  </div>
                </DialogContent>
              </Dialog>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://t.me/drkingbd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-foreground/10 hover:bg-primary-foreground/20 p-2 rounded-md transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="sr-only">Join Telegram Channel</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Join our Telegram Channel</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </header>

      {/* Toolbar */}
      <EditorToolbar onAction={handleToolbarAction} />

      {/* View Mode Selector */}
      <div className="bg-muted/30 p-2 flex justify-between items-center border-b">
        {!isMobile && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {isCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
        )}
        <Tabs value={viewMode} onValueChange={setViewMode} className={isMobile ? "w-full" : "w-[200px]"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-1 text-xs">
              <Code className="h-3.5 w-3.5" />
              <span>Edit</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1 text-xs">
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Editor and Preview */}
      <div className={`flex flex-1 overflow-hidden ${isMobile ? "flex-col" : ""}`}>
        {/* Editor */}
        <div className={`flex-1 overflow-auto relative group ${isMobile && viewMode === "preview" ? "hidden" : ""}`}>
          <textarea
            ref={textareaRef}
            className="w-full h-full p-2 resize-none focus:outline-none bg-background text-foreground font-mono text-sm leading-6"
            value={markdown}
            onChange={handleMarkdownChange}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            spellCheck={false}
            style={{ lineHeight: "1.5rem" }}
          />
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md shadow-sm">
              Line {currentLine}, Column {currentColumn}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className={`flex-1 border-l overflow-auto bg-muted/10 ${isMobile && viewMode === "edit" ? "hidden" : ""}`}>
          <div
            className="prose dark:prose-invert max-w-none p-6 h-full overflow-auto animate-fade-in"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      {/* Status Bar */}
      <EditorStatusBar
        wordCount={wordCount}
        charCount={charCount}
        wordCountGoal={wordCountGoal}
        onWordCountGoalChange={setWordCountGoal}
      />
    </div>
  )
}

