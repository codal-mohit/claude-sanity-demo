"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button } from "@/components/ui";

/** Demo signup: confirms on the page, sends nothing anywhere. */
export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="flex flex-col gap-4 rounded-lg border border-accent bg-accent/10 p-8"
    >
      <h2 id="newsletter-heading" className="font-sans text-2xl font-semibold text-heading">
        Get 10% off your first order
      </h2>
      <p className="max-w-xl font-sans text-base leading-7 text-body">
        Join the list for new arrivals and members-only offers.
      </p>
      {submitted ? (
        <Alert title="You're on the list" tone="emphasis">
          Check your inbox for your discount code.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 font-sans text-sm text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:max-w-xs"
          />
          <Button type="submit">Subscribe</Button>
        </form>
      )}
    </section>
  );
}
