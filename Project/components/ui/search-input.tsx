"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  iconClassName?: string;
  containerClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      type = "text",
      placeholder = "Tìm kiếm...",
      onSearch,
      iconClassName,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch((e.target as HTMLInputElement).value);
      }
    };

    return (
      <div className={cn("relative w-full", containerClassName)}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={cn("h-4 w-4 text-gray-400", iconClassName)} />
        </div>
        <Input
          type={type}
          className={cn("pl-10", className)}
          placeholder={placeholder}
          ref={ref}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
