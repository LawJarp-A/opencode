import { For } from "solid-js"
import { AlertCard, type AlertCardProps } from "./alert-card"

export interface AlertSectionProps {
    alerts: AlertCardProps[]
}

export function AlertSection(props: AlertSectionProps) {
    return (
        <div class="mb-6">
            <h2 class="text-16-semibold text-text-strong mb-4">Needs Your Attention</h2>

            <div class="space-y-3">
                <For each={props.alerts}>
                    {(alert) => <AlertCard {...alert} />}
                </For>
            </div>
        </div>
    )
}
