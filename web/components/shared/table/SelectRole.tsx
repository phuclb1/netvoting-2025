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
    <Popover open={open} onOpenChange={() => setOpen(!open)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-10 lg:flex"
        >
          <Settings2 />
          Select Roles
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 bg-white border border-meta-9 w-[200px]"
        align="end"
      >
        <Command>
          <CommandList>
            <CommandEmpty>No roles found.</CommandEmpty>
            <CommandGroup>
              {userRoles.map((role) => {
                const isSelected = selectedRoles.includes(role);
                return (
                  <CommandItem
                    key={role}
                    onSelect={() => handleRoleChange(role, !isSelected)}
                    className="flex items-center justify-between"
                  >
                    <span>{role}</span>
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
                  onSelect={() => onRoleChange(userRoles)}
                  className="justify-center text-center text-primary rounded cursor-pointer hover:opacity-60"
                >
                  Select All
                </CommandItem>
                <CommandItem
                  onSelect={handleClearAll}
                  className="justify-center text-center text-primary rounded cursor-pointer hover:opacity-60"
                >
                  Clear All
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
