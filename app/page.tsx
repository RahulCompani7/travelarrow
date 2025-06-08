"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Users, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import FileUpload from "@/components/FileUpload"
import EnrichmentControls from "@/components/EnrichmentControls"
import ResultsTable from "@/components/ResultsTable"
import StatsCards from "@/components/StatsCards"
import Papa from "papaparse"

export interface Contact {
  id: string
  full_name?: string
  first_name?: string
  last_name?: string
  title?: string
  email?: string
  linkedin_url?: string
  company_name?: string
  company_domain?: string
  company_description?: string
  status: "pending" | "in-progress" | "enriched" | "error"
  enrichedFields: string[]
  cost: number
}

const mockEnrichmentCosts = {
  serpapi: 0.05,
  scrapin: 0.1,
  scrapeowl: 0.08,
  openai: 0.02,
  anymailfinder: 0.15,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

export default function PersonEnricher() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isEnriching, setIsEnriching] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [enrichedCount, setEnrichedCount] = useState(0)
  const { toast } = useToast()

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file only.",
          variant: "destructive",
        })
        return
      }

      setIsUploading(true)
      setUploadedFile(file)

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      Papa.parse(file, {
        header: true,
        complete: (results:any) => {
          const parsedContacts: Contact[] = results.data
            .map((row: any, index:any) => ({
              id: `contact-${index}`,
              full_name: row.full_name || "",
              first_name: row.first_name || "",
              last_name: row.last_name || "",
              title: row.title || "",
              email: row.email || "",
              linkedin_url: row.linkedin_url || "",
              company_name: row.company_name || "",
              company_domain: row.company_domain || "",
              company_description: row.company_description || "",
              status: "pending",
              enrichedFields: [],
              cost: 0,
            }))
            .filter((contact:any) => contact.full_name || contact.first_name || contact.last_name)

          setContacts(parsedContacts)
          setIsUploading(false)
          toast({
            title: "File uploaded successfully! ✨",
            description: `Loaded ${parsedContacts.length} contacts ready for enrichment.`,
          })
        },
        error: (error:any) => {
          setIsUploading(false)
          toast({
            title: "Error parsing CSV",
            description: error.message,
            variant: "destructive",
          })
        },
      })
    },
    [toast],
  )

  const handleFileRemove = useCallback(() => {
    setUploadedFile(null)
    setContacts([])
    setProgress(0)
    setTotalCost(0)
    setEnrichedCount(0)
    toast({
      title: "File removed",
      description: "You can upload a new file now.",
    })
  }, [toast])

  const mockEnrichContact = async (contact: Contact): Promise<Contact> => {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 1000))

    const enrichedFields: string[] = []
    let cost = 0

    if (!contact.email && Math.random() > 0.3) {
      contact.email = `${contact.first_name?.toLowerCase() || "user"}@${contact.company_domain || "company.com"}`
      enrichedFields.push("email")
      cost += mockEnrichmentCosts.anymailfinder
    }

    if (!contact.linkedin_url && Math.random() > 0.2) {
      contact.linkedin_url = `https://linkedin.com/in/${contact.first_name?.toLowerCase()}-${contact.last_name?.toLowerCase()}`
      enrichedFields.push("linkedin_url")
      cost += mockEnrichmentCosts.scrapin
    }

    if (!contact.title && Math.random() > 0.4) {
      const titles = ["Software Engineer", "Marketing Manager", "Sales Director", "Product Manager", "CEO"]
      contact.title = titles[Math.floor(Math.random() * titles.length)]
      enrichedFields.push("title")
      cost += mockEnrichmentCosts.serpapi
    }

    if (!contact.company_description && contact.company_name && Math.random() > 0.3) {
      contact.company_description = `${contact.company_name} is a leading company in their industry, providing innovative solutions to customers worldwide.`
      enrichedFields.push("company_description")
      cost += mockEnrichmentCosts.openai
    }

    return {
      ...contact,
      status: Math.random() > 0.1 ? "enriched" : "error",
      enrichedFields,
      cost,
    }
  }

  const startEnrichment = async () => {
    if (contacts.length === 0) return

    setIsEnriching(true)
    setProgress(0)
    setEnrichedCount(0)
    setTotalCost(0)

    setContacts((prev) => prev.map((c) => ({ ...c, status: "pending" as const })))

    const batchSize = 5
    const batches = []

    for (let i = 0; i < contacts.length; i += batchSize) {
      batches.push(contacts.slice(i, i + batchSize))
    }

    let processedCount = 0
    let runningCost = 0

    for (const batch of batches) {
      setContacts((prev) =>
        prev.map((c) => (batch.find((b) => b.id === c.id) ? { ...c, status: "in-progress" as const } : c)),
      )

      const enrichedBatch = await Promise.all(batch.map((contact) => mockEnrichContact(contact)))

      setContacts((prev) =>
        prev.map((c) => {
          const enriched = enrichedBatch.find((e) => e.id === c.id)
          return enriched || c
        }),
      )

      processedCount += batch.length
      runningCost += enrichedBatch.reduce((sum, c) => sum + c.cost, 0)

      setProgress((processedCount / contacts.length) * 100)
      setEnrichedCount(processedCount)
      setTotalCost(runningCost)
    }

    setIsEnriching(false)
    toast({
      title: "Enrichment completed! 🎉",
      description: `Successfully enriched ${processedCount} contacts for $${runningCost.toFixed(2)}.`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f0f0f0' fillOpacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        className="relative container mx-auto px-4 py-8 lg:py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl shadow-lg"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Users className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Person Enricher
              </h1>
              <motion.div
                className="flex items-center justify-center gap-2 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600 font-medium">AI-Powered Contact Enhancement</span>
                <Sparkles className="w-4 h-4 text-pink-500" />
              </motion.div>
            </div>
          </motion.div>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Transform your contact list with intelligent data enrichment using cutting-edge APIs
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        {contacts.length > 0 && (
          <StatsCards
            totalContacts={contacts.length}
            enrichedCount={enrichedCount}
            totalCost={totalCost}
            isEnriching={isEnriching}
          />
        )}

        {/* Upload Section */}
        <motion.div variants={itemVariants}>
          <FileUpload
            onFileUpload={handleFileUpload}
            onFileRemove={handleFileRemove}
            uploadedFile={uploadedFile}
            isUploading={isUploading}
            contactCount={contacts.length}
          />
        </motion.div>

        {/* Enrichment Controls */}
        {contacts.length > 0 && (
          <EnrichmentControls
            onStartEnrichment={startEnrichment}
            isEnriching={isEnriching}
            progress={progress}
            contactCount={contacts.length}
            enrichedCount={enrichedCount}
          />
        )}

        {/* Results Table */}
        {contacts.length > 0 && <ResultsTable contacts={contacts} />}
      </motion.div>
      <Toaster />
    </div>
  )
}
