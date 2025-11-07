"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.message.trim()) newErrors.message = "Message is required"
    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true)
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setSubmitted(false), 5000)
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-foreground/60 mb-12">Get in touch with the Velo team. We'd love to hear from you!</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  value: "hello@velo.city",
                },
                {
                  icon: Phone,
                  title: "Phone",
                  value: "+1 (555) 123-4567",
                },
                {
                  icon: MapPin,
                  title: "Address",
                  value: "123 Eco Street, Green City, NY 10001",
                },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <Card key={idx} className="p-6 border border-border">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                        <p className="text-foreground/60">{item.value}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8 border border-border">
                {submitted && (
                  <div className="mb-6 p-4 bg-primary/10 border border-primary rounded-lg text-primary font-semibold text-center">
                    Thank you! We'll get back to you soon.
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-foreground font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground ${
                        errors.name ? "border-destructive" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-foreground font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground ${
                        errors.email ? "border-destructive" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-foreground font-semibold mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground ${
                        errors.message ? "border-destructive" : "border-border"
                      } focus:outline-none focus:ring-2 focus:ring-primary resize-none`}
                      rows={5}
                      placeholder="Your message..."
                    />
                    {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition"
                  >
                    Send Message
                  </button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
