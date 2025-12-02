import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [variant, setVariant] = useState('')

  useEffect(() => {
    fetch(import.meta.env.VITE_API + '/products/' + id)
      .then(res => res.json())
      .then(setProduct)
  }, [])

  const checkout = () => {
    fetch(import.meta.env.VITE_API + '/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, variantId: variant })
    })
      .then(res => res.json())
      .then(data => window.location.href = data.payment_url)
  }

  if (!product) return "Loading..."

  return (
    <div className="p-6">
      <img src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/600'} className="rounded" />
      <h1 className="text-xl font-bold mt-3">{product.name}</h1>

      <select className="border p-2 mt-4" onChange={e => setVariant(e.target.value)}>
        <option value="">Pilih Varian</option>
        {product.variants.map(v => (
          <option value={v.id} key={v.id}>{v.name} — Rp{v.price}</option>
        ))}
      </select>

      <button className="bg-blue-500 text-white p-3 rounded mt-3 w-full" onClick={checkout}>Checkout</button>
    </div>
  )
}
