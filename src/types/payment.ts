export interface PaymentFormData{
    name : string,
    cardNumber : string,
    expiryDate : string,   // i dont recall about date formating in (MM/YY)
    cvv : string
    amount : number
}

export interface ReceiptData extends PaymentFormData{
    transactionId : string,
    maskedCard : string, // somthing here
    status : 'success',
    timestamp : string 
}

export interface ValidationErrors {
  name?: string
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  amount?: string
}