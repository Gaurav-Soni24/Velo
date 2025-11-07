"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useVelo } from "@/context/velo-context"

interface QRModalProps {
  isOpen: boolean
  onClose: () => void
  stationName: string
}

export function QRModal({ isOpen, onClose, stationName }: QRModalProps) {
  const [scanning, setScanning] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const { startRide } = useVelo()

  const handleScan = async () => {
    setScanning(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setScanning(false)
    setUnlocked(true)
    startRide(stationName)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onClose()
    setUnlocked(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-2xl p-8 max-w-md w-full"
          >
            <div className="text-center">
              {!scanning && !unlocked && (
                <>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Scan QR Code</h2>
                  <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center mb-6">
                    <svg className="w-24 h-24 text-foreground/40" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M3 9V5a2 2 0 0 1 2-2h4M21 9v-4a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4"
                      />
                    </svg>
                  </div>
                  <p className="text-foreground/60 mb-6">Point your camera at the QR code</p>
                  <button
                    onClick={handleScan}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
                  >
                    Start Scan
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full mt-3 bg-secondary text-secondary-foreground py-3 rounded-lg font-semibold hover:bg-secondary/90 transition"
                  >
                    Cancel
                  </button>
                </>
              )}

              {scanning && (
                <div className="py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-24 h-24 mx-auto border-4 border-primary/20 border-t-primary rounded-full"
                  />
                  <p className="mt-6 text-foreground font-semibold">Scanning...</p>
                </div>
              )}

              {unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">✓</span>
                  </div>
                  <p className="text-2xl font-bold text-primary mb-2">Cycle Unlocked</p>
                  <p className="text-foreground/60">Enjoy your ride at {stationName}!</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
