"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Zap, Loader2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface EnrichmentControlsProps {
  onStartEnrichment: () => void
  isEnriching: boolean
  progress: number
  contactCount: number
  enrichedCount: number
}

export default function EnrichmentControls({
  onStartEnrichment,
  isEnriching,
  progress,
  contactCount,
  enrichedCount,
}: EnrichmentControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-8"
    >
      <Card className="overflow-hidden backdrop-blur-sm bg-white/70 border-0 shadow-xl shadow-blue-100/50">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800">Enrichment Controls</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={onStartEnrichment}
                disabled={isEnriching}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl"
              >
                {isEnriching ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Loader2 className="w-6 h-6 mr-3" />
                    </motion.div>
                    Enriching Magic...
                  </>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.2 }}>
                      <Play className="w-6 h-6 mr-3" />
                    </motion.div>
                    Start Enrichment
                  </>
                )}
              </Button>
            </motion.div>

            <div className="flex items-center gap-8">
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {enrichedCount}/{contactCount}
                </div>
                <div className="text-sm text-gray-600 font-medium">Contacts Enriched</div>
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {isEnriching && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 space-y-4"
              >
                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>Enrichment Progress</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="relative">
                  <Progress value={progress} className="h-3 bg-gray-200" />
                  <motion.div
                    className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <motion.p
                  className="text-center text-gray-600 text-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  ✨ API's are working its magic on your contacts...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
