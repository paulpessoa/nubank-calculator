import { persist } from "zustand/middleware";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

// Interfaces for type safety
interface Simulation {
  id: string;
  productName: string;
  price: number;
  store: string;
  category: string;
  installments: number;
  interestRate: number;
  results: SimulationResult[];
}

interface SimulationResult {
  installment: number;
  originalValue: number;
  discountedValue: number;
  discount: number;
}

interface Store {
  simulations: Simulation[];
  addSimulation: (simulation: Omit<Simulation, "id" | "results">) => void;
  updateSimulation: (simulation: Simulation) => void;
  deleteSimulation: (id: string) => void;
  calculateDiscount: (
    price: number,
    installments: number,
    interestRate: number
  ) => SimulationResult[];
}

// Currency formatting utility
const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const useStore = create<Store>()(
  persist(
    (set, get) => ({
      simulations: [],
      addSimulation: (newSimulation) => {
        const id = uuidv4();
        const results = get().calculateDiscount(
          newSimulation.price,
          newSimulation.installments,
          newSimulation.interestRate
        );
        set((state) => ({
          simulations: [
            ...state.simulations,
            { ...newSimulation, id, results },
          ],
        }));
      },
      updateSimulation: (updatedSimulation) => {
        set((state) => ({
          simulations: state.simulations.map((sim) =>
            sim.id === updatedSimulation.id ? updatedSimulation : sim
          ),
        }));
      },
      deleteSimulation: (id) => {
        set((state) => ({
          simulations: state.simulations.filter((sim) => sim.id !== id),
        }));
      },
      calculateDiscount: (price, installments, interestRate) => {
        const monthlyInterestRate =
          Math.pow(1 + interestRate / 100, 1 / 12) - 1;
        const results: SimulationResult[] = [];
        const installmentValue = price / installments;

        for (let i = 1; i <= installments; i++) {
          const discountFactor = Math.pow(1 + monthlyInterestRate, -i);
          const discountedValue = installmentValue * discountFactor;
          const discount = installmentValue - discountedValue;

          results.push({
            installment: i,
            originalValue: installmentValue,
            discountedValue,
            discount,
          });
        }

        return results;
      },
    }),
    {
      name: "nubank-calculator-storage",
    }
  )
);

// Export additional utility for formatting
export { formatCurrency };
export default useStore;
