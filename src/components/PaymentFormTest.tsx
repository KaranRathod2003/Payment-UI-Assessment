import { createSignal, type Component } from "solid-js"

const PaymentFormTest: Component = () => {
  const [count, setCount] = createSignal(0)

  return (
    <div style={{ padding: "40px", }}>
      <p>PaymentForm Test Loaded ✅</p>
      <button
        onClick={() => setCount(count() + 1)}
        style={{  padding: "10px" }}
      >
        Click {count()}
      </button>
    </div>
  )
}

export default PaymentFormTest
