import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterDropdownProps {
  label: string
  placeholder?: string
}

export function FilterDropdown({ label, placeholder = "Select..." }: FilterDropdownProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
