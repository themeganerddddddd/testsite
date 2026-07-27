"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass =
  "mt-2 w-full border border-[var(--rule)] bg-[var(--paper)] px-3 py-2.5 font-ui";
const labelClass = "block font-ui text-sm font-semibold";
const textareaClass = `${inputClass} min-h-24`;

export function SubmissionForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [needsAnonymity, setNeedsAnonymity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/submit", {
      body: formData,
      method: "POST",
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error || "Please review the form and try again.");
      setSubmitting(false);
      return;
    }

    router.push(
      json.confirmationUrl ||
        `/submit/confirmation?ref=${json.referenceNumber}`,
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-7" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="trap">Leave this field blank</label>
        <input id="trap" name="trap" tabIndex={-1} />
      </div>

      <fieldset className="border-t thin-rule pt-6">
        <legend className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          Do you need to stay anonymous?
        </legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["yes", "Yes"],
            ["no", "No"],
          ].map(([value, label]) => (
            <label
              key={value}
              onClick={() => setNeedsAnonymity(value)}
              className={`border thin-rule bg-[var(--paper)] px-4 py-3 font-ui text-sm ${
                needsAnonymity === value
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : ""
              }`}
            >
              <input
                className="mr-2"
                name="needsAnonymity"
                type="radio"
                value={value}
                required
                checked={needsAnonymity === value}
                onChange={() => setNeedsAnonymity(value)}
                onInput={() => setNeedsAnonymity(value)}
              />
              {label}
            </label>
          ))}
        </div>

        {needsAnonymity === "yes" ? (
          <div className="mt-5 space-y-5">
            <p className="border-y thin-rule bg-[var(--paper)] py-4 text-lg leading-8">
              You do not have to give us your name, but you will have to provide
              some type of evidence of occupation, depending on circumstances.
            </p>
            <label className={labelClass}>
              Pseudonym
              <input
                className={inputClass}
                name="pseudonym"
                type="text"
                required
              />
              <span className="mt-2 block font-ui text-xs font-normal text-[var(--muted)]">
                If you wish, your real name may replace the pseudonym at a later
                date.
              </span>
            </label>
            <label className={labelClass}>
              Why might anonymity be required?
              <textarea
                className={textareaClass}
                name="anonymityReason"
                required
              />
            </label>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="border-t thin-rule pt-6">
        <legend className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          Submission type
        </legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["pitch", "Pitch an article"],
            ["draft", "Submit a draft"],
            ["confidential-info", "Share information confidentially"],
            ["response", "Respond to an existing article"],
          ].map(([value, label]) => (
            <label
              key={value}
              className="border thin-rule bg-[var(--paper)] p-4 font-ui text-sm"
            >
              <input
                className="mr-2"
                name="submissionType"
                type="radio"
                value={value}
                required
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          Name, optional
          <input className={inputClass} name="contributorName" type="text" />
        </label>
        <label className={labelClass}>
          Personal email
          <input
            className={inputClass}
            name="personalEmail"
            type="email"
            required
          />
        </label>
        <label className={labelClass}>
          Contact preference
          <select
            className={inputClass}
            name="contactPreference"
            defaultValue="email"
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="secure-follow-up">Signal or secure follow-up</option>
          </select>
        </label>
        <label className={labelClass}>
          Current or former role
          <select
            className={inputClass}
            name="currentOrFormerEmployee"
            required
          >
            <option value="">Choose one</option>
            <option value="current">Current employee</option>
            <option value="former">Former employee</option>
            <option value="contractor">Contractor or vendor</option>
            <option value="other-direct-role">Other direct role</option>
            <option value="not-applicable">Not applicable</option>
          </select>
        </label>
        <label className={labelClass}>
          Organization or institution
          <input className={inputClass} name="organization" type="text" />
        </label>
        <label className={labelClass}>
          General role
          <input
            className={inputClass}
            name="generalRole"
            type="text"
            required
          />
        </label>
      </div>

      <div className="space-y-8 border-t thin-rule pt-7">
        <label className={labelClass}>
          Proposed headline
          <input className={inputClass} name="proposedHeadline" type="text" />
        </label>

        <label className={labelClass}>
          Evidence availability
          <select className={inputClass} name="evidenceAvailability" required>
            <option value="">Choose one</option>
            <option value="none">No documents</option>
            <option value="describe">Can describe records</option>
            <option value="may-share-later">
              May be able to share records later
            </option>
          </select>
        </label>

        <label className={labelClass}>
          Submit your query or draft
          <textarea className={`${inputClass} min-h-32`} name="completeDraft" />
          <span className="mt-3 block font-ui text-xs font-normal text-[var(--muted)]">
            Recommended article length is 800-1,500 words. A shorter query is
            welcome if you want an editor to respond first.
          </span>
        </label>

        <label className={labelClass}>
          Additional context
          <textarea className={textareaClass} name="additionalContext" />
        </label>
      </div>

      <section className="border-t thin-rule pt-6">
        <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          Safety note
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7">
          <li>
            Do not use a workplace-managed device or workplace email when
            confidentiality is important.
          </li>
          <li>Do not upload information you are prohibited from possessing.</li>
          <li>
            Do not include customer, patient, student, or coworker personal
            information.
          </li>
          <li>Publius cannot promise absolute anonymity.</li>
          <li>Legal protections differ by role, location, and subject.</li>
          <li>
            Submitting information does not create an attorney-client
            relationship.
          </li>
          <li>Publius may decline a submission.</li>
        </ul>
      </section>

      <div className="space-y-3 border-t thin-rule pt-6 font-ui text-sm">
        <label className="block">
          <input
            className="mr-2"
            name="namedIndividualsImplicated"
            type="checkbox"
          />
          Named individuals are implicated.
        </label>
        <label className="block">
          <input
            className="mr-2"
            name="activeDisputeOrLitigation"
            type="checkbox"
          />
          Litigation or an employment dispute is active.
        </label>
        <label className="block">
          <input
            className="mr-2"
            name="notWorkDeviceAcknowledged"
            type="checkbox"
            required
          />
          I understand I should not use a workplace-managed device or workplace
          email when confidentiality is important.
        </label>
        <label className="block">
          <input
            className="mr-2"
            name="noPersonalDataAcknowledged"
            type="checkbox"
            required
          />
          I will not include customer, patient, student, or coworker personal
          information.
        </label>
        <label className="block">
          <input
            className="mr-2"
            name="privacyAcknowledged"
            type="checkbox"
            required
          />
          I understand Publius cannot promise absolute anonymity and that
          submitting information does not create an attorney-client
          relationship.
        </label>
      </div>

      {error ? (
        <p role="alert" className="font-ui text-sm text-[var(--error)]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="min-h-12 border border-[var(--foreground)] px-5 font-ui text-sm font-semibold uppercase tracking-[0.12em] hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        Submit your query or draft
      </button>
    </form>
  );
}
