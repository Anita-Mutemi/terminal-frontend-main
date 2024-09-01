import { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';

export function useScreenshot() {
  const captureRef = useRef(null); // Ref to be attached to the element to capture

  // Function to capture the screenshot
  const takeScreenshot = useCallback(
    () =>
      new Promise((resolve, reject) => {
        if (captureRef.current) {
          html2canvas(captureRef.current, { useCORS: true }) // useCORS for external images
            .then((canvas) => {
              canvas.toBlob((blob) => {
                resolve(blob); // Resolve the promise with the Blob object
              });
            })
            .catch(reject); // Reject the promise on error
        } else {
          reject('No ref attached to an element');
        }
      }),
    [],
  );

  // Return the ref, and the screenshot-taking function
  return [captureRef, takeScreenshot];
}
