"use client";

import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  InferenceMode,
} from "firebase/ai";

import { firebaseApp } from "./firebase";

const ai = getAI(firebaseApp, {
  backend: new GoogleAIBackend(),
});

export const reliefRelayModel = getGenerativeModel(ai, {
  mode: InferenceMode.PREFER_ON_DEVICE,
});

export async function initializeReliefRelayDeviceModel(
  onProgress?: (progress: number) => void
) {
  await reliefRelayModel.initializeDeviceModel(onProgress);
}
