import { useEffect, useState } from 'react'

export default function Dashboard(){
  const [products,setProducts] = useState([])
  useEffect(()=>{ fetch(import.meta.env.VITE_API + '/admin/products', {headers:{Authorization:'Bearer '+localStorage.getItem('token')}}).then(r=>r.json()).then(setProducts) },[])
  return <div className="p-6">
    <h1 className="text-2xl mb-4">Admin Dashboard</h1>
    {products.map(p=> <div key={p._id} className="border p-2 mb-2">{p.name}</div>)}
  </div>
}
