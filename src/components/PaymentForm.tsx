import type { PaymentFormData, ValidationErrors } from "../types/payment"
import { generateTransactionId, maskCardNumber } from "../stores/paymentStore"
import { createSignal, Show, type Component } from "solid-js"

const PaymentForm: Component = () => {
  const [form, setForm] = createSignal<PaymentFormData>({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    amount: 0
  })

  const [errors, setErrors] = createSignal<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = createSignal(false)

  function validateForm(): boolean {
    const newErrors: ValidationErrors = {}

    
    if (!form().name.trim()) {
      newErrors.name = "Name is required"
    }

    
    const cardNum = form().cardNumber.replace(/\s/g, "")
    if (!cardNum) {
      newErrors.cardNumber = "Card number is required"
    } else if (cardNum.length !== 16 || !/^\d+$/.test(cardNum)) {
      newErrors.cardNumber = "Card number must be 16 digits"
    }

    
    if (!form().expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required"
    } else if (!/^\d{2}\/\d{2}$/.test(form().expiryDate)) {
      newErrors.expiryDate = "Format must be MM/YY"
    }

    
    if (!form().cvv.trim()) {
      newErrors.cvv = "CVV is required"
    } else if (form().cvv.length !== 3 || !/^\d+$/.test(form().cvv)) {
      newErrors.cvv = "CVV must be 3 digits"
    }

    
    if (form().amount <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: Event) {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    
    const receipt = {
      name: form().name,
      cardNumber: form().cardNumber,
      expiryDate: form().expiryDate,
      cvv: form().cvv,
      amount: Number(form().amount),
      transactionId: generateTransactionId(),
      maskedCard: maskCardNumber(form().cardNumber.replace(/\s/g, "")),
      status: 'success' as const,
      timestamp: new Date().toISOString()
    }

    
    localStorage.setItem('paymentReceipt', JSON.stringify(receipt))
    
    
    setTimeout(() => {
      window.location.href = "/receipt"
    }, 500)
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <form
        onSubmit={handleSubmit}
        class="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6"
      >
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-800">Payment Details</h2>
          <p class="text-gray-500 mt-2">Enter your card information</p>
        </div>

        {/* Name Field */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Name on Card
          </label>
          <input
            type="text"
            placeholder="User 1"
            class="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={form().name}
            onInput={(e) => setForm({ ...form(), name: e.currentTarget.value })}
          />
          <Show when={errors().name}>
            <p class="text-red-500 text-sm mt-1">⚠ {errors().name}</p>
          </Show>
        </div>

        {/* Card Number Field */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <input
            type="text"
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            class="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={form().cardNumber}
            onInput={(e) => {
              let value = e.currentTarget.value.replace(/\s/g, "")
              if (value.length > 16) value = value.slice(0, 16)
              // Add space every 4 digits
              value = value.match(/.{1,4}/g)?.join(" ") || value
              setForm({ ...form(), cardNumber: value })
            }}
          />
          <Show when={errors().cardNumber}>
            <p class="text-red-500 text-sm mt-1">⚠ {errors().cardNumber}</p>
          </Show>
        </div>

        {/* Expiry & CVV */}
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              maxLength={5}
              class="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={form().expiryDate}
              onInput={(e) => {
                let value = e.currentTarget.value.replace(/\D/g, "")
                if (value.length >= 2) {
                  value = value.slice(0, 2) + "/" + value.slice(2, 4)
                }
                setForm({ ...form(), expiryDate: value })
              }}
            />
            <Show when={errors().expiryDate}>
              <p class="text-red-500 text-sm mt-1">⚠ {errors().expiryDate}</p>
            </Show>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <input
              type="password"
              placeholder="123"
              maxLength={3}
              class="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={form().cvv}
              onInput={(e) => {
                const value = e.currentTarget.value.replace(/\D/g, "").slice(0, 3)
                setForm({ ...form(), cvv: value })
              }}
            />
            <Show when={errors().cvv}>
              <p class="text-red-500 text-sm mt-1">⚠ {errors().cvv}</p>
            </Show>
          </div>
        </div>

        {/* Amount Field */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Payment Amount (₹)
          </label>
          <input
            type="number"
            placeholder="1000"
            min="1"
            class="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={form().amount || ""}
            onInput={(e) =>
              setForm({ ...form(), amount: Number(e.currentTarget.value) })
            }
          />
          <Show when={errors().amount}>
            <p class="text-red-500 text-sm mt-1">⚠ {errors().amount}</p>
          </Show>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting()}
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting() ? "Processing..." : "Pay Now"}
        </button>

        <p class="text-xs text-center text-gray-500 mt-4">
          🔒 Your payment information is secure
        </p>
      </form>
    </div>
  )
}

export default PaymentForm