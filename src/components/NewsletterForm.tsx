"use client";

import { useState } from "react";

type State = "idle" | "loading" | "success" | "error";

export function NewsletterForm({
  align = "left",
  sourcePage = "homepage",
}: {
  align?: "left" | "center";
  sourcePage?: string;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<State>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    const response = await fetch("/api/newsletter", {
      body: JSON.stringify({ email, sourcePage }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    const json = await response.json();

    if (!response.ok) {
      setState("error");
      setMessage(json.error || "We could not add that email.");
      return;
    }

    setState("success");
    setMessage(json.message || "Thank you. You are on the Publius list.");
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`mt-6 max-w-xl ${align === "center" ? "mx-auto" : ""}`}
      noValidate
    >
      <label
        className={`block font-ui text-sm font-semibold ${
          align === "center" ? "text-center" : ""
        }`}
        htmlFor={`newsletter-${sourcePage}`}
      >
        Email address
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id={`newsletter-${sourcePage}`}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="min-h-12 flex-1 border border-[var(--rule)] bg-[var(--paper)] px-4 font-ui text-base"
          aria-describedby={`newsletter-note-${sourcePage}`}
        />
        <button
          type="submit"
          className="min-h-12 border border-[var(--foreground)] px-5 font-ui text-sm font-semibold uppercase tracking-[0.12em] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          disabled={state === "loading"}
        >
          Subscribe
        </button>
      </div>
      <p
        id={`newsletter-note-${sourcePage}`}
        className={`mt-3 text-sm text-[var(--muted)] ${
          align === "center" ? "text-center" : ""
        }`}
      >
        We store your email for Publius updates. No paid subscriptions,
        advertising trackers, or outbound newsletter sending are included in
        this first local release.
      </p>
      {message ? (
        <p
          role="status"
          className={`mt-3 font-ui text-sm ${state === "error" ? "text-[var(--error)]" : "text-[var(--success)]"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
