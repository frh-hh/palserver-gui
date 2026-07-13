/**
 * 「疾旋鼬 × 桃旋鼬」主題的角落吉祥物 —— 手繪二創卡通插畫(SVG),取代預設的貓貓。
 * 左:疾旋鼬(靛紫、頭上小龍角);右:桃旋鼬(蜜桃、火屬性,頭尾帶小火苗)。
 * 走浮誇可愛路線:大眼、腮紅、蓬鬆尾巴 + 四周閃亮亮的星星。純 SVG,隨容器縮放。
 */
export function WeaselMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 440 360" className={className} role="img" aria-hidden>
      <defs>
        <linearGradient id="wm-indigo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8688f7" />
          <stop offset="1" stopColor="#5f61ec" />
        </linearGradient>
        <linearGradient id="wm-peach" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb98d" />
          <stop offset="1" stopColor="#fa955f" />
        </linearGradient>
        <linearGradient id="wm-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff7a45" />
          <stop offset="0.55" stopColor="#ffb24d" />
          <stop offset="1" stopColor="#ffe07a" />
        </linearGradient>
        <radialGradient id="wm-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0" stopColor="#c9b8ff" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#ffc9a3" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ffc9a3" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 柔和雙色光暈 */}
      <ellipse cx="220" cy="196" rx="205" ry="150" fill="url(#wm-glow)" />

      {/* ── 疾旋鼬(靛紫,左) ── */}
      <g>
        {/* 蓬鬆尾巴 */}
        <path
          d="M104 250 C58 250 44 196 74 172 C92 158 118 168 116 196 C114 214 128 228 148 226 Z"
          fill="url(#wm-indigo)"
        />
        <path d="M84 210 C70 204 70 184 84 178" fill="none" stroke="#4a4cd0" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
        {/* 身體 */}
        <ellipse cx="150" cy="212" rx="62" ry="74" fill="url(#wm-indigo)" />
        {/* 肚子 */}
        <ellipse cx="150" cy="228" rx="38" ry="50" fill="#dcdcff" />
        {/* 腳 */}
        <ellipse cx="128" cy="278" rx="16" ry="11" fill="#5658e0" />
        <ellipse cx="172" cy="278" rx="16" ry="11" fill="#5658e0" />
        {/* 手 */}
        <ellipse cx="106" cy="232" rx="13" ry="17" fill="#7476f4" />
        <ellipse cx="194" cy="232" rx="13" ry="17" fill="#7476f4" />
        {/* 耳朵 */}
        <path d="M112 158 C104 130 120 120 132 140 C138 150 132 160 122 162 Z" fill="url(#wm-indigo)" />
        <path d="M188 158 C196 130 180 120 168 140 C162 150 168 160 178 162 Z" fill="url(#wm-indigo)" />
        <circle cx="120" cy="146" r="6" fill="#4a4cd0" />
        <circle cx="180" cy="146" r="6" fill="#4a4cd0" />
        {/* 小龍角 */}
        <path d="M150 150 L142 120 L158 120 Z" fill="#c9caff" />
        <path d="M150 150 L146 126 L154 126 Z" fill="#a5a4ff" />
        {/* 臉 */}
        <ellipse cx="128" cy="200" rx="11" ry="13" fill="#2a2440" />
        <ellipse cx="172" cy="200" rx="11" ry="13" fill="#2a2440" />
        <circle cx="132" cy="195" r="3.6" fill="#fff" />
        <circle cx="176" cy="195" r="3.6" fill="#fff" />
        <circle cx="112" cy="216" r="8" fill="#ff9ec4" opacity="0.85" />
        <circle cx="188" cy="216" r="8" fill="#ff9ec4" opacity="0.85" />
        <ellipse cx="150" cy="214" rx="5" ry="3.6" fill="#3a3358" />
        <path d="M143 222 C147 227 153 227 157 222" fill="none" stroke="#3a3358" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* ── 桃旋鼬(蜜桃火屬性,右) ── */}
      <g>
        {/* 火尾 */}
        <path
          d="M336 252 C384 254 400 202 372 176 C352 158 324 170 328 198 C330 216 316 230 296 228 Z"
          fill="url(#wm-peach)"
        />
        <path d="M372 196 C388 184 386 160 368 156 C380 168 372 186 360 190 Z" fill="url(#wm-flame)" />
        {/* 身體 */}
        <ellipse cx="292" cy="214" rx="62" ry="74" fill="url(#wm-peach)" />
        <ellipse cx="292" cy="230" rx="38" ry="50" fill="#ffe6d3" />
        <ellipse cx="270" cy="280" rx="16" ry="11" fill="#f5905c" />
        <ellipse cx="314" cy="280" rx="16" ry="11" fill="#f5905c" />
        <ellipse cx="248" cy="234" rx="13" ry="17" fill="#ffb98d" />
        <ellipse cx="336" cy="234" rx="13" ry="17" fill="#ffb98d" />
        {/* 耳朵 */}
        <path d="M254 160 C246 132 262 122 274 142 C280 152 274 162 264 164 Z" fill="url(#wm-peach)" />
        <path d="M330 160 C338 132 322 122 310 142 C304 152 310 162 320 164 Z" fill="url(#wm-peach)" />
        <circle cx="262" cy="148" r="6" fill="#ef7a4a" />
        <circle cx="322" cy="148" r="6" fill="#ef7a4a" />
        {/* 頭頂小火苗 */}
        <path d="M292 138 C286 118 292 104 300 96 C296 112 306 118 300 132 C298 138 294 140 292 138 Z" fill="url(#wm-flame)" />
        {/* 臉 */}
        <ellipse cx="270" cy="202" rx="11" ry="13" fill="#2a2440" />
        <ellipse cx="314" cy="202" rx="11" ry="13" fill="#2a2440" />
        <circle cx="274" cy="197" r="3.6" fill="#fff" />
        <circle cx="318" cy="197" r="3.6" fill="#fff" />
        <circle cx="254" cy="218" r="8" fill="#ff7ea8" opacity="0.85" />
        <circle cx="330" cy="218" r="8" fill="#ff7ea8" opacity="0.85" />
        <ellipse cx="292" cy="216" rx="5" ry="3.6" fill="#7a3a20" />
        <path d="M285 224 C289 229 295 229 299 224" fill="none" stroke="#7a3a20" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* ── 浮誇閃亮亮的星星 ── */}
      <g fill="#fff">
        <Star x={70} y={110} s={11} />
        <Star x={378} y={120} s={13} />
        <Star x={210} y={70} s={9} />
        <Star x={44} y={196} s={8} />
        <Star x={404} y={214} s={9} />
      </g>
    </svg>
  );
}

/** 四角亮星(閃亮亮)。 */
function Star({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <path
      d={`M${x} ${y - s} C${x + s * 0.2} ${y - s * 0.2} ${x + s * 0.2} ${y - s * 0.2} ${x + s} ${y} C${x + s * 0.2} ${y + s * 0.2} ${x + s * 0.2} ${y + s * 0.2} ${x} ${y + s} C${x - s * 0.2} ${y + s * 0.2} ${x - s * 0.2} ${y + s * 0.2} ${x - s} ${y} C${x - s * 0.2} ${y - s * 0.2} ${x - s * 0.2} ${y - s * 0.2} ${x} ${y - s} Z`}
      opacity="0.9"
    />
  );
}
