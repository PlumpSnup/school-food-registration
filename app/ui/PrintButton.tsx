"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      className="btn btn-small btn-ghost no-print"
      onClick={() => {
        // Closed lists don't print, so open them all first.
        document.querySelectorAll("details").forEach((d) => (d.open = true));
        window.print();
      }}
    >
      Print lists
    </button>
  );
}
