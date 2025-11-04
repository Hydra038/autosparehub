'use client'

import { useState } from 'react'
import Link from 'next/link'

interface PaymentMethod {
  id: string
  name: string
  type: 'paypal' | 'bank_transfer' | 'iban' | 'other'
  is_active: boolean
  details: {
    [key: string]: string
  }
  instructions?: string
}

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      name: 'PayPal',
      type: 'paypal',
      is_active: true,
      details: {
        'PayPal Email': 'payments@autosparehub.eu',
      },
      instructions: 'Send payment to our PayPal account with your order number in the note.',
    },
    {
      id: '2',
      name: 'Bank Transfer',
      type: 'bank_transfer',
      is_active: true,
      details: {
        'Bank Name': 'Deutsche Bank AG',
        'Account Holder': 'Autospare Hub GmbH',
        'IBAN': 'DE89 3704 0044 0532 0130 00',
        'BIC/SWIFT': 'COBADEFFXXX',
      },
      instructions: 'Transfer the total amount and include your order number as reference. Processing takes 1-3 business days.',
    },
    {
      id: '3',
      name: 'IBAN Direct Transfer',
      type: 'iban',
      is_active: true,
      details: {
        'Account Holder': 'Autospare Hub GmbH',
        'IBAN': 'DE89 3704 0044 0532 0130 00',
        'BIC': 'COBADEFFXXX',
        'Bank': 'Deutsche Bank AG',
      },
      instructions: 'Use your order number as the payment reference for faster processing.',
    },
  ])

  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<PaymentMethod | null>(null)

  const handleToggleActive = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((pm) =>
        pm.id === id ? { ...pm, is_active: !pm.is_active } : pm
      )
    )
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id))
    }
  }

  const handleEdit = (pm: PaymentMethod) => {
    setIsEditing(pm.id)
    setEditForm({ ...pm })
  }

  const handleSave = () => {
    if (editForm) {
      setPaymentMethods(
        paymentMethods.map((pm) => (pm.id === editForm.id ? editForm : pm))
      )
      setIsEditing(null)
      setEditForm(null)
    }
  }

  const handleCancel = () => {
    setIsEditing(null)
    setEditForm(null)
  }

  const handleAddNew = () => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      name: 'New Payment Method',
      type: 'other',
      is_active: false,
      details: {},
      instructions: '',
    }
    setPaymentMethods([...paymentMethods, newMethod])
    handleEdit(newMethod)
  }

  const updateDetail = (key: string, value: string) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        details: { ...editForm.details, [key]: value },
      })
    }
  }

  const addDetailField = () => {
    if (editForm) {
      const newKey = `Field ${Object.keys(editForm.details).length + 1}`
      setEditForm({
        ...editForm,
        details: { ...editForm.details, [newKey]: '' },
      })
    }
  }

  const removeDetailField = (key: string) => {
    if (editForm) {
      const newDetails = { ...editForm.details }
      delete newDetails[key]
      setEditForm({ ...editForm, details: newDetails })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          <p className="text-muted-foreground">
            Manage available payment methods for your store
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAddNew} className="btn-primary">
            + Add Payment Method
          </button>
          <Link href="/admin" className="btn-secondary">
            Back to Admin
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((pm) => (
          <div
            key={pm.id}
            className={`rounded-lg border p-6 ${
              !pm.is_active ? 'bg-gray-50 opacity-60' : 'bg-white'
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
                      onClick={addDetailField}
                      className="text-sm text-primary hover:underline"
                    >
                      + Add Field
                    </button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(editForm?.details || {}).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <input
                          type="text"
                          value={key}
                          onChange={(e) => {
                            const newDetails = { ...editForm?.details }
                            delete newDetails[key]
                            newDetails[e.target.value] = value
                            setEditForm(
                              editForm ? { ...editForm, details: newDetails } : null
                            )
                          }}
                          placeholder="Field name"
                          className="input w-1/3"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateDetail(key, e.target.value)}
                          placeholder="Field value"
                          className="input flex-1"
                        />
                        <button
                          onClick={() => removeDetailField(key)}
                          className="btn-secondary px-3"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleSave} className="btn-primary">
                    Save Changes
                  </button>
                  <button onClick={handleCancel} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{pm.name}</h3>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          pm.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {pm.is_active ? 'Active' : 'Disabled'}
                      </span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-700">
                        {pm.type.replace('_', ' ')}
                      </span>
                    </div>
                    {pm.instructions && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {pm.instructions}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(pm.id)}
                      className="btn-secondary text-sm"
                    >
                      {pm.is_active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleEdit(pm)}
                      className="btn-secondary text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pm.id)}
                      className="btn-secondary text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 text-sm font-medium">Payment Details:</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(pm.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="font-mono text-gray-900">{value}</span>
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
