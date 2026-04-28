const FLOAT_WORDS = ["ideas", "great work", "cities", "schedule", "nerds", "hackers"];
const LETTERS = ["a","m","t","o","i","e","s","r","n","l","h","d","y","p","c","f","g","u"];

export function PortraitIllustration({ size = 520 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size * 1.15,
        position: "relative",
        overflow: "hidden",
        borderRadius: 12,
        background: "oklch(62% 0.18 42)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 345"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id="bgPulse" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0%" stopColor="oklch(72% 0.18 50)" />
            <stop offset="55%" stopColor="oklch(62% 0.18 42)" />
            <stop offset="100%" stopColor="oklch(48% 0.16 32)" />
          </radialGradient>
          <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBF1DE" />
            <stop offset="100%" stopColor="#EDDCBC" />
          </linearGradient>
          <linearGradient id="paperEdge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="80%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
          </linearGradient>
          <filter id="grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.07 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <symbol id="page" viewBox="0 0 100 130">
            <rect x="0" y="0" width="100" height="130" rx="3" fill="url(#paperGrad)" />
            <rect x="0" y="0" width="100" height="130" rx="3" fill="url(#paperEdge)" />
            <path d="M 88 0 L 100 12 L 88 12 Z" fill="rgba(0,0,0,0.08)" />
            <g fill="#3D362E" opacity="0.75">
              <rect x="10" y="14" width="52" height="3" rx="1.5" />
              <rect x="10" y="24" width="78" height="2" rx="1" />
              <rect x="10" y="30" width="74" height="2" rx="1" />
              <rect x="10" y="36" width="80" height="2" rx="1" />
              <rect x="10" y="42" width="62" height="2" rx="1" />
              <rect x="10" y="52" width="78" height="2" rx="1" />
              <rect x="10" y="58" width="80" height="2" rx="1" />
              <rect x="10" y="64" width="58" height="2" rx="1" />
              <rect x="10" y="74" width="76" height="2" rx="1" />
              <rect x="10" y="80" width="80" height="2" rx="1" />
              <rect x="10" y="86" width="48" height="2" rx="1" />
              <rect x="10" y="96" width="80" height="2" rx="1" />
              <rect x="10" y="102" width="70" height="2" rx="1" />
              <rect x="10" y="108" width="78" height="2" rx="1" />
              <rect x="10" y="114" width="40" height="2" rx="1" />
            </g>
          </symbol>
        </defs>

        <rect width="300" height="345" fill="url(#bgPulse)">
          <animate attributeName="opacity" values="0.95;1;0.95" dur="6s" repeatCount="indefinite" />
        </rect>
        <rect width="300" height="345" filter="url(#grain)" opacity="0.5" />

        <ellipse cx="150" cy="172" rx="180" ry="110" fill="oklch(75% 0.16 55)" opacity="0.18">
          <animate attributeName="cx" values="120;180;120" dur="14s" repeatCount="indefinite" />
        </ellipse>

        <g transform="translate(220,172)">
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={i}
              cx="0"
              cy="0"
              r="40"
              fill="none"
              stroke="#FBE9D2"
              strokeOpacity="0.55"
              strokeWidth="1.3"
            >
              <animate attributeName="r" from="40" to="170" dur="4s" begin={`${i * 1}s`} repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" from="0.55" to="0" dur="4s" begin={`${i * 1}s`} repeatCount="indefinite" />
              <animate attributeName="stroke-width" from="1.6" to="0.4" dur="4s" begin={`${i * 1}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>

        <g transform="translate(40,108)">
          <g transform="translate(14,8) rotate(-9 50 65)" opacity="0.55">
            <use href="#page" width="100" height="130" />
          </g>
          <g transform="translate(7,4) rotate(-4 50 65)" opacity="0.78">
            <use href="#page" width="100" height="130" />
          </g>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-1.5; 0,0" dur="5s" repeatCount="indefinite" />
            <use href="#page" width="100" height="130" />
          </g>

          <g fill="#3D362E" fontFamily="Fraunces, Georgia, serif" fontSize="6" fontStyle="italic">
            {FLOAT_WORDS.map((word, i) => {
              const startX = 14 + (i % 3) * 22;
              const startY = 50 + (i % 2) * 18;
              const dur = 3.2 + (i % 3) * 0.4;
              const begin = i * 0.55;
              return (
                <text key={i} x={startX} y={startY} opacity="0">
                  {word}
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.6;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                  <animate attributeName="y" values={`${startY};${startY - 30}`} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                  <animate attributeName="x" values={`${startX};${startX + 14}`} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                </text>
              );
            })}
          </g>
        </g>

        <g fontFamily="JetBrains Mono, ui-monospace, monospace" fontSize="9" fontWeight="500" fill="#FBE9D2">
          {LETTERS.map((ch, i) => {
            const dur = 2.4 + (i % 5) * 0.4;
            const begin = (i * 0.18) % 4;
            const startX = 130 + (i % 4) * 4;
            const startY = 130 + ((i * 13) % 70);
            const arc = 14 - (i % 5) * 4;
            const midX = (startX + 210) / 2;
            const midY = startY + arc;
            const endX = 215 + ((i * 7) % 14) - 7;
            const endY = 165 + ((i * 11) % 16) - 8;
            const opa = 0.55 + (i % 4) * 0.1;
            return (
              <text key={i} x={startX} y={startY} opacity="0">
                {ch}
                <animate attributeName="opacity" values={`0;${opa};${opa};0`} keyTimes="0;0.15;0.75;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                <animate attributeName="x" values={`${startX};${midX};${endX}`} keyTimes="0;0.5;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                <animate attributeName="y" values={`${startY};${midY};${endY}`} keyTimes="0;0.5;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
              </text>
            );
          })}
        </g>

        <path d="M 128 158 Q 175 100 220 168" stroke="#FBE9D2" strokeWidth="1.2" fill="none" strokeDasharray="2 5" opacity="0.55">
          <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M 128 188 Q 175 240 220 178" stroke="#FBE9D2" strokeWidth="1.2" fill="none" strokeDasharray="2 5" opacity="0.4">
          <animate attributeName="stroke-dashoffset" from="0" to="28" dur="3s" repeatCount="indefinite" />
        </path>

        <g transform="translate(220,172)">
          <circle cx="0" cy="0" r="46" fill="oklch(78% 0.14 55)" opacity="0.22" filter="url(#softGlow)">
            <animate attributeName="r" values="44;52;44" dur="3.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="36" fill="none" stroke="#FBE9D2" strokeOpacity="0.5" strokeWidth="1" />
          <g>
            {Array.from({ length: 13 }).map((_, i) => {
              const N = 13;
              const x = (i - (N - 1) / 2) * 4.2;
              const t = (i - (N - 1) / 2) / ((N - 1) / 2);
              const baseH = 30 - Math.abs(t) * 22 + 6;
              const dur = 1.0 + (i % 4) * 0.25;
              const begin = (i * 0.07) % 1.5;
              return (
                <rect key={i} x={x - 1.4} y={-baseH / 2} width="2.8" height={baseH} rx="1.4" fill="#FBE9D2">
                  <animate attributeName="height" values={`${baseH * 0.4};${baseH * 1.15};${baseH * 0.55};${baseH * 0.95};${baseH * 0.4}`} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                  <animate attributeName="y" values={`${-baseH * 0.2};${-baseH * 0.575};${-baseH * 0.275};${-baseH * 0.475};${-baseH * 0.2}`} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
                </rect>
              );
            })}
          </g>
        </g>

        <g transform="translate(220,234)">
          <circle cx="0" cy="0" r="13" fill="#1A1714" />
          <circle cx="0" cy="0" r="13" fill="none" stroke="#FBE9D2" strokeOpacity="0.4" strokeWidth="0.8" />
          <path d="M -3.5 -5 L 5 0 L -3.5 5 Z" fill="#FBE9D2" />
          <animate attributeName="opacity" values="0.85;1;0.85" dur="2.6s" repeatCount="indefinite" />
        </g>

        <g fill="#FBE9D2">
          {Array.from({ length: 10 }).map((_, i) => {
            const x = 30 + ((i * 27) % 250);
            const y = 30 + ((i * 49) % 280);
            const dur = 4 + (i % 4);
            return (
              <circle key={i} cx={x} cy={y} r={1 + (i % 3) * 0.3} opacity="0.5">
                <animate attributeName="opacity" values="0.1;0.7;0.1" dur={`${dur}s`} begin={`${i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="cy" values={`${y};${y - 5};${y}`} dur={`${dur + 1}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
        </g>

        <path d="M 0 0 L 300 0 L 300 80 Q 150 110 0 80 Z" fill="#fff" opacity="0.07" />

        <g stroke="#FBE9D2" strokeWidth="1.2" opacity="0.55" fill="none">
          <path d="M 12 12 L 22 12 M 12 12 L 12 22" />
          <path d="M 288 12 L 278 12 M 288 12 L 288 22" />
          <path d="M 12 333 L 22 333 M 12 333 L 12 323" />
          <path d="M 288 333 L 278 333 M 288 333 L 288 323" />
        </g>

        <text x="150" y="328" textAnchor="middle" fontFamily="JetBrains Mono, ui-monospace, monospace" fontSize="8" fill="#FBE9D2" opacity="0.7" letterSpacing="2">
          ESSAYS  →  AUDIO
        </text>
      </svg>
    </div>
  );
}
