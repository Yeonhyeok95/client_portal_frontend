export type Article = {
  cat: "Markets" | "Planning" | "Tax";
  title: string;
  blurb: string;
  meta: string;
  gradient: string;
};

export const articles: Article[] = [
  {
    cat: "Markets",
    title: "What a normal rate regime asks of a portfolio",
    blurb:
      "Cash pays again. That changes the job of every other asset in the account.",
    meta: "June 2026 · 6 min read",
    gradient: "linear-gradient(135deg, rgb(219,190,255), rgb(142,194,242))",
  },
  {
    cat: "Planning",
    title: "The estate exemption after 2026: acting without haste",
    blurb:
      "The sunset arrived. What still works, what closed, and what was never urgent.",
    meta: "May 2026 · 9 min read",
    gradient: "linear-gradient(135deg, rgb(255,208,196), rgb(219,190,255))",
  },
  {
    cat: "Tax",
    title: "Charitable lead trusts in a higher-rate world",
    blurb:
      "Higher hurdle rates cut both ways. When the CLT still earns its complexity.",
    meta: "April 2026 · 7 min read",
    gradient: "linear-gradient(135deg, rgb(142,194,242), rgb(196,242,220))",
  },
  {
    cat: "Markets",
    title: "Concentration risk and the reluctant seller",
    blurb:
      "On founders, low-basis stock, and unwinding a position without regret.",
    meta: "March 2026 · 8 min read",
    gradient: "linear-gradient(135deg, rgb(196,242,220), rgb(142,194,242))",
  },
  {
    cat: "Planning",
    title: "A letter to the rising generation",
    blurb:
      "What we ask families to put in writing before wealth changes hands.",
    meta: "February 2026 · 5 min read",
    gradient: "linear-gradient(135deg, rgb(255,224,178), rgb(255,208,196))",
  },
  {
    cat: "Tax",
    title: "Municipal bonds and the case for boring",
    blurb:
      "After-tax yield is the only yield. A note on the quiet part of the portfolio.",
    meta: "January 2026 · 6 min read",
    gradient: "linear-gradient(135deg, rgb(219,190,255), rgb(255,208,196))",
  },
];
