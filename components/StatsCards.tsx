"use client"

import { motion } from "framer-motion"
import { Users, CheckCircle, DollarSign, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardsProps {
  totalContacts: number
  enrichedCount: number
  totalCost: number
  isEnriching: boolean
}

export default function StatsCards({ totalContacts, enrichedCount, totalCost, isEnriching }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Contacts",
      value: totalContacts,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      title: "Enriched",
      value: enrichedCount,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
    },
    {
      title: "Total Cost",
      value: `$${totalCost.toFixed(2)}`,
      icon: DollarSign,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      title: "Success Rate",
      value: `${totalContacts > 0 ? Math.round((enrichedCount / totalContacts) * 100) : 0}%`,
      icon: Zap,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Card
            className={`overflow-hidden backdrop-blur-sm bg-gradient-to-br ${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <motion.p
                    className="text-3xl font-bold text-gray-900"
                    key={stat.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div
                  className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  animate={isEnriching ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={isEnriching ? { duration: 2, repeat: Number.POSITIVE_INFINITY } : {}}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
