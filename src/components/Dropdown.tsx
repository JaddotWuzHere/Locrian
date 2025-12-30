// src/components/Dropdown.tsx
import { useState, useRef, useEffect } from "react"
import type { KeyboardEvent, MouseEvent } from "react"

export type DropdownOption = {
  value: string
  label: string
}

type DropdownProps = {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  placeholder?: string
  className?: string
}

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)

  const rootRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)

  const selectedIndex = options.findIndex((opt) => opt.value === value)
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | MouseEventInit | any) {
      if (!rootRef.current) return
      if (rootRef.current.contains(e.target as Node)) return
      setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside as any)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any)
    }
  }, [isOpen])

  function openMenu() {
    if (options.length === 0) return
    setIsOpen(true)
    if (selectedIndex >= 0) {
      setHighlightedIndex(selectedIndex)
    } else {
      setHighlightedIndex(0)
    }
  }

  function closeMenu() {
    setIsOpen(false)
    setHighlightedIndex(null)
  }

  function handleToggle() {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  function handleSelect(index: number) {
    const opt = options[index]
    if (!opt) return
    onChange(opt.value)
    closeMenu()
    if (buttonRef.current) {
      buttonRef.current.focus()
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement | HTMLUListElement>) {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        openMenu()
      }
      return
    }

    if (e.key === "Escape") {
      e.preventDefault()
      closeMenu()
      if (buttonRef.current) buttonRef.current.focus()
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => {
        const current = prev === null ? -1 : prev
        const next = current + 1
        return next >= options.length ? 0 : next
      })
      return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => {
        const current = prev === null ? 0 : prev
        const next = current - 1
        return next < 0 ? options.length - 1 : next
      })
      return
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (highlightedIndex !== null) {
        handleSelect(highlightedIndex)
      }
    }
  }

  return (
    <div
      ref={rootRef}
      className={`dropdown-root ${isOpen ? "dropdown-open" : ""}`}
    >
      <button
        type="button"
        ref={buttonRef}
        className={`dropdown-trigger ${className}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? "dropdown-label" : "dropdown-label dropdown-label-placeholder"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="dropdown-icon" aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          className="dropdown-menu"
          role="listbox"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          {options.map((opt, index) => {
            const isSelected = opt.value === value
            const isHighlighted = index === highlightedIndex
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={[
                  "dropdown-option",
                  isHighlighted ? "dropdown-option-highlighted" : "",
                  isSelected ? "dropdown-option-selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault()
                }}
                onClick={() => handleSelect(index)}
              >
                {opt.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
