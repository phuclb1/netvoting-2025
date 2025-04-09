import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandSeparator,
} from "@/components/ui/command";
import { Settings2, ChevronDownIcon, CheckIcon } from "lucide-react";
import { userRoles } from "@/lib/schemas/user";
import { cn } from "@/lib/utils";

interface SelectRoleProps {
  selectedRoles: string[];
  onRoleChange: (selectedRoles: string[]) => void;
}

const SelectRole: React.FC<SelectRoleProps> = ({
  selectedRoles,
  onRoleChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleRoleChange = (role: string, checked: boolean) => {
    onRoleChange(
      checked
        ? [...selectedRoles, role]
        : selectedRoles.filter((r) => r !== role)
    );
  };

  const handleClearAll = () => {
    onRoleChange([]);
  };

  return (
    <Popover onOpenChange={() => setOpen(!open)} open={open}>
      <PopoverTrigger asChild>
        <Button
          className="ml-auto hidden h-10 lg:flex"
          size="sm"
          variant="outline"
        >
          <Settings2 />
          Chọn quyền
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="p-0 bg-white border border-meta-9 w-[200px]"
      >
        <Command>
          <CommandList>
            <CommandEmpty>Không tìm thấy quyền.</CommandEmpty>
            <CommandGroup>
              {userRoles.map((role) => {
                const isSelected = selectedRoles.includes(role.value);
                return (
                  <CommandItem
                    className="flex items-center justify-between"
                    key={role.value}
                    onSelect={() => handleRoleChange(role.value, !isSelected)}
                  >
                    <span>{role.label}</span>
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {isSelected && <CheckIcon className="h-4 w-4" />}
                    </div>
                  </CommandItem>
                );
              })}
              <CommandSeparator />
            </CommandGroup>
          </CommandList>
          <>
            <CommandGroup>
              <div className="flex items-center justify-center w-full gap-2">
                <CommandItem
                  className="justify-center text-center text-primary rounded cursor-pointer hover:opacity-60"
                  onSelect={() => onRoleChange(userRoles.map((role) => role.value))}
                >
                  Chọn tất cả
                </CommandItem>
                <CommandItem
                  className="justify-center text-center text-primary rounded cursor-pointer hover:opacity-60"
                  onSelect={handleClearAll}
                >
                  Hủy chọn tất cả
                </CommandItem>
              </div>
            </CommandGroup>
            <CommandSeparator />
          </>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectRole;
