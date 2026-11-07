"use client";

import dynamic from "next/dynamic";

const Leaves = dynamic(() => import("./leaves"), { ssr: false });

export default function LeavesLazy() {
  return <Leaves />;
}