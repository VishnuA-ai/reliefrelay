export type OfferType =
  | "transport"
  | "food"
  | "water"
  | "medical"
  | "shelter"
  | "supplies"
  | "volunteer"
  | "other";

export type OfferStatus =
  | "pending_review"
  | "reviewed"
  | "needs_details";

export type InferenceSource = "on-device" | "cloud" | "manual";

export interface VolunteerOffer {
  id: string;
  volunteerId: string;
  originalMessage: string;
  offerType: OfferType;
  description: string;
  availability: string;
  limitations: string[];
  locationDescription: string | null;
  contactDetails: string | null;
  inferenceSource: InferenceSource;
  status: OfferStatus;
  createdAt: number;
  updatedAt: number;
}

export interface OfferDraft {
  offerType: OfferType;
  description: string;
  availability: string;
  limitations: string[];
  locationDescription: string | null;
}

export const OFFER_TYPES: OfferType[] = [
  "transport",
  "food",
  "water",
  "medical",
  "shelter",
  "supplies",
  "volunteer",
  "other",
];

export function isOfferType(value: unknown): value is OfferType {
  return (
    typeof value === "string" &&
    OFFER_TYPES.includes(value as OfferType)
  );
}

export function validateOfferDraft(value: unknown): value is OfferDraft {
  if (typeof value !== "object" || value === null) return false;

  const draft = value as Record<string, unknown>;

  return (
    isOfferType(draft.offerType) &&
    typeof draft.description === "string" &&
    draft.description.trim().length > 0 &&
    draft.description.length <= 1000 &&
    typeof draft.availability === "string" &&
    draft.availability.length <= 200 &&
    Array.isArray(draft.limitations) &&
    draft.limitations.length <= 20 &&
    draft.limitations.every(
      (item) => typeof item === "string" && item.length <= 200
    ) &&
    (draft.locationDescription === null ||
      (typeof draft.locationDescription === "string" &&
        draft.locationDescription.length <= 200))
  );
}
