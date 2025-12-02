import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch(import.meta.env.VITE_API + '/products')
      .then(res => res.json())
      .then(setProducts)
  }, [])

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  )
}
