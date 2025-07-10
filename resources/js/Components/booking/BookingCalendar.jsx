import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

export default function BookingCalendar({
  onDateTimeChange,
  bookedDates = [],
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handleDateClick = (day) => {
    const newSelectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (newSelectedDate < today) return;

    setSelectedDate(newSelectedDate);
    setSelectedTime(null);
    onDateTimeChange({ date: newSelectedDate, time: null });
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    onDateTimeChange({ date: selectedDate, time });
  };

  const changeMonth = (offset) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
    );
  };

  const monthName = currentDate.toLocaleString("id-ID", { month: "long" });
  const year = currentDate.getFullYear();
  const totalDays = daysInMonth(year, currentDate.getMonth());
  const startDay = firstDayOfMonth(year, currentDate.getMonth());

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startDay });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
          disabled={
            currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() === today.getMonth()
          }
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="font-semibold text-lg text-gray-800">
          {monthName} {year}
        </h3>
        <button
          onClick={() => changeMonth(1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="font-medium text-gray-400 pb-2">
            {day}
          </div>
        ))}
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          );
          const isPastDate = date < today;
          const isSelected = selectedDate?.getTime() === date.getTime();

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={isPastDate}
              className={`w-10 h-10 rounded-full transition-colors ${
                isSelected
                  ? "bg-teal-500 text-white font-semibold"
                  : isPastDate
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {timeSlots.map((time) => {
            const [hour, minute] = time.split(":").map(Number);
            const slotDateTime = new Date(selectedDate);
            slotDateTime.setHours(hour, minute, 0, 0);

            const isPast = slotDateTime < new Date();
            const isBooked = bookedDates.some(
              (booked) => new Date(booked).getTime() === slotDateTime.getTime()
            );

            return (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                disabled={isPast || isBooked}
                className={`p-2 border rounded-lg text-center font-medium transition-colors ${
                  selectedTime === time
                    ? "bg-teal-500 text-white border-teal-500"
                    : isPast || isBooked
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-600 hover:bg-teal-50"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
