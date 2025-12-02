import { Link } from "react-router-dom"

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="shadow p-3 rounded-lg">
      <img src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300'} className="rounded mb-2" />
      <h2 className="font-bold">{product.name}</h2>
    </Link>
  )
}
