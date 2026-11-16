"use client";

import Link from "next/link";
import { useState } from "react";
import { aed, price } from "@/lib/demo-prices";

export type PickerDay = { date: string; day: string; num: string; open: boolean };
export type PickerChild = { id: string; name: string; detail: string; taken: string[] };

export default function OrderPicker({
  kids,
  days,
  initial,
  weekLabel,
  meal,
}: {
  kids: PickerChild[];
  days: PickerDay[];
  initial: string[];
  weekLabel: string;
  meal: React.ReactNode;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [picked, setPicked] = useState<string[]>([]);
  const chosen = kids.filter((k) => selected.includes(k.id));

  const openDays = days.filter((d) => d.open).map((d) => d.date);
  // A day is only off-limits when every selected child already has a lunch that day.
  const takenByAll = (date: string) => chosen.length > 0 && chosen.every((k) => k.taken.includes(date));
  const takenBySome = (date: string) => chosen.filter((k) => k.taken.includes(date)).length;
  const available = openDays.filter((d) => !takenByAll(d));
  const weekAvailable = openDays.length === 5 && available.length === 5;
  const wholeWeek = weekAvailable && picked.length === 5;

  // Each child gets the picked days they don't already have, priced on their own.
  const perChild = chosen.map((k) => {
    const newDays = picked.filter((d) => !k.taken.includes(d));
    return { kid: k, days: newDays, cost: price(newDays.length, newDays.length === 5) };
  });
  const lunches = perChild.reduce((n, c) => n + c.days.length, 0);
  const total = perChild.reduce((n, c) => n + c.cost.total, 0);

  const toggleChild = (id: string) =>
    setSelected((s) => (s.includes(id) ? (s.length > 1 ? s.filter((x) => x !== id) : s) : [...s, id]));
  const toggleDay = (date: string) =>
    setPicked((p) => (p.includes(date) ? p.filter((d) => d !== date) : [...p, date].sort()));

  const names = chosen.map((k) => k.name);
  const title =
    names.length <= 1
      ? `Pick ${names[0] ?? "your child"}'s lunches`
      : `Pick lunches for ${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;

  return (
    <>
      <p className="eyebrow">Next week · {weekLabel}</p>
      <h1 className="page-title">{title}</h1>

      <fieldset className="who">
        <legend className="who-label">Who&apos;s it for?</legend>
        <div className="who-list">
          {kids.map((k) => {
            const on = selected.includes(k.id);
            return (
              <button
                key={k.id}
                type="button"
                className={`who-chip${on ? " on" : ""}`}
                aria-pressed={on}
                onClick={() => toggleChild(k.id)}
              >
                <span className="who-avatar">{on ? "✓" : k.name.slice(0, 1).toUpperCase()}</span>
                <span className="who-text">
                  <b>{k.name}</b>
                  <span>{k.detail}</span>
                </span>
              </button>
            );
          })}
          <Link href="/children?add=1" className="who-chip who-add">
            <span className="who-avatar">+</span>
            <span className="who-text">
              <b>Add child</b>
            </span>
          </Link>
        </div>
        {kids.length > 1 && <p className="who-hint">Tap to choose one child or several. They all get the same days.</p>}
      </fieldset>

      {meal}

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
          <span>
            {weekAvailable
              ? chosen.length > 1
                ? `5 lunches each · 16.80 each`
                : "5 lunches · 16.80 each"
              : "Some days are taken or closed"}
          </span>
        </span>
        <span className="week-price">
          84 <small>AED{chosen.length > 1 ? " each" : ""}</small>
        </span>
        <span className="week-check" aria-hidden="true">
          {wholeWeek ? "✓" : ""}
        </span>
      </button>

      <p className="or">or pick days · 18.90 AED each</p>
      <div className="days" role="group" aria-label="Days">
        {days.map((d) => {
          const on = picked.includes(d.date);
          const all = takenByAll(d.date);
          const some = takenBySome(d.date);
          return (
            <button
              key={d.date}
              type="button"
              className={`day${on ? " on" : ""}${all ? " taken" : ""}`}
              disabled={!d.open || all}
              aria-pressed={on}
              onClick={() => toggleDay(d.date)}
            >
              <b>{d.day}</b>
              <span>{all ? "Ordered" : !d.open ? "Closed" : some ? `${some} ordered` : d.num}</span>
            </button>
          );
        })}
      </div>
      <p className="note">Order by 6 pm the day before.</p>

      <div className="bottom-bar">
        {lunches > 0 ? (
          <Link
            href={`/order/review?children=${selected.join(",")}&days=${picked.join(",")}`}
            className="bar-button"
          >
            <span>
              <span className="bar-count">{lunches}</span>Review
            </span>
            <span>{aed(total)}</span>
          </Link>
        ) : (
          <span className="bar-button bar-empty">
            {picked.length > 0 ? "Those days are already ordered" : "Pick the whole week or some days"}
          </span>
        )}
      </div>
    </>
  );
}
