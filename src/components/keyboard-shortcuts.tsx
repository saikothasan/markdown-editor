import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const shortcuts = [
  { keys: ["Ctrl", "S"], description: "Save document" },
  { keys: ["Ctrl", "E"], description: "Export document" },
  { keys: ["Ctrl", "I"], description: "Import document" },
  { keys: ["Ctrl", "C"], description: "Copy markdown" },
  { keys: ["Ctrl", "B"], description: "Bold text" },
  { keys: ["Ctrl", "I"], description: "Italic text" },
  { keys: ["Ctrl", "K"], description: "Insert link" },
  { keys: ["Ctrl", "/"], description: "Show keyboard shortcuts" },
]

export function KeyboardShortcuts() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Shortcut</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shortcuts.map((shortcut, index) => (
          <TableRow key={index}>
            <TableCell className="font-mono">{shortcut.keys.join(" + ")}</TableCell>
            <TableCell>{shortcut.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

