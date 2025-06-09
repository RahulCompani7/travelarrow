"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ContactRow from "./ContactRow";
import Papa from "papaparse";
import type { Contact } from "@/app/page";

interface ResultsTableProps {
  contacts: Contact[];
}

export default function ResultsTable({ contacts }: ResultsTableProps) {
  const { toast } = useToast();

  const downloadCSV = () => {
    const csv = Papa.unparse(
      contacts.map((c) => ({
        full_name: c.full_name,
        first_name: c.first_name,
        last_name: c.last_name,
        title: c.title,
        email: c.email,
        linkedin_url: c.linkedin_url,
        company_name: c.company_name,
        company_domain: c.company_domain,
        company_description: c.company_description,
      }))
    );

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enriched-contacts.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Download started! 📥",
      description: "Your enriched contacts CSV is being downloaded.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-8"
    >
      <Card className="overflow-hidden backdrop-blur-sm bg-white/70 border-0 shadow-xl shadow-green-100/50">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Table className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Contact Results
                </h2>
                <p className="text-green-600 font-medium">
                  {contacts.length} contacts loaded
                </p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={downloadCSV}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Table Header */}
              <div className="bg-gray-50/80 sticky backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="grid grid-cols-9 gap-4 p-4 text-sm font-semibold text-gray-700">
                  <div>Status</div>
                  <div>Name</div>
                  <div>Title</div>
                  <div>Email</div>
                  <div>LinkedIn</div>
                  <div>Company</div>
                  <div>Domain</div>
                  <div>Description</div>
                  <div>Cost</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                <AnimatePresence>
                  {contacts.map((contact, index) => (
                    <ContactRow
                      key={contact.id}
                      contact={contact}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
