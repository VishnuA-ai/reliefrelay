
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  subscribeToAuthChanges,
} from "@/lib/auth";
import {
  processVolunteerOffer,
} from "@/lib/offer-ai";
import {
  submitVolunteerOffer,
  getVolunteerOffers,
} from "@/lib/offers";
import {
  OFFER_TYPES,
  type OfferDraft,
  type VolunteerOffer,
  type InferenceSource,
} from "@/lib/offer-schema";

const emptyDraft: OfferDraft = {
  offerType: "other",
  description: "",
  availability: "",
  limitations: [],
  locationDescription: null,
};

export default function VolunteerPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [draft, setDraft] = useState<OfferDraft | null>(null);
  const [offers, setOffers] = useState<VolunteerOffer[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [inferenceSource, setInferenceSource] =
    useState<InferenceSource>("manual");

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setAuthReady(true);

      if (!currentUser) {
        router.replace("/login");
      }
    });

    return unsubscribe;
  }, [router]);

  async function refreshOffers(uid: string) {
    setLoadingOffers(true);

    try {
      const result = await getVolunteerOffers(uid);

      result.sort((a, b) => b.createdAt - a.createdAt);
      setOffers(result);
    } catch (err) {
      console.error("Offer loading failed:", err);
      setError("Could not load your offers.");
    } finally {
      setLoadingOffers(false);
    }
  }

  useEffect(() => {
    if (user?.uid) {
      refreshOffers(user.uid);
    }
  }, [user?.uid]);

  async function handleAIProcessing() {
    setError("");
    setNotice("");

    if (!message.trim()) {
      setError("Please describe what you can offer.");
      return;
    }

    setLoadingAI(true);
    setDraft(null);

    try {
      const result = await processVolunteerOffer(message);

      if (!result.success || !result.draft) {
        setError(
          result.error ||
          "AI processing failed. You can enter the offer manually."
        );

        setDraft({
          ...emptyDraft,
          description: message.trim(),
        });

        setInferenceSource("manual");
        return;
      }

      setDraft(result.draft);
      setInferenceSource(result.inferenceSource);
      setNotice("Offer structured. Review the details before submitting.");
    } catch (err) {
      console.error(err);
      setError("AI processing failed. Please complete the form manually.");

      setDraft({
        ...emptyDraft,
        description: message.trim(),
      });

      setInferenceSource("manual");
    } finally {
      setLoadingAI(false);
    }
  }

  function updateDraft<K extends keyof OfferDraft>(
    key: K,
    value: OfferDraft[K]
  ) {
    setDraft((previous) =>
      previous ? { ...previous, [key]: value } : previous
    );
  }

  async function handleSubmit() {
    if (!user || !draft) return;

    setError("");
    setNotice("");

    if (
      !draft.description.trim() ||
      !draft.availability.trim()
    ) {
      setError("Description and availability are required.");
      return;
    }

    setSaving(true);

    try {
      const id = await submitVolunteerOffer(
        user.uid,
        message.trim(),
        {
          ...draft,
          description: draft.description.trim(),
          availability: draft.availability.trim(),
          locationDescription:
            draft.locationDescription?.trim() || null,
        },
        inferenceSource,
        contact.trim() || null
      );

      setNotice(`Offer submitted successfully. Reference: ${id}`);
      setMessage("");
      setContact("");
      setDraft(null);
      setInferenceSource("manual");

      await refreshOffers(user.uid);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit offer. Check your connection and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!authReady || !user) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Checking authentication...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              ReliefRelay
            </h1>
            <p className="text-xs text-slate-400">
              Namma Idea · Volunteer Portal
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-300">
              Volunteer
            </p>
            <p className="max-w-48 truncate text-xs text-slate-500">
              {user.email}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Community response
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Every offer can make a difference.
            </h2>
            <p className="mt-3 text-slate-400">
              Tell us what resources, skills or help you
              can provide. Our AI will organize your offer
              for coordinator review.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <label className="mb-3 block font-semibold">
              What can you offer?
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={3000}
              rows={5}
              placeholder="Example: I have a pickup truck. I can deliver drinking water today afternoon. I cannot drive at night."
              className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white outline-none transition focus:border-emerald-500"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>Write naturally. Be specific.</span>
              <span>{message.length}/3000</span>
            </div>

            <button
              onClick={handleAIProcessing}
              disabled={loadingAI || !message.trim()}
              className="mt-5 w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingAI ? "Organizing your offer..." : "Structure with AI"}
            </button>

            <button
              onClick={() => {
                if (!message.trim()) {
                  setError("Describe your offer first.");
                  return;
                }

                setDraft({
                  ...emptyDraft,
                  description: message.trim(),
                });

                setInferenceSource("manual");
                setError("");
                setNotice("Manual entry enabled. Complete the offer details.");
              }}
              className="mt-3 w-full rounded-xl border border-slate-700 px-5 py-3 text-sm text-slate-300 hover:bg-slate-800"
            >
              Enter details manually
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {notice && (
            <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              {notice}
            </div>
          )}

          {draft && (
            <div className="mt-7 rounded-2xl border border-emerald-500/30 bg-slate-900 p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-bold">
                  Review your offer
                </h3>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-emerald-300">
                  {inferenceSource === "manual"
                    ? "Manual entry"
                    : `AI: ${inferenceSource}`}
                </span>
              </div>

              <label className="mb-2 block text-sm text-slate-400">
                Offer category
              </label>

              <select
                value={draft.offerType}
                onChange={(e) =>
                  updateDraft(
                    "offerType",
                    e.target.value as OfferDraft["offerType"]
                  )
                }
                className="mb-5 w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
              >
                {OFFER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>

              <label className="mb-2 block text-sm text-slate-400">
                Description
              </label>
              <textarea
                value={draft.description}
                onChange={(e) =>
                  updateDraft("description", e.target.value)
                }
                maxLength={1000}
                rows={3}
                className="mb-5 w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
              />

              <label className="mb-2 block text-sm text-slate-400">
                Availability
              </label>
              <input
                value={draft.availability}
                onChange={(e) =>
                  updateDraft("availability", e.target.value)
                }
                maxLength={200}
                placeholder="Example: Today, 2 PM – 6 PM"
                className="mb-5 w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
              />

              <label className="mb-2 block text-sm text-slate-400">
                Location description
              </label>
              <input
                value={draft.locationDescription ?? ""}
                onChange={(e) =>
                  updateDraft(
                    "locationDescription",
                    e.target.value || null
                  )
                }
                maxLength={200}
                placeholder="Area, town or pickup location"
                className="mb-5 w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
              />

              <label className="mb-2 block text-sm text-slate-400">
                Limitations (one per line)
              </label>
              <textarea
                value={draft.limitations.join("\n")}
                onChange={(e) =>
                  updateDraft(
                    "limitations",
                    e.target.value
                      .split("\n")
                      .filter((item) => item.length <= 200)
                      .slice(0, 20)
                  )
                }
                rows={3}
                placeholder="Cannot drive at night"
                className="mb-5 w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
              />

              <label className="mb-2 block text-sm text-slate-400">
                Contact details (optional)
              </label>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                maxLength={200}
                placeholder="Phone number or preferred contact"
                className="mb-5 w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
              />

              <p className="mb-4 text-xs leading-5 text-slate-400">
                Your offer will be submitted for human review.
                AI does not verify, approve or dispatch resources.
              </p>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
              >
                {saving ? "Submitting..." : "Confirm and submit offer"}
              </button>
            </div>
          )}
        </section>

        <aside>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">
                Your submissions
              </h3>
              <button
                onClick={() => refreshOffers(user.uid)}
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                Refresh
              </button>
            </div>

            {loadingOffers ? (
              <p className="mt-6 text-sm text-slate-400">
                Loading your offers...
              </p>
            ) : offers.length === 0 ? (
              <p className="mt-6 rounded-xl bg-slate-950 p-5 text-sm text-slate-400">
                You haven't submitted any offers yet.
                Your confirmed offers will appear here.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {offers.map((offer) => (
                  <article
                    key={offer.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="text-sm font-semibold capitalize">
                        {offer.offerType}
                      </span>

                      <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-300">
                        {offer.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-300">
                      {offer.description}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Availability: {offer.availability}
                    </p>

                    <p className="mt-3 text-xs text-slate-600">
                      Reference: {offer.id}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-semibold">How it works</h3>
            <ol className="mt-4 space-y-3 text-sm text-slate-400">
              <li>01. Describe your offer.</li>
              <li>02. AI organizes the information.</li>
              <li>03. You review and confirm.</li>
              <li>04. A coordinator reviews the submission.</li>
            </ol>
          </div>
        </aside>
      </div>
    </main>
  );
}
