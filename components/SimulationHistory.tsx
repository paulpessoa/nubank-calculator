'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Simulation {
  productName: string
  price: number
  store: string
  category: string
  totalValue: number
  installments: number
  interestRate: number
  results: SimulationResult[]
}

interface SimulationResult {
  installment: number
  originalValue: number
  discountedValue: number
  discount: number
}

export function SimulationHistory() {
  const [simulations, setSimulations] = useState<Simulation[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingSimulation, setEditingSimulation] = useState<Simulation | null>(null)

  useEffect(() => {
    const savedSimulations = JSON.parse(localStorage.getItem('simulations') || '[]');
    console.log("Loaded simulations:", savedSimulations); // Adicione este log
    setSimulations(savedSimulations);
  }, []);

  const startEditing = (index: number) => {
    setEditingIndex(index)
    setEditingSimulation({ ...simulations[index] })
  }

  const saveEdit = () => {
    if (editingIndex !== null && editingSimulation) {
      const updatedSimulations = [...simulations]
      updatedSimulations[editingIndex] = editingSimulation
      setSimulations(updatedSimulations)
      localStorage.setItem('simulations', JSON.stringify(updatedSimulations))
      setEditingIndex(null)
      setEditingSimulation(null)
    }
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditingSimulation(null)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Simulation History</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Installments</TableHead>
            <TableHead>Interest Rate</TableHead>
            <TableHead>Total Discount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {simulations.map((simulation, index) => (
            <TableRow key={index}>
              {editingIndex === index ? (
                <>
                  <TableCell>
                    <Input
                      value={editingSimulation?.productName}
                      onChange={(e) => setEditingSimulation({ ...editingSimulation!, productName: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editingSimulation?.price}
                      onChange={(e) => setEditingSimulation({ ...editingSimulation!, price: parseFloat(e.target.value) })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editingSimulation?.store}
                      onChange={(e) => setEditingSimulation({ ...editingSimulation!, store: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={editingSimulation?.category}
                      onValueChange={(value) => setEditingSimulation({ ...editingSimulation!, category: value })}
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
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editingSimulation?.installments}
                      onChange={(e) => setEditingSimulation({ ...editingSimulation!, installments: parseInt(e.target.value) })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingSimulation?.interestRate}
                      onChange={(e) => setEditingSimulation({ ...editingSimulation!, interestRate: parseFloat(e.target.value) })}
                    />
                  </TableCell>
                  <TableCell>
                    {editingSimulation?.results.reduce((sum, result) => sum + result.discount, 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button onClick={saveEdit} className="mr-2">Save</Button>
                    <Button onClick={cancelEdit} variant="outline">Cancel</Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{simulation.productName}</TableCell>
                  <TableCell>{simulation.price.toFixed(2)}</TableCell>
                  <TableCell>{simulation.store}</TableCell>
                  <TableCell>{simulation.category}</TableCell>
                  <TableCell>{simulation.installments}</TableCell>
                  <TableCell>{simulation.interestRate.toFixed(2)}%</TableCell>
                  <TableCell>
                    {simulation.results.reduce((sum, result) => sum + result.discount, 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => startEditing(index)}>Edit</Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

