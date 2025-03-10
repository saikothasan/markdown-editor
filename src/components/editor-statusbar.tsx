"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditorStatusBarProps {
  wordCount: number
  charCount: number
  wordCountGoal: number
  onWordCountGoalChange: (goal: number) => void
}

export function EditorStatusBar({ wordCount, charCount, wordCountGoal, onWordCountGoalChange }: EditorStatusBarProps) {
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const progress = Math.min((wordCount / wordCountGoal) * 100, 100)

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 text-xs text-muted-foreground border-t">
      <div className="flex items-center gap-3">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={progress} className="w-32" />
        {isEditingGoal ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setIsEditingGoal(false)
            }}
          >
            <Input
              type="number"
              value={wordCountGoal}
              onChange={(e) => onWordCountGoalChange(Number(e.target.value))}
              className="w-16 h-6 text-xs"
              autoFocus
              onBlur={() => setIsEditingGoal(false)}
            />
          </form>
        ) : (
          <Label onClick={() => setIsEditingGoal(true)} className="cursor-pointer hover:underline">
            Goal: {wordCountGoal}
          </Label>
        )}
      </div>
    </div>
  )
}

