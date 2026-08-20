import { useState, useRef, useEffect } from "react";
import {
  IoCalendarOutline,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "./DatePicker.module.css";

const DatePicker = ({ name, value, onChange, placeholder }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const initialDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  const months = Array.from({ length: 12 }, (_, month) =>
    new Intl.DateTimeFormat(locale, { month: "long" }).format(
      new Date(2024, month, 1),
    ),
  );
  const weekdays = Array.from({ length: 7 }, (_, day) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      new Date(2024, 0, 7 + day),
    ),
  );
  const numberFormatter = new Intl.NumberFormat(locale, {
    useGrouping: false,
  });

  const currentYearActual = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYearActual - i);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const displayValue = value
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(`${value}T00:00:00`))
    : placeholder;

  const handleDayClick = (day) => {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    onChange({
      target: { name, value: formattedDate },
    });
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className={styles["date-picker-wrapper"]} ref={panelRef}>
      <button
        type="button"
        className={`${styles["trigger-input"]} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span
          className={value ? styles["value-text"] : styles["placeholder-text"]}
        >
          {displayValue}
        </span>
        <IoCalendarOutline className={styles["icon-right"]} />
      </button>

      {isOpen && (
        <div
          className={styles["calendar-panel"]}
          role="dialog"
          aria-label={t("auth-choose-date")}
        >
          {/* Header Controls */}
          <div className={styles["calendar-header"]}>
            <button
              type="button"
              onClick={handlePrevMonth}
              className={styles["nav-btn"]}
              aria-label={t("auth-previous-month")}
            >
              <IoChevronBack />
            </button>

            <div className={styles["select-group"]}>
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                className={styles["header-select"]}
              >
                {months.map((m, index) => (
                  <option key={m} value={index}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className={styles["header-select"]}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {numberFormatter.format(y)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className={styles["nav-btn"]}
              aria-label={t("auth-next-month")}
            >
              <IoChevronForward />
            </button>
          </div>

          <div className={styles["days-of-week"]}>
            {weekdays.map((d) => (
              <div key={d} className={styles["dow-item"]}>
                {d}
              </div>
            ))}
          </div>

          <div className={styles["days-grid"]}>
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className={styles["empty-slot"]}></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                value ===
                `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`${styles["day-btn"]} ${isSelected ? styles.selected : ""}`}
                >
                  {numberFormatter.format(day)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
