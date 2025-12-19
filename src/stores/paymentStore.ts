import { createStore } from "solid-js/store";
import type { PaymentFormData, ReceiptData } from "../types/payment";


export const [receiptData, setReceiptData] = createStore<Partial<ReceiptData>>({})

export function generateTransactionId() : string{
    const prefix = "KYR"
    const timestamp = Date.now()
    const randomPart = Math.random().toString(36).substring(2, 9)
    
    return `${prefix}-${timestamp}-${randomPart}`
} 

export function maskCardNumber(cardNumber: string): string {
    const lastFour = cardNumber.slice(-4)

    const maskedPart = "*".repeat(12)

    const combined = maskedPart +  lastFour

    return `${combined.slice(0, 4)} ${combined.slice(4, 8)} ${combined.slice(8, 12)} ${combined.slice(12)}`
}

export function savePaymentData(formData : PaymentFormData){
  const receipt: ReceiptData = {
    
    ...formData,

    transactionId: generateTransactionId(),  
    maskedCard: maskCardNumber(formData.cardNumber),  
    status: 'success',  
    timestamp: new Date().toISOString()  
  }
  
  // Step 2: Store mein save
  setReceiptData(receipt)
}