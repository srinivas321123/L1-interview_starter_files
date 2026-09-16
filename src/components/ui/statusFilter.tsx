import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_FILTER_OPTIONS } from "@/types/deployment";
import type { StatusFilterValue } from "@/types/deployment";

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}

const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  return (
    <Select
      value={value}
      onChange={(v) => {
        console.log("Selected:", v);
        onChange(v as StatusFilterValue);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_FILTER_OPTIONS.map((option) => (
          <SelectItem key={option} id={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;