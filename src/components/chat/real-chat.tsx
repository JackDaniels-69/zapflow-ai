"use client";

import { useState } from "react";

export default function RealChat({ companyId }: { companyId: string }) {
  const [input, setInput] = useState("");

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <p>Company: {companyId}</p>
    </div>
  );
}