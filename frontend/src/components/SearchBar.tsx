import { Search, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { API_URL } from "../constants"; 

interface SearchResultItem {
    nomeMedicamento: string;
    // Você pode adicionar outros campos se precisar, mas só usamos o nome aqui
}

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
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!value || value.length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/medicamento?search=${value}&per_page=5`);
                if (response.ok) {
                    const data = await response.json();
                    
                    // --- CORREÇÃO AQUI: Trocamos 'any' por 'SearchResultItem' ---
                    const names = data.itens.map((item: SearchResultItem) => item.nomeMedicamento);
                    
                    const uniqueNames = Array.from(new Set(names)) as string[];
                    
                    setSuggestions(uniqueNames);
                    setShowSuggestions(uniqueNames.length > 0);
                }
            } catch (error) {
                console.error("Erro no autocomplete:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (showSuggestions || value.length >= 2) {
               fetchSuggestions();
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
                selectSuggestion(suggestions[activeSuggestionIndex]);
                e.preventDefault();
            } else if (suggestions.length > 0 && showSuggestions) {
                selectSuggestion(suggestions[0]);
                e.preventDefault();
            }
            setShowSuggestions(false);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (activeSuggestionIndex > 0) {
                setActiveSuggestionIndex(activeSuggestionIndex - 1);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (activeSuggestionIndex < suggestions.length - 1) {
                setActiveSuggestionIndex(activeSuggestionIndex + 1);
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (suggestion: string) => {
        onChange(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setActiveSuggestionIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => value.length >= 2 && setShowSuggestions(true)}
                    className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
                />
                
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
                    ) : (
                        <Search className="w-5 h-5" />
                    )}
                </div>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-xl max-h-60 overflow-y-auto animate-fadeIn">
                    {suggestions.map((suggestion, index) => {
                        const matchIndex = suggestion.toLowerCase().indexOf(value.toLowerCase());
                        const isActive = index === activeSuggestionIndex;

                        return (
                            <li
                                key={index}
                                onClick={() => selectSuggestion(suggestion)}
                                className={`px-4 py-2 cursor-pointer text-sm transition-colors flex items-center justify-between ${
                                    isActive ? "bg-sky-50 text-sky-700 font-medium" : "hover:bg-gray-50 text-gray-700"
                                }`}
                            >
                                <span>
                                    {matchIndex >= 0 ? (
                                        <>
                                            {suggestion.substring(0, matchIndex)}
                                            <span className="font-bold text-gray-900">
                                                {suggestion.substring(matchIndex, matchIndex + value.length)}
                                            </span>
                                            {suggestion.substring(matchIndex + value.length)}
                                        </>
                                    ) : (
                                        suggestion
                                    )}
                                </span>
                                {isActive && <span className="text-[10px] text-sky-500 font-bold uppercase tracking-wide">Enter</span>}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};