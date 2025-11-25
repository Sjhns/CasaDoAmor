import { Search } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (newValue: string) => void;
    placeholder?: string;
    className?: string;
}

export const SearchBar = ({
    value,
    onChange,
    placeholder = "Buscar...",
    className = "",
}: SearchBarProps) => {
    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
    );
};
