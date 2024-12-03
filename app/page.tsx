import { DiscountCalculator } from "@/components/DiscountCalculator";
import { SimulationHistory } from "@/components/SimulationHistory";

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-100">
      <header className="bg-purple-700 text-white p-4">
        <h1 className="text-2xl font-bold">Nubank Discount Calculator</h1>
      </header>
      <main className="container mx-auto p-4">
        <DiscountCalculator />
        <div className="mt-8">
          <SimulationHistory />
        </div>
      </main>
    </div>
  )
}

