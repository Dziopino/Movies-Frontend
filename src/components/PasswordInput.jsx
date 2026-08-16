import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({ id, value, onChange, required = true }) {

    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);

    const scrollToEnd = () => {
        const input = inputRef.current;

        if (!input) return;

        input.scrollLeft = input.scrollWidth;
    };

    const moveCaretToEnd = () => {
        const input = inputRef.current;

        if (!input) return;

        const end = input.value.length;

        input.focus();
        input.setSelectionRange(end, end);
        input.scrollLeft = input.scrollWidth;
    };

    const togglePassword = () => {
        setShowPassword((prev) => !prev);

        requestAnimationFrame(() => {
            moveCaretToEnd();
        });
    };

    const handleChange = (event) => {
        onChange(event);

        requestAnimationFrame(() => {
            scrollToEnd();
        });
    };

    useEffect(() => {
        if (value) {
            requestAnimationFrame(() => {
                scrollToEnd();
            });
        }
    }, [value]);

    return (
        <div className="position-relative">
            <input ref={inputRef} id={id} type={showPassword ? "text" : "password"} className="form-control form-control-lg" value={value} onChange={handleChange} required={required} autoComplete="current-password" style={{paddingRight: "3.5rem", overflow: "hidden", whiteSpace: "nowrap"}}/>

            <button type="button" className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-secondary p-2 border-0" style={{zIndex: 10, lineHeight: 1}} onMouseDown={(event) => {event.preventDefault();}} onClick={togglePassword} aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}>
                {showPassword ? (
                    <EyeOff size={18} />
                ) : (
                    <Eye size={18} />
                )}
            </button>
        </div>
    );
}

export default PasswordInput;