'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useStore, { formatCurrency } from '../store/useStore'

export function SimulationHistory() {
  const { simulations, updateSimulation, deleteSimulation, calculateDiscount } = useStore()
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = (id: string) => {
    const simulation = simulations.find(sim => sim.id === id)
    if (simulation) {
      const results = calculateDiscount(simulation.price, simulation.installments, simulation.interestRate)
      updateSimulation({ ...simulation, results })
    }
    setEditingId(null)
  }

  const handleChange = (id: string, field: string, value: string | number) => {
    const simulation = simulations.find(sim => sim.id === id)
    if (simulation) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (simulation as any)[field] = value
      updateSimulation(simulation)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Simulation History</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Installments</TableHead>
            <TableHead>Total Discount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {simulations.map((simulation) => (
            <TableRow key={simulation.id}>
              <TableCell>
                {editingId === simulation.id ? (
                  <Input
                    value={simulation.productName}
                    onChange={(e) => handleChange(simulation.id, 'productName', e.target.value)}
                  />
                ) : (
                  simulation.productName
                )}
              </TableCell>
              <TableCell>
                {editingId === simulation.id ? (
                  <Input
                    type="number"
                    value={simulation.price}
                    onChange={(e) => handleChange(simulation.id, 'price', parseFloat(e.target.value))}
                  />
                ) : (
                  formatCurrency(simulation.price)
                )}
              </TableCell>
              <TableCell>
                {editingId === simulation.id ? (
                  <Input
                    value={simulation.store}
                    onChange={(e) => handleChange(simulation.id, 'store', e.target.value)}
                  />
                ) : (
                  simulation.store
                )}
              </TableCell>
              <TableCell>
                {editingId === simulation.id ? (
                  <Select
                    value={simulation.category}
                    onValueChange={(value) => handleChange(simulation.id, 'category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="groceries">Groceries</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  simulation.category
                )}
              </TableCell>
              <TableCell>
                {editingId === simulation.id ? (
                  <Input
                    type="number"
                    value={simulation.installments}
                    onChange={(e) => handleChange(simulation.id, 'installments', parseInt(e.target.value))}
                  />
                ) : (
                  simulation.installments
                )}
              </TableCell>
              <TableCell>
                {formatCurrency(
                  simulation.results.reduce((sum, result) => sum + result.discount, 0)
                )}
              </TableCell>
              <TableCell>
                {editingId === simulation.id ? (
                  <Button onClick={() => handleSave(simulation.id)}>Save</Button>
                ) : (
                  <Button onClick={() => handleEdit(simulation.id)}>Edit</Button>
                )}
                <Button onClick={() => deleteSimulation(simulation.id)} variant="destructive" className="ml-2">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}