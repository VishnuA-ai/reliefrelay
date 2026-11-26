"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import { auth } from "./firebase";

const COORDINATOR_UID = "HuYIdITFO1RwZ64zUXhawTbLIcI3";

export async function registerVolunteer(
  email: string,
  password: string
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  return credential.user;
}

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  return credential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthChanges(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}

export function isCoordinator(user: User | null): boolean {
  return user?.uid === COORDINATOR_UID;
}
