"use client";
import React, { useState } from "react";
import Moon from "../components/moon";
import styles from "./unlock.module.css";

const ERRORS = {
  wrong_pin: "That PIN didn't match. Check it and try again.",
  not_configured: "No PIN is set on the server yet. Add APP_PIN to the environment variables.",
  network: "Couldn't reach the server. Check your connection and try again.",
};

export default function Unlock() {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin.trim() || status === "checking") return;

    setStatus("checking");
    setError(null);

    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (response.ok) {
        setStatus("unlocked");
        window.location.replace("/");
        return;
      }

      const body = await response.json().catch(() => ({}));
      setError(ERRORS[body.error] || ERRORS.wrong_pin);
    } catch {
      setError(ERRORS.network);
    }

    setStatus("idle");
    setAttempt((n) => n + 1);
    setPin("");
  };

  const busy = status !== "idle";

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Moon size={36} className={styles.moon} />
        <h1 className={styles.title}>
          <span className={styles.titleAccent}>Lunar&apos;s</span> Color Plotter
        </h1>
        <p className={styles.lede}>Enter the PIN to open the plotter.</p>

        <label htmlFor="pin" className={styles.label}>
          PIN
        </label>
        <input
          key={attempt}
          id="pin"
          type="password"
          className={`${styles.input} ${error ? styles.invalid : ""}`}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          autoFocus
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "pin-error" : undefined}
          disabled={busy}
        />

        <p id="pin-error" className={styles.error} role="alert">
          {error}
        </p>

        <button type="submit" className={styles.button} disabled={busy || !pin.trim()}>
          {status === "checking" ? "Checking…" : status === "unlocked" ? "Opening…" : "Unlock"}
        </button>
      </form>
    </main>
  );
}
