"use client";

import Link from "next/link";
import { useState } from "react";
import { aed, price } from "@/lib/demo-prices";

export type PickerDay = { date: string; day: string; num: string; open: boolean; ordered: boolean };

export default function OrderPicker({ childId, days }: { childId: string; days: PickerDay[] }) {
  const available = days.filter((d) => d.open && !d.ordered).map((d) => d.date);
  const [picked, setPicked] = useState<string[]>([]);
  const weekAvailable = available.length === 5;
  const wholeWeek = weekAvailable && picked.length === 5;
  const cost = price(picked.length, wholeWeek);

  const toggle = (date: string) =>
    setPicked((p) => (p.includes(date) ? p.filter((d) => d !== date) : [...p, date].sort()));

  return (
    <>
      <button
        type="button"
        className={`card week-card${wholeWeek ? " on" : ""}`}
        disabled={!weekAvailable}
        aria-pressed={wholeWeek}
        onClick={() => setPicked(wholeWeek ? [] : available)}
      >
        <span className="week-tag">Best value</span>
        <span className="week-text">
          <b>Whole week</b>
          <span>{weekAvailable ? "5 lunches · 16.80 each" : "Some days are already taken"}</span>
        </span>
        <span className="week-price">
          84 <small>AED</small>
        </span>
        <span className="week-check" aria-hidden="true">
          {wholeWeek ? "✓" : ""}
        </span>
      </button>

      <p className="or">or pick days · 18.90 AED each</p>
      <div className="days" role="group" aria-label="Days">
        {days.map((d) => {
          const on = picked.includes(d.date);
          const disabled = !d.open || d.ordered;
          return (
            <button
              key={d.date}
              type="button"
              className={`day${on ? " on" : ""}${d.ordered ? " taken" : ""}`}
              disabled={disabled}
              aria-pressed={on}
              onClick={() => toggle(d.date)}
            >
              <b>{d.day}</b>
              <span>{d.ordered ? "Ordered" : d.open ? d.num : "Closed"}</span>
            </button>
          );
        })}
      </div>
      <p className="note">Order by 6 pm the day before.</p>

      <div className="bottom-bar">
        {picked.length > 0 ? (
          <Link href={`/order/review?child=${childId}&days=${picked.join(",")}`} className="bar-button">
            <span>
              <span className="bar-count">{picked.length}</span>Review
            </span>
            <span>{aed(cost.total)}</span>
          </Link>
        ) : (
          <span className="bar-button bar-empty">Pick the whole week or some days</span>
        )}
      </div>
    </>
  );
}
