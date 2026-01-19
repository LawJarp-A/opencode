import { createSignal } from "solid-js"
import { useDialog } from "@opencode-ai/ui/context/dialog"
import { Dialog } from "@opencode-ai/ui/dialog"
import { Button } from "@opencode-ai/ui/button"
import FileTree from "./file-tree"

interface DialogAttachFileProps {
    onSelect: (path: string) => void
    root?: string
}

export function DialogAttachFile(props: DialogAttachFileProps) {
    const dialog = useDialog()
    const [selectedPath, setSelectedPath] = createSignal<string | null>(null)

    const rootPath = props.root || "/"

    const handleFileClick = (file: { path: string }) => {
        setSelectedPath(file.path)
    }

    const handleConfirm = () => {
        const path = selectedPath()
        if (path) {
            props.onSelect(path)
            dialog.close()
        }
    }

    return (
        <Dialog title="Attach File" description="Select a file from your workspace to attach.">
            <div class="flex flex-col gap-4 h-[400px]">
                <div class="flex-1 overflow-y-auto border border-border-base rounded-md p-2">
                    <FileTree
                        path={rootPath}
                        onFileClick={handleFileClick}
                        nodeClass={selectedPath() ? (node) => node.path === selectedPath() ? "bg-surface-selected" : "" : undefined}
                    />
                </div>
                <div class="flex items-center justify-between">
                    <div class="text-xs text-text-muted truncate max-w-[300px]">
                        {selectedPath() ?? "No file selected"}
                    </div>
                    <div class="flex gap-2">
                        <Button variant="ghost" onClick={() => dialog.close()}>Cancel</Button>
                        <Button variant="primary" disabled={!selectedPath()} onClick={handleConfirm}>Attach</Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
