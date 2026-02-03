
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const CustomDatePicker = ({
    label,
    value,
    onChange,
    minDate,
    required = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync current month when value changes
    useEffect(() => {
        if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                setCurrentMonth(date);
            }
        }
    }, [value]);

    const daysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getDayOfWeek = (date) => {
        const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        // Adjust so Monday is 0 if desired, but native starts Sunday=0. Let's stick to Sunday=0.
        return day;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const isDateDisabled = (year, month, day) => {
        if (!minDate) return false;
        const checkDate = new Date(year, month, day);
        checkDate.setHours(0, 0, 0, 0);
        const minimum = new Date(minDate);
        minimum.setHours(0, 0, 0, 0);
        return checkDate < minimum;
    };

    const handleDateSelect = (day) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        if (isDateDisabled(year, month, day)) return;

        // Create date string in YYYY-MM-DD format manually to avoid timezone issues
        const selectedDate = new Date(year, month, day);
        const offset = selectedDate.getTimezoneOffset();
        const adjustedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
        const dateStr = adjustedDate.toISOString().split('T')[0];

        onChange({ target: { value: dateStr, name: label } }); // Mock event object for compatibility
        setIsOpen(false);
    };

    const renderCalendarDays = () => {
        const totalDays = daysInMonth(currentMonth);
        const startDay = getDayOfWeek(currentMonth); // 0-6 (Sun-Sat)
        const days = [];

        // Empty cells for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
        }

        // Days
        for (let i = 1; i <= totalDays; i++) {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            const disabled = isDateDisabled(year, month, i);

            // Check if this date is selected
            let isSelected = false;
            if (value) {
                const valDate = new Date(value);
                // Compare YYYY-MM-DD parts
                isSelected = valDate.getDate() === i &&
                    valDate.getMonth() === month &&
                    valDate.getFullYear() === year;
            }

            // Check if today
            const today = new Date();
            const isToday = today.getDate() === i &&
                today.getMonth() === month &&
                today.getFullYear() === year;

            days.push(
                <button
                    key={i}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDateSelect(i); }}
                    disabled={disabled}
                    className={`
                    h-8 w-8 rounded-full text-xs font-bold flex items-center justify-center transition-all relative
                    ${disabled ? 'text-slate-300 cursor-not-allowed blur-[1px]' : 'hover:bg-indigo-100 text-slate-700 cursor-pointer'}
                    ${isSelected ? 'bg-indigo-600 !text-white shadow-lg shadow-indigo-500/30' : ''}
                    ${!isSelected && isToday ? 'ring-1 ring-indigo-500 text-indigo-600' : ''}
                `}
                >
                    {i}
                </button>
            );
        }
        return days;
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{label}</label>}

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`
            w-full px-4 py-3 bg-white border rounded-xl text-slate-900 font-bold 
            flex items-center gap-3 cursor-pointer transition-all hover:bg-slate-50
            ${isOpen ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200'}
        `}
            >
                <Calendar className={`w-5 h-5 ${value ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className={value ? 'text-slate-900' : 'text-slate-400'}>
                    {value ? formatDate(value) : 'Select Date'}
                </span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-50 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-slate-100 w-[300px]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="font-bold text-slate-800">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                            <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Weekdays */}
                        <div className="grid grid-cols-7 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {renderCalendarDays()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDatePicker;
