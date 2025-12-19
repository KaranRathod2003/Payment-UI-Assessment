import { type Component, Show, createSignal, onMount } from "solid-js"
import type { ReceiptData } from "../types/payment"

const Receipt: Component = () => {
  const [data, setData] = createSignal<ReceiptData | null>(null)
  const [loading, setLoading] = createSignal(true)

  onMount(() => {
    // localStorage se data retrieve karo
    const stored = localStorage.getItem('paymentReceipt')
    
    if (!stored) {
      // Agar data nahi mila, form page pe redirect karo
      window.location.href = "/"
      return
    }

    try {
      const parsed = JSON.parse(stored)
      setData(parsed)
    } catch (error) {
      console.error("Error parsing receipt data:", error)
      window.location.href = "/"
    } finally {
      setLoading(false)
    }
  })

  const handleNewPayment = () => {
    // Clear localStorage and redirect
    localStorage.removeItem('paymentReceipt')
    window.location.href = "/"
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Show 
      when={!loading() && data()} 
      fallback={
        <div class="text-center text-gray-500">Loading...</div>
      }
    >
      <div class="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6">
        {/* Success Header */}
        <div class="text-center">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-800">Payment Successful!</h2>
          <p class="text-gray-500 mt-2">Your transaction has been completed</p>
        </div>

        {/* Divider */}
        <div class="border-t border-gray-200"></div>

        {/* Transaction Details */}
        <div class="space-y-4">
          <div class="flex justify-between">
            <span class="text-gray-600">Name</span>
            <span class="font-semibold text-gray-800">{data()?.name}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-600">Card Number</span>
            <span class="font-mono text-gray-800">{data()?.maskedCard}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-600">Expiry Date</span>
            <span class="font-semibold text-gray-800">{data()?.expiryDate}</span>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-gray-600">Amount</span>
            <span class="text-2xl font-bold text-green-600">₹{data()?.amount}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-600">Status</span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ✓ {data()?.status}
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-600">Transaction ID</span>
            <span class="font-mono text-sm text-gray-800">{data()?.transactionId}</span>
          </div>
        </div>

        {/* Divider */}
        <div class="border-t border-gray-200"></div>

        {/* Timestamp */}
        <p class="text-sm text-center text-gray-500">
          {data()?.timestamp && formatDate(data()!.timestamp)}
        </p>

        {/* Action Button */}
        <button 
          onClick={handleNewPayment}
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-200"
        >
          Make Another Payment
        </button>

        {/* Footer Note */}
        <p class="text-xs text-center text-gray-400">
          Thank you for your payment!
        </p>
      </div>
    </Show>
  )
}

export default Receipt
