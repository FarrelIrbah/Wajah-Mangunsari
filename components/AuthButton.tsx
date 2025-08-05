"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function AuthButton() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        setIsOpen(false)
        setEmail("")
        setPassword("")
        router.push("/admin")
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login")
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={() => router.push("/admin")} className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>Dashboard</span>
        </Button>
        <Button variant="outline" onClick={handleSignOut} size="icon">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <User className="w-4 h-4" />
          <span>Masuk</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Masuk ke Dashboard Admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mangunsari.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
