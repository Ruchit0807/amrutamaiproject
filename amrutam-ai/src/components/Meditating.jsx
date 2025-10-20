export default function Meditating({ className = "w-80 h-80" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#4B3A2F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
        {/* Head */}
        <circle cx="100" cy="60" r="16" />
        {/* Torso */}
        <path d="M80 95 C90 85,110 85,120 95" />
        {/* Legs cross */}
        <path d="M60 140 C90 120,110 120,140 140" />
        <path d="M70 140 C95 130,105 130,130 140" />
        {/* Arms on knees */}
        <path d="M80 110 C70 120,65 130,70 140" />
        <path d="M120 110 C130 120,135 130,130 140" />
      </g>
      {/* Aura / leaves */}
      <g opacity="0.25">
        <circle cx="100" cy="100" r="70" fill="#BFCB6F" />
      </g>
      {/* Elements: Agni, Jal, Vayu */}
      <g>
        <path d="M25 55 C35 45,40 35,35 25 C45 35,50 50,40 60 Z" fill="#E07A5F" opacity="0.8" />
        <circle cx="165" cy="45" r="10" fill="#6CA6C1" opacity="0.8" />
        <path d="M160 150 q10 -10 20 0 q-10 10 -20 0 Z" fill="#A3BE8C" opacity="0.8" />
      </g>
    </svg>
  );
}
