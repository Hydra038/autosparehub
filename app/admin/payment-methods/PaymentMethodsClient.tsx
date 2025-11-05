'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

interface PaymentMethod {
  id: string
  name: string
  type: 'paypal' | 'bank_transfer' | 'iban' | 'cash' | 'other'
  is_enabled: boolean
  instructions: string | null
  config: any
  display_order: number
}

interface Props {
  initialMethods: PaymentMethod[]
}

export default function PaymentMethodsClient({ initialMethods }: Props) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialMethods)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const supabase = createClient()

  const refreshMethods = async () => {
    const { data } = await supabase
      .from('payment_methods')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (data) {
      setPaymentMethods(data)
    }
  }

  const handleToggleActive = async (id: string) => {
    setLoading(id)
    const method = paymentMethods.find(pm => pm.id === id)
    if (!method) return

    const { error } = await supabase
      .from('payment_methods')
      .update({ is_enabled: !method.is_enabled })
      .eq('id', id)

    if (error) {
      console.error('Error toggling payment method:', error)
      alert('Failed to update payment method')
    } else {
      await refreshMethods()
    }
    setLoading(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return

    setLoading(id)
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting payment method:', error)
      alert('Failed to delete payment method')
    } else {
      await refreshMethods()
    }
    setLoading(null)
  }

  const handleEdit = (pm: PaymentMethod) => {
    setIsEditing(pm.id)
    setEditForm({ ...pm })
  }

  const handleSave = async () => {
    if (!editForm) return
    
    setLoading(editForm.id)
    const { error } = await supabase
      .from('payment_methods')
      .update({
        name: editForm.name,
        type: editForm.type,
        instructions: editForm.instructions,
        config: editForm.config,
      })
      .eq('id', editForm.id)

    if (error) {
      console.error('Error updating payment method:', error)
      alert('Failed to update payment method')
    } else {
      await refreshMethods()
      setIsEditing(null)
      setEditForm(null)
    }
    setLoading(null)
  }

  const handleCancel = () => {
    setIsEditing(null)
    setEditForm(null)
  }

  const handleAddNew = async () => {
    setLoading('new')
    const newMethod = {
      name: 'New Payment Method',
      type: 'other' as const,
      is_enabled: false,
      instructions: '',
      config: {},
      display_order: paymentMethods.length + 1,
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .insert([newMethod])
      .select()
      .single()

    if (error) {
      console.error('Error creating payment method:', error)
      alert('Failed to create payment method')
    } else if (data) {
      await refreshMethods()
      handleEdit(data)
    }
    setLoading(null)
  }

  const updateConfigField = (key: string, value: string) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        config: { ...editForm.config, [key]: value },
      })
    }
  }

  const addConfigField = () => {
    if (editForm) {
      const newKey = `Field ${Object.keys(editForm.config || {}).length + 1}`
      setEditForm({
        ...editForm,
        config: { ...editForm.config, [newKey]: '' },
      })
    }
  }

  const removeConfigField = (key: string) => {
    if (editForm) {
      const newConfig = { ...editForm.config }
      delete newConfig[key]
      setEditForm({ ...editForm, config: newConfig })
    }
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Payment Methods</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage available payment methods for your store
          </p>
        </div>
        <button 
          onClick={handleAddNew} 
          disabled={loading === 'new'}
          className="btn-primary text-sm sm:text-base w-full sm:w-auto disabled:opacity-50"
        >
          {loading === 'new' ? 'Creating...' : '+ Add Payment Method'}
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((pm) => (
          <div
            key={pm.id}
            className={`rounded-lg border p-6 ${
              !pm.is_enabled ? 'bg-gray-50 opacity-60' : 'bg-white'
            }`}
          >
            {isEditing === pm.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Payment Method Name
                    </label>
                    <input
                      type="text"
                      value={editForm?.name || ''}
                      onChange={(e) =>
                        setEditForm(
                          editForm ? { ...editForm, name: e.target.value } : null
                        )
                      }
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Type</label>
                    <select
                      value={editForm?.type || 'other'}
                      onChange={(e) =>
                        setEditForm(
                          editForm
                            ? {
                                ...editForm,
                                type: e.target.value as PaymentMethod['type'],
                              }
                            : null
                        )
                      }
                      className="input w-full"
                    >
                      <option value="paypal">PayPal</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="iban">IBAN</option>
                      <option value="cash">Cash</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Instructions
                  </label>
                  <textarea
                    value={editForm?.instructions || ''}
                    onChange={(e) =>
                      setEditForm(
                        editForm
                          ? { ...editForm, instructions: e.target.value }
                          : null
                      )
                    }
                    rows={3}
                    className="input w-full"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium">Payment Details</label>
                    <button
                      onClick={addConfigField}
                      className="text-sm text-primary hover:underline"
                    >
                      + Add Field
                    </button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(editForm?.config || {}).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <input
                          type="text"
                          value={key}
                          onChange={(e) => {
                            const newConfig = { ...editForm?.config }
                            delete newConfig[key]
                            newConfig[e.target.value] = value
                            setEditForm(
                              editForm ? { ...editForm, config: newConfig } : null
                            )
                          }}
                          placeholder="Field name"
                          className="input w-1/3"
                        />
                        <input
                          type="text"
                          value={value as string}
                          onChange={(e) => updateConfigField(key, e.target.value)}
                          placeholder="Field value"
                          className="input flex-1"
                        />
                        <button
                          onClick={() => removeConfigField(key)}
                          className="btn-secondary px-3"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleSave} 
                    disabled={loading === editForm?.id}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading === editForm?.id ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={handleCancel} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <h3 className="text-lg sm:text-xl font-semibold">{pm.name}</h3>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          pm.is_enabled
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {pm.is_enabled ? 'Active' : 'Disabled'}
                      </span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-700">
                        {pm.type.replace('_', ' ')}
                      </span>
                    </div>
                    {pm.instructions && (
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                        {pm.instructions}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleToggleActive(pm.id)}
                      disabled={loading === pm.id}
                      className="btn-secondary text-xs sm:text-sm flex-1 sm:flex-none disabled:opacity-50"
                    >
                      {loading === pm.id ? 'Updating...' : (pm.is_enabled ? 'Disable' : 'Enable')}
                    </button>
                    <button
                      onClick={() => handleEdit(pm)}
                      className="btn-secondary text-xs sm:text-sm flex-1 sm:flex-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pm.id)}
                      disabled={loading === pm.id}
                      className="btn-secondary text-xs sm:text-sm text-red-600 flex-1 sm:flex-none disabled:opacity-50"
                    >
                      {loading === pm.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                  <h4 className="mb-2 text-xs sm:text-sm font-medium">Payment Details:</h4>
                  <div className="space-y-1 text-xs sm:text-sm">
                    {Object.entries(pm.config || {}).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="font-mono text-gray-900 break-all">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {paymentMethods.length === 0 && (
          <div className="rounded-lg border p-12 text-center">
            <p className="mb-4 text-muted-foreground">
              No payment methods configured yet
            </p>
            <button onClick={handleAddNew} className="btn-primary">
              Add Your First Payment Method
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
