import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat().format(num);
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getContrastColor(hexColor: string): 'black' | 'white' {
  // Convert hex to RGB
  let r = 0, g = 0, b = 0;
  
  // 3 digits
  if (hexColor.length === 4) {
    r = parseInt(hexColor[1] + hexColor[1], 16);
    g = parseInt(hexColor[2] + hexColor[2], 16);
    b = parseInt(hexColor[3] + hexColor[3], 16);
  } 
  // 6 digits
  else if (hexColor.length === 7) {
    r = parseInt(hexColor.substring(1, 3), 16);
    g = parseInt(hexColor.substring(3, 5), 16);
    b = parseInt(hexColor.substring(5, 7), 16);
  }
  
  // Calculate YIQ ratio
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // Return black for bright colors, white for dark
  return yiq >= 128 ? 'black' : 'white';
}

export function getTailwindColor(colorName: string): string {
  switch (colorName) {
    case 'yellow-500':
      return 'rgb(234 179 8)';
    case 'blue-300':
      return 'rgb(147 197 253)';
    case 'orange-300':
      return 'rgb(253 186 116)';
    case 'gray-500':
      return 'rgb(107 114 128)';
    default:
      return 'rgb(107 114 128)';
  }
}

export function dataURItoBlob(dataURI: string) {
  // Convert base64/URLEncoded data component to raw binary data
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = decodeURIComponent(dataURI.split(',')[1]);
  }

  // Separate the MIME component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // Write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}
