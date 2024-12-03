'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useStore, { formatCurrency } from '../store/useStore'

type Category =
  | "electronics"
  | "clothing"
  | "groceries"
  | "home"
  | "other"
  | "beauty"
  | "entertainment"
  | "fitness"
  | "health"
  | "education"
  | "travel"
  | "automotive"
  | "services"
  | "pets"
  | "subscriptions"
  | "investments";

const categories: { value: Category; label: string }[] = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "groceries", label: "Groceries" },
  { value: "home", label: "Home" },
  { value: "beauty", label: "Beauty & Personal Care" },
  { value: "entertainment", label: "Entertainment" },
  { value: "fitness", label: "Fitness & Sports" },
  { value: "health", label: "Health & Wellness" },
  { value: "education", label: "Education & Books" },
  { value: "travel", label: "Travel & Tourism" },
  { value: "automotive", label: "Automotive" },
  { value: "services", label: "Services" },
  { value: "pets", label: "Pet Supplies" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "investments", label: "Investments" },
];

export function DiscountCalculator() {
  const { addSimulation, updateSimulation, calculateDiscount } = useStore()
  const [id, setId] = useState<string | null>(null)
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState(0)
  const [store, setStore] = useState('')
  const [category, setCategory] = useState('')
  const [installments, setInstallments] = useState(1)
  const [interestRate, setInterestRate] = useState(10.58)
  const [results, setResults] = useState<ReturnType<typeof calculateDiscount>>([])

  useEffect(() => {
    setResults(calculateDiscount(price, installments, interestRate))
  }, [price, installments, calculateDiscount])

  const handleSubmit = () => {
    const simulation = {
      productName,
      price,
      store,
      category,
      interestRate,
      installments,
    }

    if (id) {
      updateSimulation({ ...simulation, id, results })
    } else {
      addSimulation(simulation)
    }

    resetForm()
  }

  const resetForm = () => {
    setId(null)
    setProductName('')
    setPrice(0)
    setStore('')
    setCategory('')
    setInstallments(1)
  }

  const totalOriginalValue = results.reduce((sum, result) => sum + result.originalValue, 0)
  const totalDiscountedValue = results.reduce((sum, result) => sum + result.discountedValue, 0)
  const totalDiscount = results.reduce((sum, result) => sum + result.discount, 0)


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Discount Calculator</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="productName">1. Product Name</Label>
          <Input
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="store">2. Store</Label>
          <Input
            id="store"
            value={store}
            onChange={(e) => setStore(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="category">3. Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="price">4. Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="installments">5. Installments</Label>
          <Input
            id="installments"
            type="number"
            value={installments}
            onChange={(e) => setInstallments(parseInt(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="interestRate">6. Anual Interest Rate (%)</Label>
          <Input
            disabled
            id="interestRate"
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <Button onClick={handleSubmit}>
        {id ? 'Update Simulation' : 'Save Simulation'}
      </Button>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Installment</TableHead>
            <TableHead>Original Value</TableHead>
            <TableHead>Discounted Value</TableHead>
            <TableHead>Discount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.installment}>
              <TableCell>{result.installment}</TableCell>
              <TableCell>{formatCurrency(result.originalValue)}</TableCell>
              <TableCell>{formatCurrency(result.discountedValue)}</TableCell>
              <TableCell>{formatCurrency(result.discount)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="font-bold">
            <TableCell>Total</TableCell>
            <TableCell>{formatCurrency(totalOriginalValue)}</TableCell>
            <TableCell>{formatCurrency(totalDiscountedValue)}</TableCell>
            <TableCell>{formatCurrency(totalDiscount)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}