import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin(){
  const [email,setEmail]=useState(''), [password,setPassword]=useState('')
  const nav = useNavigate()
  const submit = async (e) => {
    e.preventDefault()
    const res = await fetch(import.meta.env.VITE_API + '/admin/login', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password})
    })
    if(res.ok){
      const j = await res.json()
      localStorage.setItem('token', j.token)
      nav('/admin')
    } else alert('Login failed')
  }
  return (
    <form className="p-6" onSubmit={submit}>
      <input className="border p-2 w-full mb-2" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" className="border p-2 w-full mb-2" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-green-600 text-white p-2 rounded">Login</button>
    </form>
  )
}
