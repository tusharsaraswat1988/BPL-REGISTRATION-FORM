import React, { useMemo, useRef } from 'react';
import { Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CLASS_DOB_LIMITS, validatePlayerDob } from '../utils/validation';

interface DateChooserFieldProps {
  label?: string;
  value: string; // 'YYYY-MM-DD'
  onChange: (dateStr: string) => void;
  studentClass: number;
  error?: string | null;
  required?: boolean;
}

const MONTH_NAMES = [
  { value: '01', name: '01 - Jan' },
  { value: '02', name: '02 - Feb' },
  { value: '03', name: '03 - Mar' },
  { value: '04', name: '04 - Apr' },
  { value: '05', name: '05 - May' },
  { value: '06', name: '06 - Jun' },
  { value: '07', name: '07 - Jul' },
  { value: '08', name: '08 - Aug' },
  { value: '09', name: '09 - Sep' },
  { value: '10', name: '10 - Oct' },
  { value: '11', name: '11 - Nov' },
  { value: '12', name: '12 - Dec' },
];

export const DateChooserField: React.FC<DateChooserFieldProps> = ({
  label = 'Date of Birth',
  value,
  onChange,
  studentClass,
  error,
  required = true,
}) => {
  const nativePickerRef = useRef<HTMLInputElement>(null);

  // Get allowed DOB range for the selected class
  const classLimits = CLASS_DOB_LIMITS[studentClass] || {
    minYear: 2008,
    maxYear: 2019,
    minDate: '2008-01-01',
    maxDate: '2019-12-31',
    standardAge: 10,
    allowedAgeRange: '8 to 16 Years',
  };

  // Generate allowed years in descending order (e.g. 2018, 2017, 2016, 2015, 2014)
  const allowedYears = useMemo(() => {
    const years: number[] = [];
    for (let y = classLimits.maxYear; y >= classLimits.minYear; y--) {
      years.push(y);
    }
    return years;
  }, [classLimits.minYear, classLimits.maxYear]);

  // Parse current value
  const parsed = useMemo(() => {
    if (!value || typeof value !== 'string') return { day: '', month: '', year: '' };
    const parts = value.split('-');
    if (parts.length === 3) {
      return {
        year: parts[0] || '',
        month: parts[1] || '',
        day: parts[2] || '',
      };
    }
    return { day: '', month: '', year: '' };
  }, [value]);

  // Calculate days in selected month & year
  const daysInMonth = useMemo(() => {
    const y = parseInt(parsed.year, 10) || 2016;
    const m = parseInt(parsed.month, 10) || 1;
    return new Date(y, m, 0).getDate();
  }, [parsed.year, parsed.month]);

  const daysList = useMemo(() => {
    const list: string[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      list.push(String(d).padStart(2, '0'));
    }
    return list;
  }, [daysInMonth]);

  // Handle individual dropdown changes
  const handlePartChange = (type: 'day' | 'month' | 'year', newVal: string) => {
    let year = parsed.year;
    let month = parsed.month;
    let day = parsed.day;

    if (type === 'year') year = newVal;
    if (type === 'month') month = newVal;
    if (type === 'day') day = newVal;

    // Default missing parts to sensible values when user starts picking
    if (!year) year = String(allowedYears[0] || classLimits.maxYear);
    if (!month) month = '01';
    if (!day) day = '15';

    // Clamp day if month changed (e.g. Feb 31 -> Feb 28)
    const yNum = parseInt(year, 10);
    const mNum = parseInt(month, 10);
    const maxDays = new Date(yNum, mNum, 0).getDate();
    if (parseInt(day, 10) > maxDays) {
      day = String(maxDays).padStart(2, '0');
    }

    const newDateStr = `${year}-${month}-${day}`;
    onChange(newDateStr);
  };

  // DOB validation check
  const dobValidation = useMemo(() => {
    if (!value) return null;
    return validatePlayerDob(value, studentClass);
  }, [value, studentClass]);

  const displayError = error || (dobValidation && !dobValidation.valid ? dobValidation.error : null);

  const openNativePicker = () => {
    if (nativePickerRef.current) {
      try {
        if ('showPicker' in HTMLInputElement.prototype) {
          nativePickerRef.current.showPicker();
        } else {
          nativePickerRef.current.focus();
        }
      } catch {
        nativePickerRef.current.focus();
      }
    }
  };

  return (
    <div className="space-y-1.5">
      {/* Label and Allowed Range */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-[#FFB800]">*</span>}
        </label>
        <span className="text-[10px] text-[#FFB800] font-mono-sport bg-[#FFB800]/10 border border-[#FFB800]/25 px-2 py-0.5 rounded">
          Class {studentClass}: {classLimits.minYear}–{classLimits.maxYear}
        </span>
      </div>

      {/* Date Selector Group: 3 Dropdowns (Day / Month / Year) + Calendar Picker Button */}
      <div className="relative">
        <div className="grid grid-cols-12 gap-1.5 sm:gap-2">
          {/* 1. Day Selector (3 Cols) */}
          <div className="col-span-3 sm:col-span-3">
            <select
              value={parsed.day}
              onChange={e => handlePartChange('day', e.target.value)}
              className={`w-full px-2.5 py-2.5 bg-[#070D24] border rounded-xl text-xs sm:text-sm text-white focus:outline-none cursor-pointer transition-all ${
                displayError ? 'border-red-500' : 'border-[#1A2C68] focus:border-[#FFB800]'
              }`}
            >
              <option value="" disabled>Day</option>
              {daysList.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Month Selector (5 Cols) */}
          <div className="col-span-5 sm:col-span-5">
            <select
              value={parsed.month}
              onChange={e => handlePartChange('month', e.target.value)}
              className={`w-full px-2.5 py-2.5 bg-[#070D24] border rounded-xl text-xs sm:text-sm text-white focus:outline-none cursor-pointer transition-all ${
                displayError ? 'border-red-500' : 'border-[#1A2C68] focus:border-[#FFB800]'
              }`}
            >
              <option value="" disabled>Month</option>
              {MONTH_NAMES.map(m => (
                <option key={m.value} value={m.value}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Year Selector - STRICTLY CONSTRAINED TO ALLOWED CLASS YEARS (3 Cols) */}
          <div className="col-span-3 sm:col-span-3">
            <select
              value={parsed.year}
              onChange={e => handlePartChange('year', e.target.value)}
              className={`w-full px-2.5 py-2.5 bg-[#070D24] border rounded-xl text-xs sm:text-sm text-white focus:outline-none cursor-pointer font-mono font-semibold transition-all ${
                displayError ? 'border-red-500' : 'border-[#1A2C68] focus:border-[#FFB800]'
              }`}
            >
              <option value="" disabled>Year</option>
              {allowedYears.map(y => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Native Calendar Picker Toggle Button (1 Col) */}
          <div className="col-span-1 sm:col-span-1 flex items-center justify-center">
            <button
              type="button"
              onClick={openNativePicker}
              title="Open Calendar Date Picker"
              className="w-full h-full min-h-[38px] flex items-center justify-center bg-[#0B1538] hover:bg-[#1A2C68] text-slate-300 hover:text-[#FFB800] border border-[#1A2C68] rounded-xl transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
            </button>

            {/* Hidden native date input for calendar popover syncing */}
            <input
              ref={nativePickerRef}
              type="date"
              tabIndex={-1}
              min={classLimits.minDate}
              max={classLimits.maxDate}
              value={value || ''}
              onChange={e => {
                if (e.target.value) {
                  onChange(e.target.value);
                }
              }}
              className="sr-only"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Real-time Eligibility / Error Status */}
      {displayError ? (
        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{displayError}</span>
        </p>
      ) : value && dobValidation?.valid ? (
        <div className="flex items-center justify-between text-[11px] text-emerald-400 mt-1">
          <span className="flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
            <span>Age: {dobValidation.age} Years (Eligible for Class {studentClass})</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {value}
          </span>
        </div>
      ) : (
        <p className="text-[10px] text-slate-500 mt-0.5">
          Select Day, Month, and Year (Strictly {classLimits.minYear}–{classLimits.maxYear} for Class {studentClass}).
        </p>
      )}
    </div>
  );
};
