'use client'

import { Box } from '@chakra-ui/react'
import Navigation from './Navigation'
import Hero from './Hero'
import Features from './Features'
import ProductDemo from './ProductDemo'
import CTA from './CTA'

export default function LandingPage() {
  return (
    <Box minH="100vh">
      <Navigation />
      
      {/* Add padding-top to account for fixed navigation */}
      <Box pt="64px">
        <Hero />
        
        <Box id="features">
          <Features />
        </Box>
        
        <Box id="demo">
          <ProductDemo />
        </Box>
        
        <Box id="contact">
          <CTA />
        </Box>
      </Box>
    </Box>
  )
}