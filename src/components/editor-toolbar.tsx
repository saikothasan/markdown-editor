"use client"

import React from "react"

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  LinkIcon,
  ImageIcon,
  Strikethrough,
  Table,
  CheckSquare,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"

interface EditorToolbarProps {
  onAction: (action: string, defaultText?: string) => void
}

export function EditorToolbar({ onAction }: EditorToolbarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  const tools = [
    {
      group: "text",
      items: [
        { icon: <Bold size={18} />, action: "bold", tooltip: "Bold (Ctrl+B)", defaultText: "bold text" },
        { icon: <Italic size={18} />, action: "italic", tooltip: "Italic (Ctrl+I)", defaultText: "italic text" },
        {
          icon: <Strikethrough size={18} />,
          action: "strikethrough",
          tooltip: "Strikethrough",
          defaultText: "strikethrough text",
        },
      ],
    },
    {
      group: "headings",
      items: [
        { icon: <Heading1 size={18} />, action: "h1", tooltip: "Heading 1", defaultText: "Heading 1" },
        { icon: <Heading2 size={18} />, action: "h2", tooltip: "Heading 2", defaultText: "Heading 2" },
        { icon: <Heading3 size={18} />, action: "h3", tooltip: "Heading 3", defaultText: "Heading 3" },
      ],
    },
    {
      group: "lists",
      items: [
        { icon: <List size={18} />, action: "ul", tooltip: "Bullet List", defaultText: "List item" },
        { icon: <ListOrdered size={18} />, action: "ol", tooltip: "Numbered List", defaultText: "List item" },
        { icon: <CheckSquare size={18} />, action: "task", tooltip: "Task List", defaultText: "Task item" },
      ],
    },
    {
      group: "blocks",
      items: [
        { icon: <Quote size={18} />, action: "quote", tooltip: "Blockquote", defaultText: "Blockquote" },
        { icon: <Code size={18} />, action: "code", tooltip: "Code Block", defaultText: "Code" },
        { icon: <Table size={18} />, action: "table", tooltip: "Table", defaultText: "" },
      ],
    },
    {
      group: "links",
      items: [
        { icon: <LinkIcon size={18} />, action: "link", tooltip: "Link (Ctrl+K)", defaultText: "Link text" },
        { icon: <ImageIcon size={18} />, action: "image", tooltip: "Image", defaultText: "Image alt text" },
      ],
    },
  ]

  if (isMobile) {
    return (
      <div className="flex items-center p-1 overflow-x-auto bg-card border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Format <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {tools.map((group) => (
              <React.Fragment key={group.group}>
                <DropdownMenuLabel>{group.group}</DropdownMenuLabel>
                {group.items.map((item) => (
                  <DropdownMenuItem key={item.action} onSelect={() => onAction(item.action, item.defaultText)}>
                    {item.icon}
                    <span className="ml-2">{item.tooltip}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center p-1 overflow-x-auto bg-card border-b">
        {tools.map((group, groupIndex) => (
          <div key={group.group} className="flex items-center">
            {groupIndex > 0 && <Separator orientation="vertical" className="mx-1 h-8" />}
            <div className="flex items-center">
              {group.items.map((item) => (
                <Tooltip key={item.action}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-md"
                      onClick={() => onAction(item.action, item.defaultText)}
                    >
                      {item.icon}
                      <span className="sr-only">{item.tooltip}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">{item.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}

