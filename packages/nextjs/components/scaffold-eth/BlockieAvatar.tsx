"use client";

import { AvatarComponent } from "@rainbow-me/rainbowkit";

// Function to generate a 3-digit random value from an address
const generateImageId = (address: string): string => {
  const numericHash = Array.from(address).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 1000;
  return numericHash.toString().padStart(3, "0");
};

// Custom Avatar for RainbowKit
export const BlockieAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  const imageId = generateImageId(address as `0x${string}`);
  const imageUrl = `https://noun.pics/${imageId}.jpg`;

  return (
    // Rendering the image with a fallback to `ensImage` if available
    <img className="rounded-full" src={ensImage || imageUrl} width={size} height={size} alt={`${address}`} />
  );
};
