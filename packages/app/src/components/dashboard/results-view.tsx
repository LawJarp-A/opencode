import { Icon } from "@opencode-ai/ui/icon"
import { Show } from "solid-js"

export interface ResultsViewProps {
    actionTitle: string
}

export function ResultsView(props: ResultsViewProps) {
    const renderContent = () => {
        switch (props.actionTitle) {
            case "Create a marketing campaign":
                return (
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-[#F2F2F7] rounded-xl p-5 border border-white/50">
                                <h3 class="font-medium text-[#1C1C1E] mb-2 flex items-center gap-2">
                                    <Icon name="arrow-up" size="small" /> Strategy
                                </h3>
                                <p class="text-[15px] text-[#48484A] leading-relaxed">
                                    Multi-channel visual storytelling campaign focusing on brand awareness and conversion.
                                </p>
                            </div>
                            <div class="bg-[#F2F2F7] rounded-xl p-5 border border-white/50">
                                <h3 class="font-medium text-[#1C1C1E] mb-2 flex items-center gap-2">
                                    <Icon name="speech-bubble" size="small" /> Audience
                                </h3>
                                <p class="text-[15px] text-[#48484A] leading-relaxed">
                                    Primary: Professionals 25-45.<br />Secondary: Tech enthusiasts.
                                </p>
                            </div>
                        </div>
                        <div class="bg-[#F2F2F7] rounded-xl p-6 border border-white/50">
                            <h3 class="font-medium text-[#1C1C1E] mb-4">Proposed Channels & Budget</h3>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between text-[15px]">
                                    <span class="text-[#48484A]">Instagram Ads</span>
                                    <span class="font-mono text-[#1C1C1E]">$5,000</span>
                                </div>
                                <div class="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
                                    <div class="bg-[#007AFF] h-full w-[60%] rounded-full" />
                                </div>
                                <div class="flex items-center justify-between text-[15px] mt-2">
                                    <span class="text-[#48484A]">LinkedIn Sponsored</span>
                                    <span class="font-mono text-[#1C1C1E]">$3,500</span>
                                </div>
                                <div class="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
                                    <div class="bg-[#5856D6] h-full w-[40%] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case "Do some analysis":
                return (
                    <div class="space-y-6">
                        <div class="bg-[#F2F2F7] rounded-xl p-6 border border-white/50">
                            <h3 class="font-medium text-[#1C1C1E] mb-2">Executive Summary</h3>
                            <p class="text-[15px] text-[#48484A] leading-relaxed">
                                Data analysis reveals a strong upward trend in Q3 user engagement, correlated with the recent feature release. Churn rates have stabilized at 2.4%.
                            </p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="bg-white rounded-xl p-5 border border-[#E5E5EA] shadow-sm text-center">
                                <div class="text-[13px] text-[#8E8E93] font-medium uppercase tracking-wide mb-1">Growth</div>
                                <div class="text-3xl font-semibold text-[#34C759]">+24%</div>
                            </div>
                            <div class="bg-white rounded-xl p-5 border border-[#E5E5EA] shadow-sm text-center">
                                <div class="text-[13px] text-[#8E8E93] font-medium uppercase tracking-wide mb-1">Retention</div>
                                <div class="text-3xl font-semibold text-[#007AFF]">88%</div>
                            </div>
                            <div class="bg-white rounded-xl p-5 border border-[#E5E5EA] shadow-sm text-center">
                                <div class="text-[13px] text-[#8E8E93] font-medium uppercase tracking-wide mb-1">LTV</div>
                                <div class="text-3xl font-semibold text-[#1C1C1E]">$420</div>
                            </div>
                        </div>
                    </div>
                )

            case "Simulate business Scenario":
                return (
                    <div class="space-y-6">
                        <div class="bg-white rounded-xl p-6 border border-[#E5E5EA] shadow-sm">
                            <h3 class="font-medium text-[#1C1C1E] mb-4">Scenario: Aggressive Expansion</h3>
                            <div class="space-y-4">
                                <div class="flex items-start gap-4">
                                    <div class="mt-1 size-2 rounded-full bg-[#FF9500]" />
                                    <div>
                                        <div class="text-[15px] font-medium text-[#1C1C1E]">Assumption: 20% Markup</div>
                                        <div class="text-[14px] text-[#8E8E93]">Impact: Sales volume decreases by 5% but margin increases by 12%.</div>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4">
                                    <div class="mt-1 size-2 rounded-full bg-[#AF52DE]" />
                                    <div>
                                        <div class="text-[15px] font-medium text-[#1C1C1E]">Assumption: New Market Entry</div>
                                        <div class="text-[14px] text-[#8E8E93]">Impact: CAC increases by 40% for the first 6 months.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-[#F2F2F7] rounded-xl p-5 text-center border border-white/50">
                            <div class="text-[14px] text-[#8E8E93] mb-2">Projected Net Outcome</div>
                            <div class="text-2xl font-medium text-[#1C1C1E]">Profitable by Q4 2026</div>
                        </div>
                    </div>
                )

            case "Prep for the day":
                return (
                    <div class="space-y-4">
                        <h3 class="font-medium text-[#1C1C1E]">Today's Priorities</h3>
                        <div class="space-y-2">
                            <div class="flex items-center gap-3 p-3 bg-white border border-[#E5E5EA] rounded-xl">
                                <div class="size-5 rounded-md border-2 border-[#E5E5EA]" />
                                <span class="text-[15px] text-[#1C1C1E]">Review Q4 Budget Proposal</span>
                                <span class="ml-auto text-xs font-mono bg-[#FF3B30]/10 text-[#FF3B30] px-2 py-0.5 rounded">URGENT</span>
                            </div>
                            <div class="flex items-center gap-3 p-3 bg-white border border-[#E5E5EA] rounded-xl">
                                <div class="size-5 rounded-md border-2 border-[#E5E5EA]" />
                                <span class="text-[15px] text-[#1C1C1E]">Client sync with Alpha Corp</span>
                                <span class="ml-auto text-xs font-mono bg-[#FF9500]/10 text-[#FF9500] px-2 py-0.5 rounded">10:00 AM</span>
                            </div>
                            <div class="flex items-center gap-3 p-3 bg-white border border-[#E5E5EA] rounded-xl">
                                <div class="size-5 rounded-md border-2 border-[#E5E5EA]" />
                                <span class="text-[15px] text-[#1C1C1E]">Deep work: Strategy Doc</span>
                                <span class="ml-auto text-xs font-mono bg-[#34C759]/10 text-[#34C759] px-2 py-0.5 rounded">2:00 PM</span>
                            </div>
                        </div>
                    </div>
                )

            case "Manage Products":
                return (
                    <div class="space-y-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-[#F2F2F7] rounded-xl p-5 border border-white/50">
                                <div class="text-3xl font-semibold text-[#1C1C1E] mb-1">12</div>
                                <div class="text-[14px] text-[#8E8E93]">Products needing attention</div>
                            </div>
                            <div class="bg-[#F2F2F7] rounded-xl p-5 border border-white/50">
                                <div class="text-3xl font-semibold text-[#34C759] mb-1">98%</div>
                                <div class="text-[14px] text-[#8E8E93]">Inventory Health</div>
                            </div>
                        </div>
                        <div class="bg-white rounded-xl overflow-hidden border border-[#E5E5EA]">
                            <div class="px-5 py-3 border-b border-[#E5E5EA] bg-[#FAFAFA] text-xs font-medium text-[#8E8E93] uppercase tracking-wider">Recommended Actions</div>
                            <div class="divide-y divide-[#E5E5EA]">
                                <div class="px-5 py-4 flex justify-between items-center hover:bg-[#F2F2F7] transition-colors">
                                    <span class="text-[15px] text-[#1C1C1E]">Restock "Pro Wireless" units</span>
                                    <button class="text-xs font-medium text-[#007AFF] hover:underline">Apply</button>
                                </div>
                                <div class="px-5 py-4 flex justify-between items-center hover:bg-[#F2F2F7] transition-colors">
                                    <span class="text-[15px] text-[#1C1C1E]">Update pricing for "Basic" tier</span>
                                    <button class="text-xs font-medium text-[#007AFF] hover:underline">Edit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case "Get on a call with us":
                return (
                    <div class="flex flex-col items-center py-6 text-center">
                        <div class="size-16 bg-[#34C759]/10 rounded-full flex items-center justify-center text-[#34C759] mb-6">
                            <Icon name="check-small" size="large" />
                        </div>
                        <h3 class="text-xl font-medium text-[#1C1C1E] mb-2">Call Scheduled Successfully</h3>
                        <p class="text-[15px] text-[#8E8E93] max-w-sm mx-auto mb-8">
                            A calendar invitation has been sent to your email. We look forward to speaking with you.
                        </p>
                        <div class="bg-[#F2F2F7] rounded-xl p-5 border border-white/50 w-full max-w-xs mx-auto">
                            <div class="flex items-center gap-3 mb-3">
                                <Icon name="checklist" size="small" class="text-[#8E8E93]" />
                                <span class="text-[15px] text-[#1C1C1E]">Tomorrow, Jan 15</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <Icon name="menu" size="small" class="text-[#8E8E93]" />
                                <span class="text-[15px] text-[#1C1C1E]">10:00 AM - 10:30 AM</span>
                            </div>
                        </div>
                    </div>
                )

            default:
                return (
                    <div class="text-center py-10">
                        <p class="text-[15px] text-[#8E8E93]">Results generated successfully.</p>
                    </div>
                )
        }
    }

    return renderContent()
}
