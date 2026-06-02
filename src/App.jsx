import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const COMPANIONS = [
  {
    id: "uncle-lim",
    name: "Uncle Lim",
    desc: "Wise, weathered, seen it all. Won't sugarcoat.",
    color: "#C4913A",
    bgColor: "#2A1F0E",
    render: (mood) => <UncLimSVG mood={mood} />,
  },
  {
    id: "bacon",
    name: "Bacon",
    desc: "Soft, round, surprisingly insightful.",
    color: "#E8A0A0",
    bgColor: "#2A1515",
    render: (mood) => <BaconSVG mood={mood} />,
  },
  {
    id: "draco",
    name: "Draco",
    desc: "Small dragon. Big opinions about your spending.",
    color: "#5BA87A",
    bgColor: "#0E1F16",
    render: (mood) => <DracoSVG mood={mood} />,
  },
  {
    id: "bud",
    name: "Bud",
    desc: "A plant that grows with your financial health.",
    color: "#7DC47D",
    bgColor: "#141F14",
    render: (mood) => <BudSVG mood={mood} />,
  },
  {
    id: "kopi",
    name: "Kopi",
    desc: "Warm when things are good. Goes cold when they're not.",
    color: "#C4A46B",
    bgColor: "#1F1A0E",
    render: (mood) => <KopiSVG mood={mood} />,
  },
];

const CATEGORIES = [
  { id: "food", label: "Food", color: "#E8854A", icon: "🍜" },
  { id: "groceries", label: "Groceries", color: "#5BA87A", icon: "🛒" },
  { id: "transport", label: "Transport", color: "#5A8EC4", icon: "🚌" },
  { id: "entertainment", label: "Entertainment", color: "#9B72CF", icon: "🎬" },
  { id: "travel", label: "Travel", color: "#4ABDE8", icon: "✈️" },
  { id: "health", label: "Health", color: "#E87A7A", icon: "💊" },
  { id: "shopping", label: "Shopping", color: "#E8C44A", icon: "🛍️" },
  { id: "going-out", label: "Going Out", color: "#E87AB0", icon: "🍷" },
  { id: "education", label: "Education", color: "#7AB0E8", icon: "📚" },
  { id: "bills", label: "Bills", color: "#A0A0A0", icon: "📄" },
  { id: "misc", label: "Miscellaneous", color: "#C4A46B", icon: "📦" },
];

const DAILY_FACTS = [
  "Inflation erodes your purchasing power by about 2–3% every year.",
  "The average household spends 13% of income on food.",
  "Transport costs are the second largest expense for most families.",
  "Buying in bulk saves money only when you actually use everything.",
  "Price anchoring tricks you into thinking a sale is better than it is.",
  "Emergency funds should cover 3–6 months of essential expenses.",
  "The latte factor: small daily purchases add up to thousands annually.",
  "Comparing unit prices, not shelf prices, is the smarter grocery habit.",
  "Your personal inflation rate often differs significantly from official CPI.",
  "Subscription creep costs the average person $200+ per month unnoticed.",
  "Timing purchases to end-of-month sales cycles can save 15–30%.",
  "Loyalty programs work best when you were buying the item anyway.",
  "Shrinkflation: same price, less product — watch net weight, not price.",
  "The 24-hour rule before any non-essential purchase reduces regret buys by 70%.",
  "Eating before grocery shopping reduces impulse food spending.",
  "Price memory fades fast — tracking is the only way to spot real increases.",
  "Healthcare costs rise faster than general inflation in most countries.",
  "Opportunity cost means every dollar spent is a dollar not invested.",
  "The average car sits unused 95% of the time.",
  "Utility bills often have off-peak pricing most people never use.",
  "Paying annually instead of monthly saves 10–20% on most subscriptions.",
  "Brand loyalty is often just familiarity, not actual quality difference.",
  "The mental accounting trap makes you treat windfalls differently than income.",
  "Loss aversion means losses hurt twice as much as equivalent gains feel good.",
  "Your highest-cost day of the week is almost certainly a weekend.",
  "Preparing a shopping list cuts grocery spending by an average of 20%.",
  "Market timing fails most investors — consistency wins over cleverness.",
  "Housing, food, and transport typically consume 60–70% of most budgets.",
  "Compound interest works for savings the same way compound debt destroys.",
  "The best financial decision is usually the boring one done consistently.",
];

const LESSONS = [
  { day: 1, module: "Money Foundations", title: "What Money Actually Is", body: "Money is a shared agreement — a token society uses to store and exchange value. Before money, people bartered: a farmer traded rice for shoes. The problem? What if the cobbler didn't need rice? Money solved this by becoming a universal medium everyone accepts. Understanding this matters because money itself has no inherent value. A $50 note in an isolated island means nothing. It only works because millions of people agree it does. This shared agreement is fragile — inflation is what happens when that agreement weakens." },
  { day: 2, module: "Money Foundations", title: "Where Your Money Actually Goes", body: "Most people wildly underestimate their spending. Studies show people recall only 70% of their expenses when asked to remember them. The rest disappears into what behavioural economists call 'invisible spending' — small, frequent, automated, or emotionally charged purchases that don't stick in memory. Your brain assigns less mental weight to digital transactions than cash. A tap-to-pay for $4.50 barely registers. But 20 of those a month is $90. This is why logging matters: it makes invisible money visible again." },
  { day: 3, module: "Money Foundations", title: "The Difference Between Price and Value", body: "Price is what you pay. Value is what you get. These are almost never the same number. A $200 pair of shoes worn daily for 5 years costs $0.11 per day. A $50 pair worn 20 times and thrown away costs $2.50 per day. The $200 shoes were the better value. This is the cost-per-use mental model, and applying it consistently changes every purchasing decision. The question isn't 'is this expensive?' It's 'is what I get worth what I give?'" },
  { day: 4, module: "Money Foundations", title: "How Inflation Silently Shrinks Your Money", body: "Inflation is the gradual increase in the general price level of goods and services. At 3% annual inflation, something costing $100 today costs $134 in 10 years. Your $100 buys less — even if the number in your wallet didn't change. This is why keeping all your money in cash is actually a losing strategy. Sitting still means falling behind. Understanding your personal inflation rate — how much more your specific purchases cost over time — is far more useful than the official CPI figure, which averages across millions of different spending patterns." },
  { day: 5, module: "Money Foundations", title: "Needs vs Wants vs Wishes", body: "Financial clarity starts with honest categorisation. Needs are non-negotiable: food, shelter, basic transport, healthcare. Wants are things that improve life but aren't survival: Netflix, restaurant meals, new phones. Wishes are aspirational: holidays, luxury items, investment properties. The problem is that marketing exists specifically to blur these lines. A new smartphone feels like a need. Air-conditioning feels like a need in a hot country. Being honest — not harsh, just accurate — about which category each purchase falls into is the foundation of a budget that works." },
];

const SCENARIOS = [
  {
    day: 1,
    prompt: "Your usual kopi stall raised prices from $1.20 to $1.50. That's 25% more. Do you:",
    options: [
      { text: "Keep buying daily — it's just 30 cents", quality: "bad" },
      { text: "Buy every other day and make coffee at home on alternate days", quality: "best" },
      { text: "Stop going entirely and feel resentful about it", quality: "flawed" },
    ],
    explanation: "30 cents daily is $109.50 annually. The best option acknowledges the price change and adapts proportionally. Quitting entirely often means spending more on convenience alternatives. Gradual adjustment is more sustainable than dramatic reactions.",
    reflection: "How often do you notice when a regular purchase has quietly gotten more expensive?",
  },
  {
    day: 2,
    prompt: "You have $500 saved. Your friend says to invest it all in a trending crypto. You:",
    options: [
      { text: "Invest the full $500 — high risk, high reward", quality: "bad" },
      { text: "Invest $100 as a learning experience, keep $400 accessible", quality: "best" },
      { text: "Put it all in a savings account earning 0.5% interest", quality: "flawed" },
    ],
    explanation: "Investing your entire emergency buffer in highly volatile assets is dangerous. But keeping savings in near-zero interest accounts when you have no urgent need for the cash also loses value to inflation. The balanced approach — small speculative investment, majority in accessible but higher-yield options — is the most rational.",
    reflection: "What's the difference between investing and gambling for you personally?",
  },
];

// ─── COMPANION SVGs ───────────────────────────────────────────────────────────

function getMoodIndex(pct) {
  if (pct >= 90) return 0;
  if (pct >= 70) return 1;
  if (pct >= 50) return 2;
  if (pct >= 25) return 3;
  return 4;
}

function UncLimSVG({ mood }) {
  const m = getMoodIndex(mood);
  const sweatDrop = m >= 3;
  const eyeClose = m >= 4;
  const skinTone = m >= 3 ? "#B8825A" : "#C99A6E";
  const expression = [
    { mouth: "M 38 70 Q 50 76 62 70", brow: "M 36 48 Q 44 44 50 46 M 50 46 Q 56 44 64 48" },
    { mouth: "M 40 70 Q 50 73 60 70", brow: "M 36 48 Q 44 46 50 47 M 50 47 Q 56 46 64 48" },
    { mouth: "M 40 72 Q 50 70 60 72", brow: "M 36 46 Q 44 50 50 49 M 50 49 Q 56 50 64 46" },
    { mouth: "M 38 74 Q 50 69 62 74", brow: "M 34 46 Q 44 52 50 51 M 50 51 Q 56 52 66 46" },
    { mouth: "M 38 76 Q 50 68 62 76", brow: "M 32 44 Q 44 54 50 53 M 50 53 Q 56 54 68 44" },
  ][m];

  return (
    <svg viewBox="0 0 100 120" width="100" height="120">
      {/* Singlet */}
      <ellipse cx="50" cy="105" rx="30" ry="18" fill="#4A3728" />
      <rect x="30" y="92" width="40" height="16" rx="4" fill="#3D2E22" />
      {/* Neck */}
      <rect x="44" y="85" width="12" height="12" rx="4" fill={skinTone} />
      {/* Head */}
      <ellipse cx="50" cy="60" rx="26" ry="28" fill={skinTone} />
      {/* Ears */}
      <ellipse cx="24" cy="62" rx="5" ry="7" fill={skinTone} />
      <ellipse cx="76" cy="62" rx="5" ry="7" fill={skinTone} />
      {/* Wrinkles */}
      <path d="M 32 55 Q 36 52 38 55" stroke="#A07845" strokeWidth="0.8" fill="none" opacity="0.6" />
      <path d="M 62 55 Q 64 52 68 55" stroke="#A07845" strokeWidth="0.8" fill="none" opacity="0.6" />
      {/* Eyes */}
      {eyeClose ? (
        <>
          <path d="M 38 58 Q 43 61 48 58" stroke="#4A3320" strokeWidth="1.5" fill="none" />
          <path d="M 52 58 Q 57 61 62 58" stroke="#4A3320" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="43" cy="58" rx="5" ry="5.5" fill="white" />
          <ellipse cx="57" cy="58" rx="5" ry="5.5" fill="white" />
          <circle cx="44" cy="59" r="3" fill="#2A1A0A" />
          <circle cx="58" cy="59" r="3" fill="#2A1A0A" />
          <circle cx="45" cy="58" r="1" fill="white" />
          <circle cx="59" cy="58" r="1" fill="white" />
        </>
      )}
      {/* Glasses on forehead */}
      <rect x="36" y="38" width="11" height="7" rx="3" fill="none" stroke="#8B7355" strokeWidth="1.2" />
      <rect x="53" y="38" width="11" height="7" rx="3" fill="none" stroke="#8B7355" strokeWidth="1.2" />
      <line x1="47" y1="41" x2="53" y2="41" stroke="#8B7355" strokeWidth="1.2" />
      <line x1="36" y1="41" x2="32" y2="42" stroke="#8B7355" strokeWidth="1.2" />
      <line x1="64" y1="41" x2="68" y2="42" stroke="#8B7355" strokeWidth="1.2" />
      {/* Hair - sparse grey */}
      <path d="M 30 46 Q 35 32 50 30 Q 65 32 70 46" fill="#888888" opacity="0.6" />
      {/* Eyebrows */}
      <path d={expression.brow} stroke="#5A3A1A" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Mouth */}
      <path d={expression.mouth} stroke="#8B5E3C" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Sweat */}
      {sweatDrop && (
        <ellipse cx="72" cy="52" rx="3" ry="4" fill="#5A8EC4" opacity="0.7" />
      )}
    </svg>
  );
}

function BaconSVG({ mood }) {
  const m = getMoodIndex(mood);
  const bodyColor = ["#F4B8B8", "#F0AAAA", "#E89898", "#D48080", "#BE6868"][m];
  const cheekOpacity = [0.7, 0.5, 0.4, 0.3, 0.15][m];
  const expression = [
    { eyeY: 62, mouthPath: "M 42 74 Q 50 80 58 74", mouthColor: "#D46060" },
    { eyeY: 62, mouthPath: "M 43 74 Q 50 78 57 74", mouthColor: "#C45858" },
    { eyeY: 63, mouthPath: "M 43 75 Q 50 74 57 75", mouthColor: "#B85050" },
    { eyeY: 64, mouthPath: "M 42 76 Q 50 71 58 76", mouthColor: "#A84848" },
    { eyeY: 65, mouthPath: "M 40 78 Q 50 69 60 78", mouthColor: "#984040" },
  ][m];

  return (
    <svg viewBox="0 0 100 120" width="100" height="120">
      {/* Body blob */}
      <ellipse cx="50" cy="100" rx="28" ry="20" fill={bodyColor} opacity="0.5" />
      {/* Main round body-head */}
      <ellipse cx="50" cy="65" rx="32" ry="36" fill={bodyColor} />
      {/* Tiny hands */}
      <ellipse cx="18" cy="80" rx="7" ry="5" fill={bodyColor} style={{ transform: m >= 3 ? "rotate(-15deg)" : "none", transformOrigin: "18px 80px" }} />
      <ellipse cx="82" cy="80" rx="7" ry="5" fill={bodyColor} style={{ transform: m >= 3 ? "rotate(15deg)" : "none", transformOrigin: "82px 80px" }} />
      {/* Cheeks */}
      <ellipse cx="33" cy="70" rx="8" ry="6" fill="#F08080" opacity={cheekOpacity} />
      <ellipse cx="67" cy="70" rx="8" ry="6" fill="#F08080" opacity={cheekOpacity} />
      {/* Eyes */}
      <ellipse cx="42" cy={expression.eyeY} rx="5" ry={m >= 4 ? 3 : 5.5} fill="white" />
      <ellipse cx="58" cy={expression.eyeY} rx="5" ry={m >= 4 ? 3 : 5.5} fill="white" />
      <circle cx="43" cy={expression.eyeY + 1} r="3" fill="#2A1010" />
      <circle cx="59" cy={expression.eyeY + 1} r="3" fill="#2A1010" />
      <circle cx="44" cy={expression.eyeY} r="1" fill="white" />
      <circle cx="60" cy={expression.eyeY} r="1" fill="white" />
      {/* Mouth */}
      <path d={expression.mouthPath} stroke={expression.mouthColor} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Nose dot */}
      <circle cx="50" cy="69" r="2" fill="#D48080" opacity="0.6" />
    </svg>
  );
}

function DracoSVG({ mood }) {
  const m = getMoodIndex(mood);
  const scaleColor = ["#4A9E6A", "#3D8E5C", "#307848", "#245C38", "#183A24"][m];
  const smokeOpacity = [0.8, 0.5, 0.3, 0.15, 0][m];
  const curl = m >= 3;

  return (
    <svg viewBox="0 0 100 120" width="100" height="120">
      {/* Tail */}
      <path d={curl ? "M 60 100 Q 80 95 82 110 Q 78 118 65 112" : "M 60 95 Q 82 90 88 100 Q 85 110 70 108"} fill={scaleColor} />
      {/* Body */}
      <ellipse cx="50" cy={curl ? 95 : 90} rx="22" ry={curl ? 18 : 22} fill={scaleColor} />
      {/* Wing hints */}
      <path d="M 30 78 Q 18 65 22 55 Q 28 60 32 72" fill={scaleColor} opacity="0.7" />
      <path d="M 70 78 Q 82 65 78 55 Q 72 60 68 72" fill={scaleColor} opacity="0.7" />
      {/* Neck */}
      <rect x="44" y="70" width="12" height="14" rx="5" fill={scaleColor} />
      {/* Head */}
      <ellipse cx="50" cy="58" rx="20" ry="18" fill={scaleColor} />
      {/* Snout */}
      <ellipse cx="50" cy="68" rx="10" ry="6" fill={scaleColor} />
      <rect x="42" y="64" width="16" height="8" rx="4" fill={scaleColor} />
      {/* Horns */}
      <path d="M 38 44 Q 36 32 40 28 Q 42 36 42 44" fill={["#6CB888", "#5AA870", "#4A9858", "#386844", "#264430"][m]} />
      <path d="M 62 44 Q 64 32 60 28 Q 58 36 58 44" fill={["#6CB888", "#5AA870", "#4A9858", "#386844", "#264430"][m]} />
      {/* Eyes - amber */}
      <ellipse cx="43" cy="55" rx="4.5" ry="5" fill="#F0D070" />
      <ellipse cx="57" cy="55" rx="4.5" ry="5" fill="#F0D070" />
      <ellipse cx="43" cy="56" rx="2" ry="3.5" fill="#1A0E00" />
      <ellipse cx="57" cy="56" rx="2" ry="3.5" fill="#1A0E00" />
      <circle cx="43.5" cy="54.5" r="0.8" fill="white" />
      <circle cx="57.5" cy="54.5" r="0.8" fill="white" />
      {/* Smoke from nostril */}
      <circle cx="54" cy="67" r="1" fill="#888" opacity={smokeOpacity} />
      <circle cx="56" cy="63" r="1.5" fill="#888" opacity={smokeOpacity * 0.7} />
      <circle cx="55" cy="58" r="2" fill="#888" opacity={smokeOpacity * 0.4} />
      {/* Mouth expression */}
      {m <= 1 ? (
        <path d="M 44 71 Q 50 75 56 71" stroke="#2A1A0A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : m <= 3 ? (
        <line x1="45" y1="72" x2="55" y2="72" stroke="#2A1A0A" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M 44 73 Q 50 69 56 73" stroke="#2A1A0A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

function BudSVG({ mood }) {
  const m = getMoodIndex(mood);
  const leafAngle = [-5, 0, 10, 20, 30][m];
  const soilColor = ["#6B4226", "#5C3820", "#4A2E18", "#3A2412", "#2A1A0C"][m];
  const leafColor = ["#5CB85C", "#4CAF4C", "#3A9A3A", "#2A7A2A", "#1A5A1A"][m];
  const stemHeight = [30, 28, 24, 20, 16][m];

  return (
    <svg viewBox="0 0 100 120" width="100" height="120">
      {/* Pot */}
      <path d="M 30 108 Q 28 118 72 118 Q 70 108 70 108 Z" fill="#C4823A" />
      <rect x="28" y="98" width="44" height="12" rx="4" fill="#D4923A" />
      {/* Soil */}
      <ellipse cx="50" cy="98" rx="20" ry="5" fill={soilColor} />
      {/* Stem */}
      <line x1="50" y1="98" x2="50" y2={98 - stemHeight} stroke="#6B8C3A" strokeWidth="3" strokeLinecap="round" />
      {/* Main leaf */}
      <g transform={`rotate(${leafAngle}, 50, ${98 - stemHeight})`}>
        <ellipse cx="50" cy={98 - stemHeight - 16} rx="16" ry="20" fill={leafColor} />
        {/* Leaf vein */}
        <line x1="50" y1={98 - stemHeight - 2} x2="50" y2={98 - stemHeight - 30} stroke="#4A7A2A" strokeWidth="1" opacity="0.6" />
        {/* Subtle face from leaf curves */}
        <ellipse cx="44" cy={98 - stemHeight - 18} rx="2.5" ry={m >= 4 ? 1.5 : 2.5} fill={["#3A8A3A", "#2A7A2A", "#2A6A2A", "#1A5A1A", "#0A4A0A"][m]} opacity="0.7" />
        <ellipse cx="56" cy={98 - stemHeight - 18} rx="2.5" ry={m >= 4 ? 1.5 : 2.5} fill={["#3A8A3A", "#2A7A2A", "#2A6A2A", "#1A5A1A", "#0A4A0A"][m]} opacity="0.7" />
        {m <= 1 && <path d="M 45 98 Q 50 102 55 98" stroke="#2A6A2A" strokeWidth="1.2" fill="none" transform={`translate(0, ${-stemHeight - 8})`} />}
        {m >= 3 && <path d="M 45 94 Q 50 90 55 94" stroke="#1A4A1A" strokeWidth="1.2" fill="none" transform={`translate(0, ${-stemHeight - 8})`} />}
      </g>
      {/* Small side leaf */}
      {m <= 2 && (
        <ellipse cx="60" cy={98 - stemHeight + 8} rx="10" ry="7" fill={leafColor} opacity="0.7" transform={`rotate(30, 60, ${98 - stemHeight + 8})`} />
      )}
    </svg>
  );
}

function KopiSVG({ mood }) {
  const m = getMoodIndex(mood);
  const steamOpacity = [1, 0.7, 0.4, 0.15, 0][m];
  const tilt = [0, 2, 5, 10, 15][m];
  const crackVisible = m >= 4;
  const cupColor = ["#F0E0C0", "#E8D4B0", "#D8C4A0", "#C0A880", "#A89060"][m];

  return (
    <svg viewBox="0 0 100 120" width="100" height="120">
      <g transform={`rotate(${tilt}, 50, 90)`}>
        {/* Saucer */}
        <ellipse cx="50" cy="108" rx="26" ry="6" fill="#D4B880" />
        {/* Cup body */}
        <path d="M 28 75 Q 26 105 40 108 Q 50 110 60 108 Q 74 105 72 75 Z" fill={cupColor} />
        {/* Cup rim */}
        <ellipse cx="50" cy="75" rx="22" ry="6" fill={["#F8ECD4", "#F0E0C0", "#E0CCA8", "#C8B088", "#A89068"][m]} />
        {/* Handle */}
        <path d="M 72 82 Q 84 82 84 90 Q 84 98 72 98" stroke={cupColor} strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* Coffee liquid inside */}
        <ellipse cx="50" cy="75" rx="20" ry="5" fill={["#6B3C18", "#5A3214", "#4A2810", "#3A1E0C", "#2A1408"][m]} />
        {/* Crack */}
        {crackVisible && (
          <path d="M 44 88 Q 46 94 43 100 Q 41 104 44 108" stroke="#8B6840" strokeWidth="1.2" fill="none" opacity="0.8" />
        )}
      </g>
      {/* Steam */}
      <path d="M 42 68 Q 39 58 42 50 Q 45 42 42 34" stroke="#E0C890" strokeWidth="2" fill="none" strokeLinecap="round" opacity={steamOpacity} />
      <path d="M 50 65 Q 47 55 50 47 Q 53 39 50 31" stroke="#E0C890" strokeWidth="2" fill="none" strokeLinecap="round" opacity={steamOpacity * 0.8} />
      <path d="M 58 68 Q 61 58 58 50 Q 55 42 58 34" stroke="#E0C890" strokeWidth="2" fill="none" strokeLinecap="round" opacity={steamOpacity * 0.6} />
    </svg>
  );
}

// ─── BUDGET HEALTH ────────────────────────────────────────────────────────────

function getBudgetPct(spent, budget) {
  if (!budget) return 100;
  return Math.max(0, Math.min(100, Math.round((1 - spent / budget) * 100)));
}

function getBudgetColor(pct) {
  if (pct >= 70) return "#A8E6CF";
  if (pct >= 50) return "#FAC775";
  if (pct >= 25) return "#FFB8D0";
  return "#E87A7A";
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #FBF8FF;
    --bg2: #F4F0FF;
    --bg3: #EDE8FA;
    --surface: #FFFFFF;
    --primary: #7C6BAE;
    --primary-dark: #5C4E8A;
    --primary-light: #C8BCEC;
    --green: #3B8A5E;
    --green-bg: #E8F8F0;
    --green-mid: #A8E6CF;
    --red: #C0446A;
    --red-bg: #FFF0F5;
    --red-mid: #FFB8D0;
    --orange: #9A7A20;
    --orange-bg: #FFF9EC;
    --orange-mid: #FAC775;
    --text: #3D2B7A;
    --text2: #6B5B9E;
    --text3: #B8AEDD;
    --border: rgba(124,107,174,0.15);
    --border2: rgba(124,107,174,0.25);
    --shadow: 0 2px 12px rgba(124,107,174,0.1);
    --amber: #7C6BAE;
    --amber-light: #9B8BC4;
  }

  body, html { background: var(--bg); font-family: "Plus Jakarta Sans", sans-serif; color: var(--text); }

  .app { width: 100%; max-width: 430px; min-height: 100vh; margin: 0 auto; background: var(--bg); position: relative; overflow: hidden; display: flex; flex-direction: column; }

  .screen { flex: 1; overflow-y: auto; overflow-x: hidden; padding-bottom: 100px; -webkit-overflow-scrolling: touch; }
  .screen::-webkit-scrollbar { display: none; }

  .onboard-wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; text-align: center; background: linear-gradient(160deg,#F0EBFF 0%,#FBF8FF 50%,#FFF0F7 100%); }
  .onboard-logo { font-family: "Plus Jakarta Sans",sans-serif; font-size: 38px; font-weight: 800; color: var(--text); letter-spacing: -1px; line-height: 1; margin-bottom: 8px; }
  .onboard-tagline { font-size: 15px; color: var(--text2); font-weight: 500; margin-bottom: 48px; max-width: 240px; line-height: 1.6; }

  .btn-primary { background: var(--primary); color: white; border: none; border-radius: 14px; padding: 16px 40px; font-family: "Plus Jakarta Sans",sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; width: 100%; box-shadow: 0 4px 16px rgba(124,107,174,0.3); }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); }

  .btn-secondary { background: transparent; color: var(--text2); border: 1.5px solid var(--border2); border-radius: 14px; padding: 14px 40px; font-family: "Plus Jakarta Sans",sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; width: 100%; margin-top: 10px; }
  .btn-secondary:hover { border-color: var(--primary); color: var(--primary); }

  .budget-input-wrap { position: relative; margin: 24px 0; }
  .currency-label { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 22px; font-weight: 800; color: var(--primary); }
  .budget-input { width: 100%; background: white; border: 1.5px solid var(--border2); border-radius: 14px; padding: 18px 16px 18px 42px; font-family: "Plus Jakarta Sans",sans-serif; font-size: 32px; font-weight: 800; color: var(--text); outline: none; transition: border-color 0.2s; }
  .budget-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(124,107,174,0.12); }

  .companion-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
  .companion-card { background: white; border: 1.5px solid var(--border2); border-radius: 18px; padding: 20px 12px 16px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; box-shadow: var(--shadow); }
  .companion-card.selected { border-color: var(--primary); background: var(--bg2); box-shadow: 0 4px 20px rgba(124,107,174,0.2); }
  .companion-card:last-child { grid-column: 1 / -1; max-width: 180px; margin: 0 auto; }
  .companion-name { font-size: 15px; font-weight: 800; color: var(--text); margin-top: 8px; }
  .companion-desc { font-size: 11px; color: var(--text3); margin-top: 4px; line-height: 1.4; }

  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: white; border-top: 1.5px solid var(--border); display: flex; align-items: center; justify-content: space-around; padding: 10px 0 20px; z-index: 100; box-shadow: 0 -4px 20px rgba(124,107,174,0.08); }
  .nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 6px 12px; border-radius: 10px; transition: all 0.2s; background: none; border: none; color: var(--text3); }
  .nav-item.active { color: var(--primary); }
  .nav-label { font-size: 10px; font-weight: 700; letter-spacing: 0.3px; }
  .nav-fab { width: 58px; height: 58px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; margin-top: -24px; border: 3px solid var(--bg); transition: all 0.2s; box-shadow: 0 4px 20px rgba(124,107,174,0.4); }
  .nav-fab:hover { transform: scale(1.05); background: var(--primary-dark); }

  .home-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px 12px; background: var(--bg2); }
  .home-logo { font-size: 20px; font-weight: 800; color: var(--text); }
  .profile-btn { width: 36px; height: 36px; background: var(--primary-light); border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text); font-size: 13px; font-weight: 800; }

  .companion-zone { display: flex; flex-direction: column; align-items: center; padding: 16px 20px 8px; background: var(--bg2); position: relative; }
  .companion-bubble { background: white; border: 1.5px solid var(--border2); border-radius: 16px; padding: 10px 16px; font-size: 13px; color: var(--text2); max-width: 240px; text-align: center; margin-top: 8px; line-height: 1.5; font-weight: 500; box-shadow: var(--shadow); position: relative; }
  .companion-bubble::before { content: ""; position: absolute; top: -8px; left: 50%; transform: translateX(-50%); border: 8px solid transparent; border-bottom-color: var(--border2); border-top: 0; }

  .budget-bar-wrap { padding: 14px 16px; background: white; margin: 10px 16px; border-radius: 16px; border: 1.5px solid var(--border); box-shadow: var(--shadow); }
  .budget-bar-labels { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .budget-bar-label { font-size: 11px; color: var(--text3); font-weight: 700; letter-spacing: 0.5px; }
  .budget-bar-amount { font-size: 16px; font-weight: 800; color: var(--text); }
  .budget-track { height: 10px; background: var(--bg3); border-radius: 10px; overflow: hidden; position: relative; }
  .budget-fill { height: 100%; border-radius: 10px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1), background 0.8s; }

  .daily-fact-card { margin: 0 16px 12px; background: var(--orange-bg); border: 1.5px solid var(--orange-mid); border-radius: 14px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 10px; }
  .fact-dot { width: 7px; height: 7px; border-radius: 50%; background: #F7C948; margin-top: 5px; flex-shrink: 0; }
  .fact-text { font-size: 12px; color: var(--orange); line-height: 1.5; font-weight: 500; }

  .alert-banner { margin: 0 16px 12px; background: var(--red-bg); border: 1.5px solid var(--red-mid); border-radius: 14px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .alert-text { font-size: 12px; color: var(--red); font-weight: 600; line-height: 1.4; }
  .alert-dismiss { background: none; border: none; color: var(--red-mid); cursor: pointer; font-size: 16px; padding: 0; flex-shrink: 0; }

  .guest-banner { margin: 10px 16px; background: var(--bg2); border: 1.5px solid var(--border2); border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .guest-text { font-size: 11px; color: var(--text3); line-height: 1.4; }
  .guest-btn { background: var(--primary); color: white; border: none; border-radius: 8px; padding: 6px 12px; font-size: 11px; font-weight: 800; cursor: pointer; white-space: nowrap; flex-shrink: 0; }

  .screen-header { padding: 20px 20px 12px; display: flex; align-items: center; gap: 12px; background: var(--bg2); }
  .back-btn { background: white; border: 1.5px solid var(--border2); border-radius: 10px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text2); }
  .screen-title { font-size: 22px; font-weight: 800; color: var(--text); }

  .log-tabs { display: flex; margin: 12px 16px 16px; background: var(--bg3); border-radius: 12px; padding: 4px; gap: 4px; }
  .log-tab { flex: 1; padding: 10px; border-radius: 9px; border: none; background: none; font-family: "Plus Jakarta Sans",sans-serif; font-size: 13px; font-weight: 700; color: var(--text3); cursor: pointer; transition: all 0.2s; }
  .log-tab.active { background: white; color: var(--primary); box-shadow: var(--shadow); }

  .form-field { margin: 0 16px 14px; }
  .form-label { font-size: 11px; font-weight: 800; color: var(--text3); letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 6px; display: block; }
  .form-input { width: 100%; background: white; border: 1.5px solid var(--border2); border-radius: 12px; padding: 13px 14px; font-family: "Plus Jakarta Sans",sans-serif; font-size: 15px; color: var(--text); outline: none; transition: border-color 0.2s; font-weight: 500; }
  .form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(124,107,174,0.1); }

  .category-scroll { display: flex; gap: 8px; overflow-x: auto; padding: 0 16px 4px; margin-bottom: 14px; -webkit-overflow-scrolling: touch; }
  .category-scroll::-webkit-scrollbar { display: none; }
  .cat-chip { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 20px; border: 1.5px solid transparent; background: white; cursor: pointer; white-space: nowrap; font-size: 13px; font-weight: 700; color: var(--text2); transition: all 0.2s; flex-shrink: 0; box-shadow: var(--shadow); }
  .cat-chip.selected { border-color: currentColor; background: var(--bg2); }

  .rating-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .rating-btn { width: 36px; height: 36px; border-radius: 9px; border: 1.5px solid var(--border2); background: white; color: var(--text2); font-family: "Plus Jakarta Sans",sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .rating-btn.selected { background: var(--primary); border-color: var(--primary); color: white; }

  .donut-wrap { display: flex; justify-content: center; padding: 20px; position: relative; }
  .donut-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; }
  .donut-total { font-size: 26px; font-weight: 800; color: var(--text); line-height: 1; }
  .donut-label { font-size: 11px; color: var(--text3); font-weight: 700; letter-spacing: 0.5px; }

  .stat-pills { display: flex; gap: 8px; padding: 0 16px; overflow-x: auto; margin-bottom: 16px; }
  .stat-pills::-webkit-scrollbar { display: none; }
  .stat-pill { background: white; border: 1.5px solid var(--border); border-radius: 12px; padding: 12px 16px; flex-shrink: 0; min-width: 100px; box-shadow: var(--shadow); }
  .stat-pill-val { font-size: 18px; font-weight: 800; color: var(--text); line-height: 1; }
  .stat-pill-label { font-size: 10px; color: var(--text3); font-weight: 700; margin-top: 3px; letter-spacing: 0.5px; }

  .cat-breakdown { margin: 0 16px; }
  .cat-card { background: white; border: 1.5px solid var(--border); border-radius: 14px; padding: 14px 16px; margin-bottom: 10px; box-shadow: var(--shadow); }
  .cat-card-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .cat-card-name { font-size: 14px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 6px; }
  .cat-card-amount { font-size: 16px; font-weight: 800; color: var(--text); }
  .cat-bar-track { height: 6px; background: var(--bg3); border-radius: 5px; overflow: hidden; margin-bottom: 8px; }
  .cat-bar-fill { height: 100%; border-radius: 5px; }

  .status-tag { font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 20px; letter-spacing: 0.5px; }
  .status-tag.on-track { background: var(--green-bg); color: var(--green); }
  .status-tag.watch-out { background: var(--orange-bg); color: var(--orange); }
  .status-tag.overspending { background: var(--red-bg); color: var(--red); }

  .digest-headline { font-size: 26px; font-weight: 800; color: var(--text); line-height: 1.2; padding: 0 20px; margin-bottom: 20px; }
  .digest-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 16px; margin-bottom: 20px; }
  .digest-card { background: white; border: 1.5px solid var(--border); border-radius: 14px; padding: 16px; box-shadow: var(--shadow); }
  .digest-card-label { font-size: 10px; color: var(--text3); font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 8px; }
  .digest-card-val { font-size: 22px; font-weight: 800; color: var(--text); line-height: 1; }
  .digest-card-sub { font-size: 11px; color: var(--text3); margin-top: 3px; font-weight: 500; }
  .digest-insight { margin: 0 16px; background: var(--bg2); border: 1.5px solid var(--border2); border-radius: 14px; padding: 14px 16px; font-size: 13px; color: var(--text2); line-height: 1.5; font-weight: 500; }

  .section-title { font-size: 18px; font-weight: 800; color: var(--text); padding: 0 20px; margin-bottom: 14px; }

  .lesson-card { margin: 0 16px 16px; background: white; border: 1.5px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: var(--shadow); }
  .lesson-header { padding: 14px 18px 12px; border-bottom: 1.5px solid var(--border); display: flex; align-items: center; gap: 10px; background: var(--bg2); }
  .lesson-day-badge { background: var(--primary); color: white; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 20px; }
  .lesson-module { font-size: 11px; color: var(--text3); font-weight: 700; letter-spacing: 0.5px; }
  .lesson-title { font-size: 18px; font-weight: 800; color: var(--text); padding: 14px 18px 8px; line-height: 1.3; }
  .lesson-body { font-size: 14px; color: var(--text2); padding: 0 18px 18px; line-height: 1.7; font-weight: 500; }

  .scenario-card { margin: 0 16px 16px; background: white; border: 1.5px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: var(--shadow); }
  .scenario-label { background: var(--red-bg); border-bottom: 1.5px solid var(--border); padding: 10px 18px; font-size: 11px; color: var(--red); font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; }
  .scenario-prompt { font-size: 14px; font-weight: 700; color: var(--text); padding: 16px 18px 12px; line-height: 1.5; }
  .scenario-option { margin: 0 18px 8px; padding: 13px 16px; background: var(--bg2); border: 1.5px solid var(--border2); border-radius: 12px; font-size: 13px; color: var(--text2); cursor: pointer; transition: all 0.2s; line-height: 1.4; text-align: left; width: calc(100% - 36px); font-family: "Plus Jakarta Sans",sans-serif; font-weight: 600; }
  .scenario-option:last-of-type { margin-bottom: 18px; }
  .scenario-option.best { border-color: var(--green-mid); color: var(--green); background: var(--green-bg); }
  .scenario-option.flawed { border-color: var(--orange-mid); color: var(--orange); background: var(--orange-bg); }
  .scenario-option.bad { border-color: var(--red-mid); color: var(--red); background: var(--red-bg); }

  .explanation-box { margin: 0 18px 18px; background: var(--bg2); border-radius: 12px; padding: 14px; font-size: 12px; color: var(--text2); line-height: 1.6; border-left: 3px solid var(--primary); font-weight: 500; }
  .reflection-box { margin: 0 18px 18px; font-size: 12px; color: var(--text3); font-style: italic; line-height: 1.5; font-weight: 500; }

  .future-calc { margin: 0 16px 20px; background: var(--bg2); border: 1.5px solid var(--border2); border-radius: 18px; padding: 20px; }
  .future-calc-title { font-size: 17px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
  .future-calc-sub { font-size: 12px; color: var(--text3); margin-bottom: 16px; line-height: 1.4; font-weight: 500; }
  .future-result-cards { display: flex; gap: 8px; margin-bottom: 14px; }
  .future-result { flex: 1; background: white; border-radius: 12px; padding: 12px; text-align: center; border: 1.5px solid var(--border); }
  .future-result-years { font-size: 10px; color: var(--text3); font-weight: 800; letter-spacing: 0.5px; margin-bottom: 4px; }
  .future-result-val { font-size: 16px; font-weight: 800; color: var(--green); }
  .future-motivate { font-size: 12px; color: var(--primary); font-weight: 700; line-height: 1.4; text-align: center; }

  .price-item { margin: 0 16px 10px; background: white; border: 1.5px solid var(--border); border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; box-shadow: var(--shadow); }
  .price-item-info { flex: 1; }
  .price-item-name { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
  .price-item-detail { font-size: 11px; color: var(--text3); font-weight: 500; }
  .price-sparkline { width: 60px; height: 28px; }
  .price-change { font-size: 14px; font-weight: 800; display: flex; align-items: center; gap: 3px; }
  .price-change.up { color: var(--red); }
  .price-change.down { color: var(--green); }

  .modal-overlay { position: fixed; inset: 0; background: rgba(61,43,122,0.3); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
  .modal-sheet { background: white; border-radius: 24px 24px 0 0; padding: 24px 20px 40px; width: 100%; max-width: 430px; border-top: 1.5px solid var(--border2); box-shadow: 0 -8px 40px rgba(124,107,174,0.15); }
  .modal-handle { width: 36px; height: 4px; background: var(--border2); border-radius: 2px; margin: 0 auto 20px; }
  .modal-title { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 20px; }
  .color-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px; }
  .color-swatch { width: 32px; height: 32px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }
  .color-swatch.selected { border-color: var(--text); transform: scale(1.15); }

  .profile-stat { background: var(--bg2); border: 1.5px solid var(--border2); border-radius: 14px; padding: 20px; margin: 0 20px 10px; text-align: center; }
  .profile-stat-val { font-size: 40px; font-weight: 800; color: var(--primary); line-height: 1; }
  .profile-stat-label { font-size: 12px; color: var(--text3); margin-top: 4px; font-weight: 600; }
  .profile-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid var(--border); }
  .profile-row-label { font-size: 14px; color: var(--text2); font-weight: 600; }
  .profile-row-val { font-size: 14px; color: var(--text3); font-weight: 500; }

  .insight-overlay { position: fixed; inset: 0; background: rgba(61,43,122,0.3); z-index: 150; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .insight-card { background: white; border: 1.5px solid var(--border2); border-radius: 20px; padding: 28px 24px; max-width: 340px; width: 100%; text-align: center; box-shadow: 0 8px 40px rgba(124,107,174,0.2); }
  .insight-icon { font-size: 32px; margin-bottom: 14px; }
  .insight-title { font-size: 17px; font-weight: 800; color: var(--text); margin-bottom: 8px; line-height: 1.3; }
  .insight-sub { font-size: 13px; color: var(--text3); line-height: 1.5; margin-bottom: 20px; font-weight: 500; }

  .month-selector { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 16px 20px; }
  .month-arrow { background: white; border: 1.5px solid var(--border2); border-radius: 10px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text2); font-size: 16px; box-shadow: var(--shadow); }
  .month-label { font-size: 18px; font-weight: 800; color: var(--text); }

  .section-divider { height: 1px; background: var(--border); margin: 16px; }

  .intel-card { margin: 0 16px 10px; background: white; border: 1.5px solid var(--border); border-radius: 14px; padding: 14px 16px; box-shadow: var(--shadow); }
  .intel-title { font-size: 11px; color: var(--text3); font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 10px; }
  .intel-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border); }
  .intel-row:last-child { border-bottom: none; }
  .intel-name { font-size: 13px; color: var(--text); font-weight: 600; }
  .intel-detail { font-size: 12px; color: var(--text3); font-weight: 500; }

  .inflation-badge { margin: 16px 16px 0; display: flex; align-items: center; justify-content: space-between; background: var(--red-bg); border: 1.5px solid var(--red-mid); border-radius: 14px; padding: 14px 18px; }
  .inflation-label { font-size: 12px; color: var(--red); font-weight: 700; }
  .inflation-rate { font-size: 24px; font-weight: 800; color: var(--red); }

  .auth-wrap { padding: 32px 24px; min-height: 100vh; display: flex; flex-direction: column; background: linear-gradient(160deg,#F0EBFF 0%,#FBF8FF 60%,#FFF0F7 100%); }
  .auth-title { font-size: 28px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
  .auth-sub { font-size: 14px; color: var(--text3); margin-bottom: 32px; line-height: 1.5; font-weight: 500; }
  .google-btn { background: white; border: 1.5px solid var(--border2); border-radius: 14px; padding: 14px; display: flex; align-items: center; justify-content: center; gap: 10px; font-family: "Plus Jakarta Sans",sans-serif; font-size: 15px; font-weight: 700; color: var(--text2); cursor: pointer; width: 100%; margin-top: 10px; transition: border-color 0.2s; box-shadow: var(--shadow); }
  .google-btn:hover { border-color: var(--primary); }
  .divider-row { display: flex; align-items: center; gap: 10px; margin: 16px 0; }
  .divider-line { flex: 1; height: 1px; background: var(--border2); }
  .divider-text { font-size: 11px; color: var(--text3); font-weight: 700; letter-spacing: 0.5px; }
  .companion-edit-btn { position: absolute; top: 8px; right: 8px; background: white; border: 1.5px solid var(--border2); border-radius: 8px; padding: 4px 8px; font-size: 10px; color: var(--text2); cursor: pointer; font-family: "Plus Jakarta Sans",sans-serif; font-weight: 700; box-shadow: var(--shadow); }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`

// ─── DONUT CHART ──────────────────────────────────────────────────────────────

function DonutChart({ data, total, onSelect }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const strokeW = 28;

  let cumulative = 0;
  const segments = data.map((item) => {
    const pct = total > 0 ? item.amount / total : 0;
    const start = cumulative;
    cumulative += pct;
    return { ...item, pct, start };
  });

  function polarToXY(angle, radius) {
    const rad = (angle - 0.25) * 2 * Math.PI;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function arcPath(start, pct) {
    if (pct >= 1) pct = 0.9999;
    const s = polarToXY(start, r);
    const e = polarToXY(start + pct, r);
    const large = pct > 0.5 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => (
        <path
          key={i}
          d={arcPath(seg.start, seg.pct)}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          style={{ cursor: "pointer", transition: "stroke-width 0.2s" }}
          onClick={() => onSelect && onSelect(seg)}
        />
      ))}
      {segments.length === 0 && (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2A2622" strokeWidth={strokeW} />
      )}
    </svg>
  );
}

// ─── SPARKLINE ────────────────────────────────────────────────────────────────

function Sparkline({ prices, color }) {
  if (!prices || prices.length < 2) return <svg width="60" height="28" />;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const w = 60;
  const h = 28;
  const pts = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * w;
    const y = h - ((p - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h}>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_LOGS = [
  { id: 1, item: "Chicken rice", category: "food", price: 5.5, date: "2026-05-28", store: "Tian Tian", rating: 9 },
  { id: 2, item: "MRT monthly pass", category: "transport", price: 128, date: "2026-05-01" },
  { id: 3, item: "Groceries", category: "groceries", price: 67.4, date: "2026-05-25" },
  { id: 4, item: "Netflix", category: "entertainment", price: 15.98, date: "2026-05-01" },
  { id: 5, item: "Lunch set", category: "food", price: 12.8, date: "2026-05-27", store: "Kopitiam", rating: 7 },
  { id: 6, item: "Movie tickets", category: "going-out", price: 26, date: "2026-05-24" },
  { id: 7, item: "Groceries", category: "groceries", price: 45.2, date: "2026-05-18" },
  { id: 8, item: "Panadol", category: "health", price: 8.9, date: "2026-05-20" },
  { id: 9, item: "Kopi O", category: "food", price: 1.5, date: "2026-05-29", store: "Uncle's Stall", rating: 8 },
];

const PRICE_HISTORY = [
  { name: "Chicken Rice", prices: [4.5, 4.5, 5.0, 5.0, 5.5], trend: "up" },
  { name: "Kopi O", prices: [1.2, 1.2, 1.5, 1.5], trend: "up" },
  { name: "MRT Pass", prices: [128, 128, 128], trend: "flat" },
  { name: "Eggs (10 pcs)", prices: [3.2, 2.9, 2.8, 2.8], trend: "down" },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function PriceCheck() {
  const [phase, setPhase] = useState("splash"); // splash|budget|companion|auth|app
  const [budget, setBudget] = useState("");
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [tab, setTab] = useState("home");
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [showAlert, setShowAlert] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showCompanionEdit, setShowCompanionEdit] = useState(false);
  const [companionCustom, setCompanionCustom] = useState({});
  const [insightCard, setInsightCard] = useState(null);
  const [logForm, setLogForm] = useState({ item: "", category: "food", price: "", store: "", rating: null, note: "", date: "" });
  const [logMode, setLogMode] = useState("manual");
  const [scanLoading, setScanLoading] = useState(false);
  const [scanReview, setScanReview] = useState(false);
  const [scanItems, setScanItems] = useState([]);
  const [scanPreviewUrl, setScanPreviewUrl] = useState(null);
  const [scanError, setScanError] = useState(null);
  const cameraRef = useRef(null);
  const uploadRef = useRef(null);
  const [scenarioAnswered, setScenarioAnswered] = useState(null);
  const [authMode, setAuthMode] = useState("signup");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [resetConfirm, setResetConfirm] = useState(null); // null | "month" | "all" | "full"

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const todayIndex = today.getDate() % 30;
  const dailyFact = DAILY_FACTS[todayIndex];

  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}`;
  const viewMonthStr = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}`;
  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  // Filter logs for current month (home screen always shows current month)
  const thisMonthLogs = logs.filter(l => l.date && l.date.startsWith(currentMonthStr));
  // Filter logs for the viewed month (portfolio)
  const viewMonthLogs = logs.filter(l => l.date && l.date.startsWith(viewMonthStr));
  // Last month for comparison
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth()-1, 1);
  const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth()+1).padStart(2,"0")}`;
  const lastMonthLogs = logs.filter(l => l.date && l.date.startsWith(lastMonthStr));

  const totalSpent = thisMonthLogs.reduce((s, l) => s + l.price, 0);
  const viewMonthTotal = viewMonthLogs.reduce((s, l) => s + l.price, 0);
  const lastMonthTotal = lastMonthLogs.reduce((s, l) => s + l.price, 0);
  const momChange = lastMonthTotal > 0 ? Math.round(((viewMonthTotal - lastMonthTotal) / lastMonthTotal) * 100) : 0;

  const budgetNum = parseFloat(budget) || 2000;
  const budgetPct = getBudgetPct(totalSpent, budgetNum);
  const budgetColor = getBudgetColor(budgetPct);

  const companion = selectedCompanion
    ? COMPANIONS.find((c) => c.id === selectedCompanion)
    : null;

  const companionQuote = [
    "Your budget's looking healthy. Keep it up.",
    "Things are alright. Stay mindful.",
    "You've spent more than half. Slow down a little.",
    "Getting tight. Let's watch the next few days carefully.",
    "You're in the red. Time to stop spending.",
  ][getMoodIndex(budgetPct)];

  // Category spending — current month only for home/budget
  const catSpending = {};
  thisMonthLogs.forEach((l) => {
    catSpending[l.category] = (catSpending[l.category] || 0) + l.price;
  });
  // Category spending for viewed month (portfolio)
  const viewCatSpending = {};
  viewMonthLogs.forEach((l) => {
    viewCatSpending[l.category] = (viewCatSpending[l.category] || 0) + l.price;
  });

  const catBudgets = {
    food: budgetNum * 0.25,
    groceries: budgetNum * 0.15,
    transport: budgetNum * 0.12,
    entertainment: budgetNum * 0.08,
    travel: budgetNum * 0.05,
    health: budgetNum * 0.05,
    shopping: budgetNum * 0.1,
    "going-out": budgetNum * 0.08,
    education: budgetNum * 0.05,
    bills: budgetNum * 0.1,
    misc: budgetNum * 0.05,
  };

  function handleLogSave() {
    if (!logForm.item || !logForm.price) return;
    const newLog = { id: Date.now(), ...logForm, price: parseFloat(logForm.price), date: logForm.date || new Date().toISOString().slice(0, 10) };
    setLogs((prev) => [newLog, ...prev]);
    const cat = CATEGORIES.find((c) => c.id === logForm.category);
    const spent = catSpending[logForm.category] || 0;
    const limit = catBudgets[logForm.category] || budgetNum * 0.1;
    const pctUsed = Math.round(((spent + newLog.price) / limit) * 100);
    setInsightCard({
      icon: cat?.icon || "📦",
      title: `${cat?.label || logForm.category} Budget`,
      msg: `You've used ${pctUsed}% of your ${cat?.label.toLowerCase()} budget this month.`,
    });
    setLogForm({ item: "", category: "food", price: "", store: "", rating: null, note: "", date: "" });
    setTab("home");
  }

  async function handleReceiptImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setScanLoading(true);
    setScanError(null);
    setScanReview(false);
    setScanPreviewUrl(URL.createObjectURL(file));

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result.split(",")[1];
        const mediaType = file.type || "image/jpeg";

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{
              role: "user",
              content: [
                {
                  type: "image",
                  source: { type: "base64", media_type: mediaType, data: base64 }
                },
                {
                  type: "text",
                  text: `You are a receipt scanner. Extract ALL line items from this receipt.
Return ONLY a valid JSON array. No explanation, no markdown, just the raw JSON array.
Each object must have exactly these fields:
- "item": string (item name, keep it concise)
- "price": number (price as a number, no currency symbol)
- "category": one of exactly: food, groceries, transport, entertainment, travel, health, shopping, going-out, education, bills, misc
- "date": string in YYYY-MM-DD format (use today ${new Date().toISOString().slice(0,10)} if not visible)

Example output:
[{"item":"Chicken Rice","price":5.50,"category":"food","date":"2026-06-02"},{"item":"Milo","price":1.80,"category":"food","date":"2026-06-02"}]

If you cannot read the receipt clearly, return:
[{"item":"Unknown item","price":0,"category":"misc","date":"${new Date().toISOString().slice(0,10)}"}]`
                }
              ]
            }]
          })
        });

        const data = await response.json();
        const rawText = data.content?.find(b => b.type === "text")?.text || "[]";
        
        let parsed = [];
        try {
          const clean = rawText.replace(/```json|```/g, "").trim();
          parsed = JSON.parse(clean);
          if (!Array.isArray(parsed)) parsed = [parsed];
        } catch {
          parsed = [{ item: "Unread item", price: 0, category: "misc", date: new Date().toISOString().slice(0, 10) }];
        }

        const today = new Date().toISOString().slice(0, 10);
        const items = parsed.map((it, i) => ({
          id: Date.now() + i,
          item: it.item || "Unknown item",
          price: String(parseFloat(it.price) || 0),
          category: it.category || "misc",
          date: it.date || today,
          store: "",
          rating: null,
          note: ""
        }));

        setScanItems(items);
        setScanReview(true);
        setScanLoading(false);
      };
    } catch (err) {
      setScanError("Could not read receipt. Please try again or enter manually.");
      setScanLoading(false);
    }
    e.target.value = "";
  }

  function handleScanSave() {
    if (scanItems.length === 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const newLogs = scanItems.map((item, i) => ({
      ...item,
      id: Date.now() + i,
      price: parseFloat(item.price) || 0,
      date: item.date || today,
    }));
    setLogs(prev => [...newLogs, ...prev]);
    setInsightCard({
      icon: "🧾",
      title: "Receipt Logged",
      msg: `${newLogs.length} item${newLogs.length !== 1 ? "s" : ""} saved from your receipt. Total: $${newLogs.reduce((s, l) => s + l.price, 0).toFixed(2)}`,
    });
    setScanReview(false);
    setScanItems([]);
    setScanPreviewUrl(null);
    setLogMode("manual");
    setTab("home");
  }

  function handleAuthSubmit() {
    setIsGuest(false);
    setPhase("app");
  }

  const COMPANION_COLORS = ["#C4913A", "#E8A0A0", "#5BA87A", "#7AB0E8", "#C4A46B", "#CF72A0", "#A07DCF"];

  if (phase === "splash") {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="onboard-wrap">
            <div style={{ marginBottom: 32, opacity: 0.15 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="#C4913A" />
                <text x="40" y="52" textAnchor="middle" fontSize="32" fill="#1A1200" fontFamily="serif">$</text>
              </svg>
            </div>
            <div className="onboard-logo">Price Check</div>
            <div className="onboard-tagline">Your personal inflation tracker and financial companion.</div>
            <button className="btn-primary" onClick={() => setPhase("budget")}>Get Started</button>
          </div>
        </div>
      </>
    );
  }

  if (phase === "budget") {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="onboard-wrap" style={{ justifyContent: "flex-start", paddingTop: 60 }}>
            <div style={{ textAlign: "left", width: "100%" }}>
              <div style={{ fontSize: 13, color: "var(--text3)", fontWeight: 800, letterSpacing: "0.8px", marginBottom: 8 }}>STEP 1 OF 3</div>
              <div className="onboard-logo" style={{ fontSize: 28, marginBottom: 10 }}>What's your monthly budget?</div>
              <div style={{ fontSize: 14, color: "var(--text3)", lineHeight: 1.6, marginBottom: 32 }}>
                This is your personal limit. You can change it anytime.
              </div>
              <div className="budget-input-wrap">
                <span className="currency-label">$</span>
                <input
                  className="budget-input"
                  type="number"
                  placeholder="2000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <button className="btn-primary" onClick={() => setPhase("companion")} style={{ marginTop: 16 }}>Continue</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (phase === "companion") {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div style={{ padding: "60px 20px 20px" }}>
            <div style={{ fontSize: 13, color: "var(--text3)", fontWeight: 800, letterSpacing: "0.8px", marginBottom: 8 }}>STEP 2 OF 3</div>
            <div className="onboard-logo" style={{ fontSize: 24, marginBottom: 6 }}>Choose your companion</div>
            <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 20, lineHeight: 1.5 }}>
              They'll react to your budget health in real time.
            </div>
            <div className="companion-grid">
              {COMPANIONS.map((c) => (
                <div
                  key={c.id}
                  className={`companion-card ${selectedCompanion === c.id ? "selected" : ""}`}
                  onClick={() => setSelectedCompanion(c.id)}
                >
                  {c.render(75)}
                  <div className="companion-name">{c.name}</div>
                  <div className="companion-desc">{c.desc}</div>
                  {selectedCompanion === c.id && (
                    <div style={{ position: "absolute", top: 10, right: 10, width: 18, height: 18, background: "var(--amber)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1,5 4,8 9,2" stroke="#1A1200" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => setPhase("auth")} disabled={!selectedCompanion} style={{ opacity: selectedCompanion ? 1 : 0.4 }}>Continue</button>
          </div>
        </div>
      </>
    );
  }

  if (phase === "auth") {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="auth-wrap">
            <div className="auth-title">{authMode === "signup" ? "Create your account" : "Welcome back"}</div>
            <div className="auth-sub">Your data syncs across all devices when you're logged in.</div>
            <div className="form-field" style={{ margin: "0 0 14px" }}>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
            </div>
            <div className="form-field" style={{ margin: "0 0 20px" }}>
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={authPass} onChange={e => setAuthPass(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={handleAuthSubmit}>
              {authMode === "signup" ? "Create Account" : "Log In"}
            </button>
            <div className="divider-row">
              <div className="divider-line" />
              <div className="divider-text">OR</div>
              <div className="divider-line" />
            </div>
            <button className="google-btn">
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <button className="btn-secondary" onClick={() => { setIsGuest(true); setPhase("app"); }}>Maybe later</button>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button style={{ background: "none", border: "none", color: "var(--text3)", fontSize: 13, cursor: "pointer" }} onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")}>
                {authMode === "signup" ? "Already have an account? Log in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── MAIN APP ──
  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* PROFILE MODAL */}
        {showProfile && (
          <div className="modal-overlay" onClick={() => { setShowProfile(false); setResetConfirm(null); }}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "85vh", overflowY: "auto" }}>
              <div className="modal-handle" />
              <div className="modal-title">Your Profile</div>
              <div className="profile-stat">
                <div className="profile-stat-val">{logs.length}</div>
                <div className="profile-stat-label">Total Purchases Logged (All Time)</div>
              </div>
              <div className="profile-row">
                <span className="profile-row-label">This Month</span>
                <span className="profile-row-val">{thisMonthLogs.length} logs · ${totalSpent.toFixed(2)}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row-label">Member Since</span>
                <span className="profile-row-val">Jun 2026</span>
              </div>
              <div className="profile-row">
                <span className="profile-row-label">Companion</span>
                <span className="profile-row-val">{companionCustom.name || companion?.name || "—"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row-label">Monthly Budget</span>
                <span className="profile-row-val">${budgetNum.toFixed(0)}</span>
              </div>

              {/* RESET SECTION */}
              <div style={{ margin: "20px 20px 0", padding: "16px", background: "var(--bg2)", borderRadius: 14, border: "1.5px solid var(--border)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", letterSpacing: "0.6px", marginBottom: 12 }}>DATA MANAGEMENT</div>

                {!resetConfirm && (
                  <>
                    <button onClick={() => setResetConfirm("month")} style={{ width: "100%", background: "white", border: "1.5px solid var(--border2)", borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Clear This Month</div>
                        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Remove {MONTH_NAMES[today.getMonth()]} logs only</div>
                      </div>
                      <span style={{ fontSize: 16, color: "var(--text3)" }}>›</span>
                    </button>
                    <button onClick={() => setResetConfirm("all")} style={{ width: "100%", background: "white", border: "1.5px solid var(--border2)", borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--orange)" }}>Clear All Logs</div>
                        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Remove all purchases, keep settings</div>
                      </div>
                      <span style={{ fontSize: 16, color: "var(--text3)" }}>›</span>
                    </button>
                    <button onClick={() => setResetConfirm("full")} style={{ width: "100%", background: "white", border: "1.5px solid var(--red-mid)", borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--red)" }}>Full Reset</div>
                        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Wipe everything, restart onboarding</div>
                      </div>
                      <span style={{ fontSize: 16, color: "var(--red)" }}>›</span>
                    </button>
                  </>
                )}

                {resetConfirm && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 10 }}>
                      {resetConfirm === "month" ? "🗓️" : resetConfirm === "all" ? "🗑️" : "⚠️"}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                      {resetConfirm === "month" && `Clear ${MONTH_NAMES[today.getMonth()]} logs?`}
                      {resetConfirm === "all" && "Clear all purchase logs?"}
                      {resetConfirm === "full" && "Full reset? This cannot be undone."}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16, lineHeight: 1.5 }}>
                      {resetConfirm === "month" && `${thisMonthLogs.length} logs from this month will be removed.`}
                      {resetConfirm === "all" && `All ${logs.length} logs will be deleted. Your budget and companion stay.`}
                      {resetConfirm === "full" && "All data, settings and companion will be wiped. You will start fresh."}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setResetConfirm(null)} style={{ flex: 1, background: "white", border: "1.5px solid var(--border2)", borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 700, color: "var(--text2)", cursor: "pointer" }}>Cancel</button>
                      <button onClick={() => {
                        if (resetConfirm === "month") {
                          setLogs(prev => prev.filter(l => !l.date.startsWith(currentMonthStr)));
                        } else if (resetConfirm === "all") {
                          setLogs([]);
                        } else if (resetConfirm === "full") {
                          setLogs([]);
                          setBudget("");
                          setSelectedCompanion(null);
                          setCompanionCustom({});
                          setShowProfile(false);
                          setResetConfirm(null);
                          setPhase("splash");
                          return;
                        }
                        setResetConfirm(null);
                        setShowProfile(false);
                      }} style={{ flex: 1, background: resetConfirm === "full" ? "var(--red)" : "var(--orange-mid)", border: "none", borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 800, color: resetConfirm === "full" ? "white" : "var(--text)", cursor: "pointer" }}>
                        {resetConfirm === "full" ? "Yes, Reset" : "Confirm"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button className="btn-secondary" style={{ margin: "16px 20px 0" }} onClick={() => { setPhase("splash"); setShowProfile(false); setResetConfirm(null); }}>Log Out</button>
            </div>
          </div>
        )}

        {/* COMPANION EDIT MODAL */}
        {showCompanionEdit && (
          <div className="modal-overlay" onClick={() => setShowCompanionEdit(false)}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
              <div className="modal-handle" />
              <div className="modal-title">Customise {companion?.name}</div>
              <div className="form-field" style={{ margin: "0 0 14px" }}>
                <label className="form-label">Nickname</label>
                <input className="form-input" placeholder={companion?.name} value={companionCustom.name || ""} onChange={e => setCompanionCustom(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-field" style={{ margin: "0 0 14px" }}>
                <label className="form-label">Accent Color</label>
                <div className="color-row">
                  {COMPANION_COLORS.map(col => (
                    <div key={col} className={`color-swatch ${companionCustom.color === col ? "selected" : ""}`} style={{ background: col }} onClick={() => setCompanionCustom(p => ({ ...p, color: col }))} />
                  ))}
                </div>
              </div>
              <div className="form-field" style={{ margin: "0 0 20px" }}>
                <label className="form-label">Personal Note</label>
                <input className="form-input" placeholder="e.g. My frugal uncle who never wastes a cent" value={companionCustom.note || ""} onChange={e => setCompanionCustom(p => ({ ...p, note: e.target.value }))} />
              </div>
              <button className="btn-primary" onClick={() => setShowCompanionEdit(false)}>Save Changes</button>
            </div>
          </div>
        )}

        {/* INSIGHT CARD */}
        {insightCard && (
          <div className="insight-overlay" onClick={() => setInsightCard(null)}>
            <div className="insight-card" onClick={e => e.stopPropagation()}>
              <div className="insight-icon">{insightCard.icon}</div>
              <div className="insight-title">{insightCard.title}</div>
              <div className="insight-sub">{insightCard.msg}</div>
              <button className="btn-primary" onClick={() => setInsightCard(null)}>Got it</button>
            </div>
          </div>
        )}

        {/* ── HOME TAB ── */}
        {tab === "home" && (
          <div className="screen">
            <div className="home-header">
              <div className="home-logo">Price Check</div>
              <div className="profile-btn" onClick={() => setShowProfile(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </div>
            </div>

            {isGuest && (
              <div className="guest-banner">
                <div className="guest-text">Your progress is not saved yet.</div>
                <button className="guest-btn" onClick={() => setPhase("auth")}>Create Account</button>
              </div>
            )}

            {showAlert && (
              <div className="alert-banner" style={{ margin: "10px 20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: 1 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" style={{ marginTop: 1, flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <div className="alert-text">Kopi O is up $0.30 from your last log at Uncle's Stall.</div>
                </div>
                <button className="alert-dismiss" onClick={() => setShowAlert(false)}>✕</button>
              </div>
            )}

            <div className="companion-zone">
              <div style={{ position: "relative" }}>
                {companion ? companion.render(budgetPct) : <UncLimSVG mood={budgetPct} />}
                <button className="companion-edit-btn" onClick={() => setShowCompanionEdit(true)}>Edit</button>
              </div>
              <div className="companion-bubble">{companionCustom.note || companionQuote}</div>
            </div>

            <div className="budget-bar-wrap">
              <div className="budget-bar-labels">
                <div>
                  <div className="budget-bar-label">SPENT</div>
                  <div className="budget-bar-amount">${totalSpent.toFixed(0)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="budget-bar-label">BUDGET</div>
                  <div className="budget-bar-amount">${budgetNum.toFixed(0)}</div>
                </div>
              </div>
              <div className="budget-track">
                <div className="budget-fill" style={{ width: `${100 - budgetPct}%`, background: budgetColor }} />
              </div>
              <div style={{ textAlign: "center", marginTop: 6, fontSize: 11, color: "var(--text3)", fontWeight: 700 }}>
                {budgetPct}% remaining · {MONTH_NAMES[today.getMonth()]} {today.getFullYear()}
              </div>
            </div>

            <div className="daily-fact-card">
              <div className="fact-dot" />
              <div className="fact-text">{dailyFact}</div>
            </div>

            <div style={{ padding: "0 20px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 800, letterSpacing: "0.6px" }}>RECENT LOGS</div>
                <div style={{ fontSize: 11, color: "var(--primary)", fontWeight: 700 }}>{thisMonthLogs.length} this month</div>
              </div>
              {logs.slice(0, 5).map((log) => {
                const cat = CATEGORIES.find((c) => c.id === log.category);
                return (
                  <div key={log.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: `${cat?.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{cat?.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{log.item}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>{log.date}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Fredoka One'", fontSize: 15, color: "var(--text)" }}>${log.price.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── LOG TAB ── */}
        {tab === "log" && (
          <div className="screen">
            <div className="screen-header">
              <div className="back-btn" onClick={() => { setTab("home"); setLogMode("manual"); setScanReview(false); setScanItems([]); setScanPreviewUrl(null); setScanError(null); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              </div>
              <div className="screen-title">Log a Purchase</div>
            </div>

            <div className="log-tabs">
              <button className={`log-tab ${logMode === "manual" ? "active" : ""}`} onClick={() => setLogMode("manual")}>Enter Manually</button>
              <button className={`log-tab ${logMode === "scan" ? "active" : ""}`} onClick={() => { setLogMode("scan"); setScanLoading(false); setScanError(null); }}>Scan Receipt</button>
            </div>

            {/* SCAN MODE */}
            {logMode === "scan" && !scanReview && (
              <div style={{ padding: "0 16px" }}>
                {/* hidden file inputs */}
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleReceiptImage} />
                <input ref={uploadRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleReceiptImage} />

                <div style={{ background: "var(--bg2)", border: "1.5px dashed var(--border2)", borderRadius: 18, padding: "32px 20px", textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🧾</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>Snap or upload your receipt</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 24, lineHeight: 1.5 }}>AI will read the items and prices automatically. You can review and edit everything before saving.</div>

                  <button className="btn-primary" style={{ marginBottom: 10 }} onClick={() => cameraRef.current.click()}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      Take Photo
                    </span>
                  </button>
                  <button className="btn-secondary" onClick={() => uploadRef.current.click()}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Upload from Device
                    </span>
                  </button>
                </div>

                {scanLoading && scanPreviewUrl && (
                  <div style={{ background: "white", border: "1.5px solid var(--border)", borderRadius: 16, padding: "24px 20px", textAlign: "center", boxShadow: "var(--shadow)" }}>
                    <div style={{ fontSize: 24, marginBottom: 12 }}>🔍</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>Reading your receipt...</div>
                    <div style={{ fontSize: 12, color: "var(--text3)" }}>AI is extracting items and prices</div>
                    <div style={{ marginTop: 16, height: 4, background: "var(--bg3)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "70%", background: "var(--primary)", borderRadius: 4, animation: "pulse 1.5s ease-in-out infinite" }} />
                    </div>
                  </div>
                )}

                {scanError && (
                  <div style={{ background: "var(--red-bg)", border: "1.5px solid var(--red-mid)", borderRadius: 14, padding: "14px 16px", color: "var(--red)", fontSize: 13, fontWeight: 600 }}>
                    {scanError}
                  </div>
                )}
              </div>
            )}

            {/* SCAN REVIEW MODE */}
            {logMode === "scan" && scanReview && (
              <div style={{ padding: "0 16px" }}>
                {scanPreviewUrl && (
                  <div style={{ marginBottom: 14, borderRadius: 14, overflow: "hidden", border: "1.5px solid var(--border)" }}>
                    <img src={scanPreviewUrl} alt="Receipt" style={{ width: "100%", maxHeight: 180, objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ background: "var(--green-bg)", border: "1.5px solid var(--green-mid)", borderRadius: 14, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>✓</span>
                  <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 700 }}>Receipt read successfully. Review and edit below.</span>
                </div>

                {scanItems.map((item, idx) => (
                  <div key={idx} style={{ background: "white", border: "1.5px solid var(--border)", borderRadius: 14, padding: "14px 16px", marginBottom: 10, boxShadow: "var(--shadow)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text3)", letterSpacing: "0.5px" }}>ITEM {idx + 1}</div>
                      <button onClick={() => setScanItems(prev => prev.filter((_, i) => i !== idx))} style={{ background: "var(--red-bg)", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "var(--red)", fontWeight: 800, cursor: "pointer" }}>Remove</button>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", letterSpacing: "0.6px", marginBottom: 4 }}>ITEM NAME</div>
                      <input className="form-input" style={{ padding: "10px 12px" }} value={item.item} onChange={e => setScanItems(prev => prev.map((it, i) => i === idx ? { ...it, item: e.target.value } : it))} />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", letterSpacing: "0.6px", marginBottom: 4 }}>PRICE ($)</div>
                        <input className="form-input" style={{ padding: "10px 12px" }} type="number" value={item.price} onChange={e => setScanItems(prev => prev.map((it, i) => i === idx ? { ...it, price: e.target.value } : it))} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", letterSpacing: "0.6px", marginBottom: 4 }}>DATE</div>
                        <input className="form-input" style={{ padding: "10px 12px" }} type="date" value={item.date} onChange={e => setScanItems(prev => prev.map((it, i) => i === idx ? { ...it, date: e.target.value } : it))} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", letterSpacing: "0.6px", marginBottom: 6 }}>CATEGORY</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {CATEGORIES.map(cat => (
                          <button key={cat.id} onClick={() => setScanItems(prev => prev.map((it, i) => i === idx ? { ...it, category: cat.id } : it))}
                            style={{ padding: "5px 10px", borderRadius: 20, border: `1.5px solid ${item.category === cat.id ? cat.color : "var(--border2)"}`, background: item.category === cat.id ? `${cat.color}18` : "white", fontSize: 11, fontWeight: 700, color: item.category === cat.id ? cat.color : "var(--text3)", cursor: "pointer" }}>
                            {cat.icon} {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <button className="btn-primary" style={{ marginBottom: 10 }} onClick={handleScanSave}>
                  Save {scanItems.length} Item{scanItems.length !== 1 ? "s" : ""}
                </button>
                <button className="btn-secondary" onClick={() => { setScanReview(false); setScanItems([]); setScanPreviewUrl(null); }}>
                  Scan Again
                </button>
              </div>
            )}

            {/* MANUAL MODE */}
            {logMode === "manual" && (
              <>
                <div className="form-field">
                  <label className="form-label">Item Name</label>
                  <input className="form-input" placeholder="e.g. Chicken Rice" value={logForm.item} onChange={e => setLogForm(p => ({ ...p, item: e.target.value }))} />
                </div>

                <div style={{ margin: "0 0 14px" }}>
                  <div style={{ padding: "0 16px 6px", fontSize: 11, fontWeight: 800, color: "var(--text3)", letterSpacing: "0.8px", textTransform: "uppercase" }}>Category</div>
                  <div className="category-scroll">
                    {CATEGORIES.map((cat) => (
                      <div key={cat.id} className={`cat-chip ${logForm.category === cat.id ? "selected" : ""}`} style={{ color: cat.color }} onClick={() => setLogForm(p => ({ ...p, category: cat.id }))}>
                        <span>{cat.icon}</span> {cat.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Price</label>
                  <input className="form-input" type="number" placeholder="0.00" value={logForm.price} onChange={e => setLogForm(p => ({ ...p, price: e.target.value }))} />
                </div>

                <div className="form-field">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={logForm.date} onChange={e => setLogForm(p => ({ ...p, date: e.target.value }))} />
                </div>

                {logForm.category === "food" && (
                  <>
                    <div className="section-divider" />
                    <div style={{ padding: "0 16px", marginBottom: 14 }}>
                      <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 700, marginBottom: 12 }}>Food Details <span style={{ fontWeight: 500 }}>(optional)</span></div>
                      <div className="form-field" style={{ margin: "0 0 14px" }}>
                        <label className="form-label">Store or Place</label>
                        <input className="form-input" placeholder="e.g. Tian Tian Chicken Rice" value={logForm.store} onChange={e => setLogForm(p => ({ ...p, store: e.target.value }))} />
                      </div>
                      <div style={{ marginBottom: 14 }}>
                        <label className="form-label" style={{ display: "block", marginBottom: 8 }}>Value Rating</label>
                        <div className="rating-row">
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <button key={n} className={`rating-btn ${logForm.rating === n ? "selected" : ""}`} onClick={() => setLogForm(p => ({ ...p, rating: n }))}>{n}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Quick Note</label>
                        <input className="form-input" placeholder="One line about this meal..." maxLength={80} value={logForm.note} onChange={e => setLogForm(p => ({ ...p, note: e.target.value }))} />
                      </div>
                    </div>
                  </>
                )}

                <div style={{ padding: "4px 16px 20px" }}>
                  <button className="btn-primary" onClick={handleLogSave}>Save Log</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── PORTFOLIO TAB ── */}
        {tab === "portfolio" && (
          <div className="screen">
            <div className="month-selector">
              <div className="month-arrow" onClick={() => {
                const d = new Date(viewYear, viewMonth - 1, 1);
                setViewMonth(d.getMonth());
                setViewYear(d.getFullYear());
              }}>‹</div>
              <div className="month-label">{MONTH_NAMES[viewMonth]} {viewYear}</div>
              <div className="month-arrow" onClick={() => {
                const d = new Date(viewYear, viewMonth + 1, 1);
                if (d <= today) { setViewMonth(d.getMonth()); setViewYear(d.getFullYear()); }
              }} style={{ opacity: (viewMonth === today.getMonth() && viewYear === today.getFullYear()) ? 0.3 : 1 }}>›</div>
            </div>

            {viewMonthLogs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>No logs for {MONTH_NAMES[viewMonth]}</div>
                <div style={{ fontSize: 13 }}>Start logging purchases to see your spending breakdown here.</div>
              </div>
            ) : (<>
            <div className="stat-pills">
              <div className="stat-pill">
                <div className="stat-pill-val">${viewMonthTotal.toFixed(0)}</div>
                <div className="stat-pill-label">TOTAL LOGGED</div>
              </div>
              <div className="stat-pill">
                <div className="stat-pill-val" style={{ fontSize: 13 }}>
                  {(() => { const top = CATEGORIES.find(c => viewCatSpending[c.id] === Math.max(...Object.values(viewCatSpending))); return top ? `${top.icon} ${top.label}` : "—"; })()}
                </div>
                <div className="stat-pill-label">BIGGEST CAT</div>
              </div>
              <div className="stat-pill">
                <div className="stat-pill-val" style={{ color: momChange >= 0 ? "var(--red)" : "var(--green)" }}>
                  {momChange >= 0 ? "+" : ""}{momChange}%
                </div>
                <div className="stat-pill-label">VS LAST MONTH</div>
              </div>
            </div>

            <div className="donut-wrap">
              <DonutChart
                data={CATEGORIES.filter(c => viewCatSpending[c.id]).map(c => ({ ...c, amount: viewCatSpending[c.id] || 0 }))}
                total={viewMonthTotal}
              />
              <div className="donut-center">
                <div className="donut-total">${viewMonthTotal.toFixed(0)}</div>
                <div className="donut-label">{MONTH_NAMES[viewMonth].toUpperCase()}</div>
              </div>
            </div>

            <div className="cat-breakdown">
              {CATEGORIES.filter(c => viewCatSpending[c.id]).map((cat) => {
                const spent = viewCatSpending[cat.id] || 0;
                const limit = catBudgets[cat.id] || budgetNum * 0.1;
                const pct = Math.round((spent / limit) * 100);
                const status = pct < 80 ? "on-track" : pct < 100 ? "watch-out" : "overspending";
                const statusLabel = pct < 80 ? "On Track" : pct < 100 ? "Watch Out" : "Overspending";
                return (
                  <div key={cat.id} className="cat-card">
                    <div className="cat-card-row">
                      <div className="cat-card-name">
                        <span style={{ fontSize: 16 }}>{cat.icon}</span>
                        <span style={{ color: cat.color }}>{cat.label}</span>
                      </div>
                      <div className="cat-card-amount">${spent.toFixed(2)}</div>
                    </div>
                    <div className="cat-bar-track">
                      <div className="cat-bar-fill" style={{ width: `${Math.min(100, pct)}%`, background: cat.color }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "var(--text3)" }}>{pct}% of budget</span>
                      <span className={`status-tag ${status}`}>{statusLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            </>)}

            <div style={{ padding: "8px 20px 0" }}>
              <div style={{ fontFamily: "'Fredoka One'", fontSize: 17, color: "var(--text)", marginBottom: 12 }}>Where your money quietly goes</div>
            </div>
            <div className="intel-card">
              <div className="intel-title">Overspend Watch</div>
              <div className="intel-row">
                <span className="intel-name">🍜 Food</span>
                <span className="intel-detail">Try cooking 2x more per week — saves ~$80/mo</span>
              </div>
              <div className="intel-row">
                <span className="intel-name">🎬 Entertainment</span>
                <span className="intel-detail">3 subscriptions detected. Review unused ones.</span>
              </div>
            </div>

            <div style={{ padding: "8px 20px 0" }}>
              <div style={{ fontFamily: "'Fredoka One'", fontSize: 17, color: "var(--text)", marginBottom: 12 }}>Food Intelligence</div>
            </div>
            <div className="intel-card">
              <div className="intel-title">Best Value</div>
              <div className="intel-row">
                <span className="intel-name">Chicken Rice @ Tian Tian</span>
                <span className="intel-detail">Rating 9 · $5.50</span>
              </div>
              <div className="intel-row">
                <span className="intel-name">Kopi O @ Uncle's Stall</span>
                <span className="intel-detail">Rating 8 · $1.50</span>
              </div>
            </div>
            <div className="intel-card" style={{ marginBottom: 20 }}>
              <div className="intel-title">Price Creep Detected</div>
              <div className="intel-row">
                <span className="intel-name" style={{ color: "var(--red)" }}>Kopi O</span>
                <span className="intel-detail">Up twice in 3 months</span>
              </div>
            </div>
          </div>
        )}

        {/* ── DIGEST TAB ── */}
        {tab === "digest" && (
          <div className="screen">
            <div style={{ padding: "24px 20px 16px" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 800, letterSpacing: "0.8px", marginBottom: 10 }}>WEEK OF MAY 26 – JUN 1</div>
              <div className="digest-headline">Quiet week — your wallet survived.</div>
            </div>

            <div className="digest-grid">
              <div className="digest-card">
                <div className="digest-card-label">SPENT THIS WEEK</div>
                <div className="digest-card-val">$94</div>
                <div className="digest-card-sub" style={{ color: "var(--green)" }}>▼ 12% vs last week</div>
              </div>
              <div className="digest-card">
                <div className="digest-card-label">BIGGEST CATEGORY</div>
                <div className="digest-card-val" style={{ fontSize: 16 }}>🛒 Groceries</div>
                <div className="digest-card-sub">$67.40</div>
              </div>
              <div className="digest-card">
                <div className="digest-card-label">PRICE HIKE CAUGHT</div>
                <div className="digest-card-val" style={{ fontSize: 16 }}>Kopi O</div>
                <div className="digest-card-sub" style={{ color: "var(--red)" }}>+$0.30 ↑</div>
              </div>
              <div className="digest-card">
                <div className="digest-card-label">BUDGET USED</div>
                <div className="digest-card-val">{Math.round((1 - budgetPct / 100) * 100)}%</div>
                <div className="digest-card-sub">of monthly limit</div>
              </div>
            </div>

            <div className="digest-insight">
              You spent 12% less than last week. Most of that came from fewer restaurant visits. Your grocery run on the 25th was your biggest single spend.
            </div>

            <div style={{ padding: "20px 20px 0" }}>
              <div style={{ fontFamily: "'Fredoka One'", fontSize: 17, color: "var(--text)", marginBottom: 14 }}>Same week, last month</div>
              <div className="cat-card">
                <div className="cat-card-row">
                  <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600 }}>Total Spent</div>
                  <div style={{ fontFamily: "'Fredoka One'", fontSize: 15, color: "var(--text)" }}>$107</div>
                </div>
                <div className="cat-card-row" style={{ marginBottom: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600 }}>Biggest Category</div>
                  <div style={{ fontSize: 13, color: "var(--text3)" }}>🍜 Food ($52)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── LEARN TAB ── */}
        {tab === "learn" && (
          <div className="screen">
            <div style={{ padding: "24px 20px 16px" }}>
              <div className="screen-title">Learn</div>
              <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 4 }}>Day 1 of 365 · Money Foundations</div>
            </div>

            <div className="lesson-card">
              <div className="lesson-header">
                <span className="lesson-day-badge">Day 1</span>
                <span className="lesson-module">Money Foundations</span>
              </div>
              <div className="lesson-title">{LESSONS[0].title}</div>
              <div className="lesson-body">{LESSONS[0].body}</div>
            </div>

            <div className="scenario-card">
              <div className="scenario-label">Daily Scenario</div>
              <div className="scenario-prompt">{SCENARIOS[0].prompt}</div>
              {SCENARIOS[0].options.map((opt, i) => (
                <button
                  key={i}
                  className={`scenario-option ${scenarioAnswered !== null ? opt.quality : ""}`}
                  onClick={() => scenarioAnswered === null && setScenarioAnswered(i)}
                  style={scenarioAnswered !== null && scenarioAnswered !== i && opt.quality !== "best" ? { opacity: 0.5 } : {}}
                >
                  {opt.text}
                </button>
              ))}
              {scenarioAnswered !== null && (
                <>
                  <div className="explanation-box">{SCENARIOS[0].explanation}</div>
                  <div className="reflection-box">💭 {SCENARIOS[0].reflection}</div>
                </>
              )}
            </div>

            <div style={{ padding: "0 20px 8px" }}>
              <div style={{ fontFamily: "'Fredoka One'", fontSize: 17, color: "var(--text)", marginBottom: 4 }}>Future Self Calculator</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16, lineHeight: 1.5 }}>If you invested your average monthly overspend of $94 at 7% annual return:</div>
            </div>

            <div className="future-calc">
              <div className="future-result-cards">
                {[{ y: 5, val: 658 }, { y: 10, val: 1553 }, { y: 20, val: 4909 }].map(r => (
                  <div key={r.y} className="future-result">
                    <div className="future-result-years">{r.y} YRS</div>
                    <div className="future-result-val">${r.val.toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="future-motivate">$94/month quietly invested becomes real wealth. The boring choice pays the most.</div>
            </div>

            <div style={{ padding: "0 20px 8px" }}>
              <div style={{ fontFamily: "'Fredoka One'", fontSize: 17, color: "var(--text)", marginBottom: 14 }}>Lesson Calendar</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: 8,
                    background: i === 0 ? "var(--amber)" : i < 0 ? "rgba(91,168,122,0.3)" : "var(--bg3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: i === 0 ? "#1A1200" : "var(--text3)",
                    border: i === 0 ? "none" : "1px solid var(--border)",
                  }}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PRICE TRACKER (accessible from home) ── */}
        {tab === "tracker" && (
          <div className="screen">
            <div className="screen-header">
              <div className="back-btn" onClick={() => setTab("home")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              </div>
              <div className="screen-title">Price Tracker</div>
            </div>

            <div className="inflation-badge">
              <div>
                <div className="inflation-label">YOUR PERSONAL INFLATION</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>vs. last month</div>
              </div>
              <div className="inflation-rate">+4.2%</div>
            </div>

            <div style={{ padding: "20px 20px 12px" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 800, letterSpacing: "0.6px" }}>TRACKED ITEMS</div>
            </div>

            {PRICE_HISTORY.map((item, i) => (
              <div key={i} className="price-item">
                <div className="price-item-info">
                  <div className="price-item-name">{item.name}</div>
                  <div className="price-item-detail">
                    ${item.prices[0].toFixed(2)} → ${item.prices[item.prices.length - 1].toFixed(2)}
                  </div>
                </div>
                <Sparkline prices={item.prices} color={item.trend === "up" ? "#E87A7A" : item.trend === "down" ? "#5BA87A" : "#7A726A"} />
                <div className={`price-change ${item.trend === "up" ? "up" : item.trend === "down" ? "down" : ""}`}>
                  {item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "—"}
                  {item.trend !== "flat" && `$${Math.abs(item.prices[item.prices.length - 1] - item.prices[0]).toFixed(2)}`}
                </div>
              </div>
            ))}

            <div style={{ padding: "8px 20px 0" }}>
              <div style={{ fontFamily: "'Fredoka One'", fontSize: 17, color: "var(--text)", marginBottom: 12 }}>Best Value Comparison</div>
            </div>
            <div className="intel-card" style={{ marginBottom: 20 }}>
              <div className="intel-title">Chicken Rice — 2 Stores</div>
              <div className="intel-row">
                <div>
                  <div className="intel-name">Tian Tian</div>
                  <div className="intel-detail">$5.50 · Rating 9/10</div>
                </div>
                <span className="status-tag on-track">Best Value</span>
              </div>
              <div className="intel-row">
                <div>
                  <div className="intel-name">Kopitiam</div>
                  <div className="intel-detail">$4.80 · Rating 6/10</div>
                </div>
                <span className="status-tag watch-out">Lower Rating</span>
              </div>
            </div>
          </div>
        )}

        {/* ── BOTTOM NAV ── */}
        <div className="bottom-nav">
          <button className={`nav-item ${tab === "home" ? "active" : ""}`} onClick={() => setTab("home")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="nav-label">Home</span>
          </button>

          <button className={`nav-item ${tab === "portfolio" ? "active" : ""}`} onClick={() => setTab("portfolio")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="nav-label">Portfolio</span>
          </button>

          <div className="nav-fab" onClick={() => setTab("log")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1200" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>

          <button className={`nav-item ${tab === "digest" ? "active" : ""}`} onClick={() => setTab("digest")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8L4 6v14a2 2 0 002 2z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/>
            </svg>
            <span className="nav-label">Digest</span>
          </button>

          <button className={`nav-item ${tab === "learn" ? "active" : ""}`} onClick={() => setTab("learn")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
            <span className="nav-label">Learn</span>
          </button>
        </div>
      </div>
    </>
  );
}
