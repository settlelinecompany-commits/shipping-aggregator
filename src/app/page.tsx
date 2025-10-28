'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Star, 
  ArrowRight, 
  Sparkles,
  Zap,
  Shield,
  Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Same-day delivery across UAE",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Package,
      title: "Package Tracking",
      description: "Real-time tracking for all shipments",
      color: "from-green-500 to-green-600"
    },
    {
      icon: MapPin,
      title: "Wide Coverage",
      description: "Coverage across all Emirates",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support",
      color: "from-orange-500 to-orange-600"
    }
  ]

  const stats = [
    { label: "Active Users", value: "50K+", icon: Globe },
    { label: "Deliveries", value: "1M+", icon: Package },
    { label: "Cities Covered", value: "25+", icon: MapPin },
    { label: "Satisfaction", value: "98%", icon: Star }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">ShipUAE</h1>
            </motion.div>
            
            <motion.button 
              className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.main 
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              variants={itemVariants}
            >
              <Sparkles className="w-4 h-4" />
              <span>UAE's Leading Shipping Platform</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              variants={itemVariants}
            >
              Ship Anything,{' '}
              <span className="gradient-text">Anywhere</span>
              <br />
              in the UAE
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Compare shipping rates from top UAE carriers, track your packages in real-time, 
              and enjoy seamless delivery experiences across all Emirates.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={itemVariants}
            >
              <motion.button 
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Truck className="w-5 h-5" />
                <span>Start Shipping</span>
              </motion.button>
              
              <motion.button 
                className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Package className="w-5 h-5" />
                <span>Track Package</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            variants={itemVariants}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="card p-6 text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl w-fit mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Section */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={itemVariants}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="card p-6 group"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={cn(
                  "p-4 bg-gradient-to-r rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300",
                  feature.color
                )}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="mt-20 text-center"
            variants={itemVariants}
          >
            <div className="card p-8 sm:p-12 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Zap className="w-6 h-6 text-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-900">Ready to Ship?</h2>
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of satisfied customers who trust ShipUAE for their shipping needs.
              </p>
              <motion.button 
                className="btn-accent text-lg px-8 py-4 flex items-center space-x-2 mx-auto"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* Footer */}
      <motion.footer 
        className="relative z-10 bg-white/80 backdrop-blur-md border-t border-white/20 mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold gradient-text">ShipUAE</h3>
            </div>
            <p className="text-gray-600">
              © 2024 ShipUAE. Making shipping simple across the UAE.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}