"use client"

import dynamic from "next/dynamic"

const EnhancedGame = dynamic(() => import("../EnhancedGame"), {
  ssr: false,
  loading: () => (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-center" aria-busy="true">
      <div>
        <p className="font-semibold text-teal-800">Ładowanie przestrzeni nauki…</p>
      </div>
    </main>
  ),
})

export default function SyntheticV0PageForDeployment() {
  return <EnhancedGame />
}
