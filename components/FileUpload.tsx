"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, X, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FileUploadProps {
  onFileUpload: (file: File) => void
  onFileRemove: () => void
  uploadedFile: File | null
  isUploading: boolean
  contactCount: number
}

export default function FileUpload({
  onFileUpload,
  onFileRemove,
  uploadedFile,
  isUploading,
  contactCount,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) onFileUpload(file)
    },
    [onFileUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <Card className="overflow-hidden backdrop-blur-sm bg-white/70 border-0 shadow-xl shadow-purple-100/50">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Upload className="w-5 h-5 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800">Upload Contacts</h2>
          </div>

          <AnimatePresence mode="wait">
            {!uploadedFile ? (
              <motion.div
                key="upload-zone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  isDragOver
                    ? "border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 scale-105"
                    : "border-gray-300 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-25 hover:to-pink-25"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={isDragOver ? { scale: 1.1, y: -10 } : { scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center"
                    whileHover={{ rotate: 10 }}
                  >
                    <FileText className="w-10 h-10 text-purple-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Drop your CSV file here</h3>
                  <p className="text-gray-600 mb-6 text-lg">or click to browse from your device</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      onClick={() => document.getElementById("file-input")?.click()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Choose File
                    </Button>
                  </motion.div>
                  <p className="text-sm text-gray-500 mt-4">Only CSV files are supported • Max 10MB</p>
                  <input
                    id="file-input"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="uploaded-file"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative"
              >
                {isUploading ? (
                  <motion.div
                    className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                    >
                      <Loader2 className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Processing your file...</h3>
                    <p className="text-gray-600">Please wait while we parse your CSV data</p>
                    <motion.div
                      className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center"
                          whileHover={{ rotate: 5 }}
                        >
                          <CheckCircle className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{uploadedFile.name}</h3>
                          <p className="text-green-600 font-medium">
                            {contactCount} contacts loaded • Ready for enrichment
                          </p>
                        </div>
                      </div>
                      <motion.button
                        onClick={onFileRemove}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors group"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
