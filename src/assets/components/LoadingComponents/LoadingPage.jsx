import { useState, useEffect } from "react";

export default function LoadingPage() {
  const fullText = "Loading...";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-1/2 flex items-center justify-center">
      <h1 className="text-4xl font-bold">{displayText}</h1>
    </div>
  );
}

// Summary:
// 1. Gradually displays "Loading..." one character at a time.
// 2. Uses useState to track current text and useEffect with setInterval for timing.
// 3. Div height is half the screen height using Tailwind's h-1/2.
// 4. Automatically stops interval when full text is displayed.
