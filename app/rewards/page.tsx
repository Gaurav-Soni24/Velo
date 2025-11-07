"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useVelo } from "@/context/velo-context"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Trophy, Star, Zap } from "lucide-react"

export default function RewardsPage() {
  const { points, level } = useVelo()
  const [showRedeemModal, setShowRedeemModal] = useState(false)

  const badges = [
    { name: "Bronze", minPoints: 0, icon: Trophy, color: "text-amber-700" },
    { name: "Silver", minPoints: 50, icon: Star, color: "text-gray-400" },
    { name: "Gold", minPoints: 100, icon: Trophy, color: "text-yellow-500" },
  ]

  const currentBadge = badges.find((b) => b.name.toLowerCase() === level)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Your Rewards</h1>

          {/* Points Display */}
          <Card className="p-8 mb-12 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary">
            <div className="text-center">
              <p className="text-foreground/60 mb-4">Current Points</p>
              <p className="text-6xl font-bold text-primary mb-4">{points}</p>
              <div className="w-full bg-border rounded-full h-2 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((points / 100) * 100, 100)}%` }}
                  transition={{ duration: 1 }}
                  className="bg-primary h-2 rounded-full"
                />
              </div>
              <p className="text-foreground/60">{Math.max(0, 100 - points)} points until Gold</p>
            </div>
          </Card>

          {/* Badges */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Achievement Badges</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {badges.map((badge, idx) => {
                const Icon = badge.icon
                const isUnlocked = points >= badge.minPoints
                const isCurrent = badge.name.toLowerCase() === level

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card
                      className={`p-8 text-center border-2 transition ${
                        isUnlocked
                          ? isCurrent
                            ? "border-primary bg-primary/10"
                            : "border-border"
                          : "border-border opacity-50"
                      }`}
                    >
                      <div className={`inline-flex p-4 rounded-full mb-4 ${isUnlocked ? "bg-primary/20" : "bg-muted"}`}>
                        <Icon className={`w-8 h-8 ${isUnlocked ? badge.color : "text-foreground/30"}`} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{badge.name}</h3>
                      <p className="text-foreground/60 mb-4 text-sm">{badge.minPoints}+ points</p>
                      {isCurrent && (
                        <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                          Current Level
                        </div>
                      )}
                      {isUnlocked && !isCurrent && (
                        <div className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full">
                          Unlocked
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Redeem Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Redeem Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Free Ride", points: 50, description: "Unlock a complimentary 30-minute ride" },
                { title: "Double Points", points: 75, description: "Earn 2x points on your next 5 rides" },
              ].map((reward, idx) => (
                <Card key={idx} className="p-6 border-2 border-border hover:border-primary/50 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{reward.title}</h3>
                      <p className="text-foreground/60 text-sm mt-1">{reward.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-bold">
                      <Zap className="w-4 h-4" />
                      {reward.points}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRedeemModal(true)}
                    disabled={points < reward.points}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Redeem
                  </button>
                </Card>
              ))}
            </div>
          </div>

          {/* Redeem Modal */}
          {showRedeemModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-background rounded-lg p-6 max-w-md w-full text-center"
              >
                <h3 className="text-2xl font-bold mb-4 text-foreground">Confirm Redeem</h3>
                <p className="text-foreground/60 mb-6">Are you sure you want to redeem this reward?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRedeemModal(false)}
                    className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg font-semibold hover:bg-secondary/90 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowRedeemModal(false)
                      alert("Reward redeemed successfully!")
                    }}
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
