"use client"

import * as React from "react"
import { userAgents, userAgentCategories, getUserAgentById } from "@/lib/user-agents"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface UserAgentSelectProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

const categoryIcons: Record<string, string> = {
  'popular': '⭐',
  'desktop-browsers': '💻',
  'mobile-browsers': '📱',
  'search-bots': '🤖',
  'social-crawlers': '📱',
  'gaming': '🎮',
  'tools': '🔧',
}

export function UserAgentSelectModern({ value, onValueChange, className }: UserAgentSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const selectedUA = getUserAgentById(value)

  const filteredAgents = React.useMemo(() => {
    if (!search) return userAgents
    const searchLower = search.toLowerCase()
    return userAgents.filter(
      (agent) =>
        agent.label.toLowerCase().includes(searchLower) ||
        agent.userAgent.toLowerCase().includes(searchLower) ||
        agent.category.toLowerCase().includes(searchLower)
    )
  }, [search])

  const groupedAgents = React.useMemo(() => {
    const groups: Record<string, typeof userAgents> = {}

    // Add popular first
    const popular = filteredAgents.filter(a => a.popular)
    if (popular.length > 0) {
      groups['popular'] = popular
    }

    // Then by category
    Object.keys(userAgentCategories).forEach(catId => {
      const agents = filteredAgents.filter(a => a.category === catId && !a.popular)
      if (agents.length > 0) {
        groups[catId] = agents
      }
    })

    return groups
  }, [filteredAgents])

  const getCategoryLabel = (categoryId: string) => {
    if (categoryId === 'popular') return 'Popular'
    return userAgentCategories[categoryId as keyof typeof userAgentCategories]?.label || categoryId
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-12 rounded-xl border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="text-lg">{categoryIcons[selectedUA?.category || 'desktop-browsers']}</span>
            <span className="truncate">{selectedUA?.label}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0 rounded-xl border-2" align="start">
        <div className="flex items-center border-b border-border px-3 py-2 bg-muted/50">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Search user agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setSearch("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2">
          {Object.entries(groupedAgents).length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No user agents found.
            </div>
          ) : (
            Object.entries(groupedAgents).map(([categoryId, agents]) => (
              <div key={categoryId} className="mb-4 last:mb-0">
                <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>{categoryIcons[categoryId]}</span>
                  <span>{getCategoryLabel(categoryId)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        onValueChange(agent.id)
                        setOpen(false)
                        setSearch("")
                      }}
                      className={cn(
                        "flex items-start gap-2 p-3 rounded-lg border-2 transition-all duration-200 text-left",
                        value === agent.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm"
                          : "border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-muted/50"
                      )}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{categoryIcons[agent.category]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{agent.label}</span>
                          {value === agent.id && (
                            <Check className="h-4 w-4 shrink-0 text-blue-600" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {agent.userAgent.slice(0, 40)}...
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
