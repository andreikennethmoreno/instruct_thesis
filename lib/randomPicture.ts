import { useState } from 'react';

// Function to generate a random number for the image ID
const generateRandomId = (): string => {
  return Math.floor(Math.random() * 100).toString(); // Generate a random ID between 0 and 9999
};

const useRandomProfilePicture = (width: number = 200, height: number = 200): string => {
  const randomId = generateRandomId(); // Generate a random ID synchronously
  const imageUrl = `https://picsum.photos/id/${randomId}/${width}/${height}`; // Construct the URL with the random ID

  return imageUrl; // Return the image URL immediately
};

export default useRandomProfilePicture;
