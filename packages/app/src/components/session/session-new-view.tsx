import { Component } from "solid-js"
import { SessionStarterTiles } from "./session-starter-tiles"

interface NewSessionViewProps {
    worktree: string
    onWorktreeChange: (worktree: string) => void
    onTileSelect: (tile: string) => void
}

export const NewSessionView: Component<NewSessionViewProps> = (props) => {
    return (
        <div class="flex-1 flex flex-col w-full h-full overflow-y-auto bg-white">
            <SessionStarterTiles
                onSelect={props.onTileSelect}
            />
        </div>
    )
}
