"use client"

import { motion } from "framer-motion"
import { Clock, Loader2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Contact } from "@/app/page"

interface ContactRowProps {
  contact: Contact
  index: number
}

export default function ContactRow({ contact, index }: ContactRowProps) {
  const getStatusIcon = (status: Contact["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />
      case "in-progress":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Loader2 className="w-4 h-4 text-blue-500" />
          </motion.div>
        )
      case "enriched":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "enriched":
        return "bg-green-100 text-green-800 border-green-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.03)", scale: 1.01 }}
      className="grid grid-cols-7 gap-4 p-4 hover:shadow-md transition-all duration-300 rounded-lg mx-2 my-1"
    >
      <div className="flex items-center gap-2">
        {getStatusIcon(contact.status)}
        <Badge className={`${getStatusColor(contact.status)} text-xs font-medium border`}>{contact.status}</Badge>
      </div>

      <div className="font-medium text-gray-900 truncate">
        {contact.full_name || `${contact.first_name} ${contact.last_name}`}
      </div>

      <div className="text-gray-700 truncate">
        <motion.span
          className={
            contact.enrichedFields.includes("title")
              ? "bg-gradient-to-r from-yellow-100 to-amber-100 px-2 py-1 rounded-md border border-yellow-200"
              : ""
          }
          whileHover={contact.enrichedFields.includes("title") ? { scale: 1.05 } : {}}
        >
          {contact.title || "-"}
        </motion.span>
      </div>

      <div className="text-gray-700 truncate">
        <motion.span
          className={
            contact.enrichedFields.includes("email")
              ? "bg-gradient-to-r from-yellow-100 to-amber-100 px-2 py-1 rounded-md border border-yellow-200"
              : ""
          }
          whileHover={contact.enrichedFields.includes("email") ? { scale: 1.05 } : {}}
        >
          {contact.email || "-"}
        </motion.span>
      </div>

      <div className="text-gray-700 truncate">
        <motion.span
          className={
            contact.enrichedFields.includes("linkedin_url")
              ? "bg-gradient-to-r from-yellow-100 to-amber-100 px-2 py-1 rounded-md border border-yellow-200"
              : ""
          }
          whileHover={contact.enrichedFields.includes("linkedin_url") ? { scale: 1.05 } : {}}
        >
          {contact.linkedin_url ? (
            <motion.a
              href={contact.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              LinkedIn
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          ) : (
            "-"
          )}
        </motion.span>
      </div>

      <div className="text-gray-700">
        <div className="font-medium truncate">{contact.company_name || "-"}</div>
        {contact.company_description && (
          <motion.div
            className={`text-xs text-gray-500 truncate max-w-xs mt-1 ${
              contact.enrichedFields.includes("company_description")
                ? "bg-gradient-to-r from-yellow-100 to-amber-100 px-1 py-0.5 rounded border border-yellow-200"
                : ""
            }`}
            whileHover={contact.enrichedFields.includes("company_description") ? { scale: 1.05 } : {}}
          >
            {contact.company_description}
          </motion.div>
        )}
      </div>

      <div className="text-right">
        <motion.span
          className="text-green-600 font-bold text-lg"
          key={contact.cost}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          ${contact.cost.toFixed(2)}
        </motion.span>
      </div>
    </motion.div>
  )
}
