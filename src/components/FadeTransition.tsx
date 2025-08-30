'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeTransitionProps {
  children: ReactNode
  isVisible: boolean
  duration?: number
  delay?: number
}

export function FadeTransition({ 
  children, 
  isVisible, 
  duration = 0.3,
  delay = 0 
}: FadeTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ 
            duration, 
            delay,
            ease: "easeOut"
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 渐进式加载容器
export function ProgressiveLoader({ 
  children, 
  delay = 0,
  stagger = 0.1 
}: { 
  children: ReactNode[]
  delay?: number
  stagger?: number 
}) {
  return (
    <>
      {children.map((child, index) => (
        <FadeTransition 
          key={index}
          isVisible={true}
          delay={delay + (index * stagger)}
        >
          {child}
        </FadeTransition>
      ))}
    </>
  )
}