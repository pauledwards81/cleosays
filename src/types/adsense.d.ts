
interface Window {
  adsbygoogle: any[];
}

// Define HTMLInsElement interface to properly extend HTMLElement
// with the correct properties for AdSense <ins> elements
interface HTMLInsElement extends HTMLElement {
  cite: string;
  dateTime: string;
}

declare namespace JSX {
  interface IntrinsicElements {
    ins: React.DetailedHTMLProps<React.HTMLAttributes<HTMLInsElement>, HTMLInsElement>;
  }
}
