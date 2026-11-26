
"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "./firebase";
import type {
  OfferDraft,
  OfferStatus,
  VolunteerOffer,
  InferenceSource,
} from "./offer-schema";

import { validateOfferDraft } from "./offer-schema";

const OFFERS_COLLECTION = "offers";

export async function submitVolunteerOffer(
  volunteerId: string,
  originalMessage: string,
  draft: OfferDraft,
  inferenceSource: InferenceSource,
  contactDetails: string | null = null
): Promise<string> {
  if (!volunteerId.trim()) {
    throw new Error("Volunteer authentication is required.");
  }

  if (!originalMessage.trim() || originalMessage.length > 3000) {
    throw new Error("Invalid volunteer message.");
  }

  if (!validateOfferDraft(draft)) {
    throw new Error("Invalid offer data.");
  }

  if (
    contactDetails !== null &&
    (typeof contactDetails !== "string" || contactDetails.length > 200)
  ) {
    throw new Error("Invalid contact details.");
  }

  const now = Date.now();
  const offerRef = doc(collection(db, OFFERS_COLLECTION));

  const offerData = {
    id: offerRef.id,
    volunteerId,
    originalMessage,
    ...draft,
    contactDetails,
    inferenceSource,
    status: "pending_review" as const,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(offerRef, offerData);

  return offerRef.id;
}

export async function getVolunteerOffers(
  volunteerId: string
): Promise<VolunteerOffer[]> {
  const offersQuery = query(
    collection(db, OFFERS_COLLECTION),
    where("volunteerId", "==", volunteerId)
  );

  const snapshot = await getDocs(offersQuery);

  return snapshot.docs.map((offerDoc) => ({
    ...offerDoc.data(),
    id: offerDoc.id,
  })) as VolunteerOffer[];
}

export async function getCoordinatorOffers(): Promise<VolunteerOffer[]> {
  const snapshot = await getDocs(
    collection(db, OFFERS_COLLECTION)
  );

  return snapshot.docs.map((offerDoc) => ({
    ...offerDoc.data(),
    id: offerDoc.id,
  })) as VolunteerOffer[];
}

export async function updateOfferReviewStatus(
  offerId: string,
  status: Extract<OfferStatus, "reviewed" | "needs_details">
): Promise<void> {
  const offerRef = doc(db, OFFERS_COLLECTION, offerId);
  const snapshot = await getDoc(offerRef);

  if (!snapshot.exists()) {
    throw new Error("Offer not found.");
  }

  if (snapshot.data().status !== "pending_review") {
    throw new Error("Only pending offers can be reviewed.");
  }

  await updateDoc(offerRef, {
    status,
    updatedAt: Date.now(),
  });
}
