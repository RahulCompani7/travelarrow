"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Contact } from "@/app/page";

interface ContactRowProps {
  contact: Contact;
  index: number;
}

export default function ContactRow({ contact, index }: ContactRowProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusIcon = (status: Contact["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "in-progress":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-4 h-4 text-blue-500" />
          </motion.div>
        );
      case "enriched":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "enriched":
        return "bg-green-100 text-green-800 border-green-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.5 }}
        whileHover={{
          backgroundColor: "rgba(139, 92, 246, 0.03)",
          scale: 1.01,
        }}
        className="grid grid-cols-9 gap-4 p-4 hover:shadow-md transition-all duration-300 rounded-lg mx-2 my-1 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {getStatusIcon(contact.status)}
          <Badge
            className={`${getStatusColor(
              contact.status
            )} text-xs font-medium border`}
          >
            {contact.status}
          </Badge>
        </div>

        <div className="font-medium text-gray-900 truncate">
          {contact.full_name || `${contact.first_name} ${contact.last_name}`}
        </div>

        <div className="text-gray-700 truncate">{contact.title || "-"}</div>

        <div className="text-gray-700 truncate">{contact.email || "-"}</div>

        <div className="text-gray-700 truncate">
          {contact.linkedin_url ? (
            <a
              href={contact.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              LinkedIn <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            "-"
          )}
        </div>

        <div className="text-gray-700 truncate font-medium">
          {contact.company_name || "-"}
        </div>

        <div className="text-gray-700 truncate">
          {contact.company_domain ? (
            <a
              href={
                contact.company_domain.startsWith("http")
                  ? contact.company_domain
                  : `https://${contact.company_domain}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline"
              onClick={(e) => e.stopPropagation()}
            >
              {contact.company_domain}
            </a>
          ) : (
            "-"
          )}
        </div>

        <div className="text-gray-700 text-xs truncate max-w-xs">
          {contact.company_description || "-"}
        </div>

        <div className="text-right flex justify-end items-center">
          <motion.span
            className="text-green-600 font-bold text-lg"
            key={contact.cost}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            ${contact.cost.toFixed(2)}
          </motion.span>
          {expanded ? (
            <ChevronUp className="ml-2 text-gray-500 w-4 h-4" />
          ) : (
            <ChevronDown className="ml-2 text-gray-500 w-4 h-4" />
          )}
        </div>
      </motion.div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 rounded-lg mx-4 mb-2 px-4 py-2 text-sm text-gray-600"
          >
            <p>
              <strong>Name:</strong>{" "}
              {contact.first_name + " " + contact.last_name || "N/A"}
            </p>
            <p>
              <strong>Title:</strong> {contact.title || "N/A"}
            </p>
            <p>
              <strong>Company:</strong> {contact.company_name || "N/A"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {contact.company_description || "N/A"}
            </p>
            <p>
              <strong>Domain:</strong> {contact.company_domain || "N/A"}
            </p>

            <p>
              <strong>Email:</strong> {contact.email || "N/A"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
