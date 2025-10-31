"use client"

import * as React from "react"
import { Check, ChevronDown, Search, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  userAgents,
  getUserAgentById,
  getDefaultUserAgent,
  getPopularUserAgents,
  userAgentCategories,
  type UserAgentCategory,
} from "@/lib/user-agents"

interface UserAgentSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function UserAgentSelect({
  value,
  onValueChange,
  className
}: UserAgentSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selectedUA = value ? getUserAgentById(value) : getDefaultUserAgent()

  const handleSelect = (uaId: string) => {
    onValueChange?.(uaId)
    setOpen(false)
  }

  // Group user agents by category
  const groupedUserAgents = React.useMemo(() => {
    const groups: Record<UserAgentCategory, typeof userAgents> = {
      'desktop-browsers': [],
      'mobile-browsers': [],
      'search-bots': [],
      'social-media-bots': [],
      'gaming-platforms': [],
      'special-devices': [],
      'tools-api': [],
    }

    userAgents.forEach(ua => {
      if (!groups[ua.category]) {
        groups[ua.category] = []
      }
      groups[ua.category].push(ua)
    })

    return groups
  }, [])

  // Filter user agents based on search
  const filteredUserAgents = React.useMemo(() => {
    if (!search) return groupedUserAgents

    const lowerSearch = search.toLowerCase()
    const filtered: typeof groupedUserAgents = {
      'desktop-browsers': [],
      'mobile-browsers': [],
      'search-bots': [],
      'social-media-bots': [],
      'gaming-platforms': [],
      'special-devices': [],
      'tools-api': [],
    }

    Object.entries(groupedUserAgents).forEach(([category, uas]) => {
      filtered[category as UserAgentCategory] = uas.filter(ua =>
        ua.label.toLowerCase().includes(lowerSearch)
      )
    })

    return filtered
  }, [search, groupedUserAgents])

  const popularUAs = React.useMemo(() => getPopularUserAgents(), [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-12 text-left font-normal",
            !selectedUA && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="text-lg">🌐</span>
            <div className="flex-1 truncate">
              <div className="text-sm font-medium truncate">{selectedUA?.label || "Select User-Agent"}</div>
              <div className="text-xs text-muted-foreground truncate">
                {selectedUA ? userAgentCategories[selectedUA.category].label : "Choose browser or bot"}
              </div>
            </div>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Search user agents..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {!search && popularUAs.length > 0 && (
              <CommandGroup heading={<div className="flex items-center gap-1"><Star className="h-3 w-3" /> Popular</div>}>
                {popularUAs.map((ua) => (
                  <CommandItem
                    key={ua.id}
                    value={ua.id}
                    onSelect={() => handleSelect(ua.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedUA?.id === ua.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{ua.label}</div>
                      <div className="text-xs text-muted-foreground truncate">{ua.userAgent}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {Object.entries(filteredUserAgents).map(([category, uas]) => {
              if (uas.length === 0) return null

              const categoryInfo = userAgentCategories[category as UserAgentCategory]

              return (
                <CommandGroup
                  key={category}
                  heading={
                    <div className="flex items-center gap-1">
                      <span>{categoryInfo.icon}</span>
                      <span>{categoryInfo.label}</span>
                    </div>
                  }
                >
                  {uas.map((ua) => (
                    <CommandItem
                      key={ua.id}
                      value={ua.id}
                      onSelect={() => handleSelect(ua.id)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedUA?.id === ua.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{ua.label}</div>
                        <div className="text-xs text-muted-foreground truncate">{ua.userAgent}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })}

            {search && Object.values(filteredUserAgents).every(uas => uas.length === 0) && (
              <CommandEmpty>No user agents found.</CommandEmpty>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
