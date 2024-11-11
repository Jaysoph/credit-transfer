"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { usePathname, useRouter } from "next/navigation"

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        // Call the API to check accessToken
        const res = await fetch(`/api/auth/redirect?pathname=${pathname}`, {
          method: "GET",
          credentials: "include"
        })

        console.log("Checking access token...")

        if (res.redirected) {
          // Redirect the client if the API triggers a redirect
          router.replace(res.url)
        }
      } catch (error) {
        console.error("Error checking access token:", error)
      }
    }

    checkAccessToken()
  }, [pathname, router])

  useEffect(() => {
    const handlePageHide = (event: PageTransitionEvent) => {
      // persisted == false means reload ok very good
      if (event.persisted) {
        localStorage.clear()
        Cookies.remove("accessToken")
      }
    }

    window.addEventListener("pagehide", handlePageHide)

    return () => {
      window.removeEventListener("pagehide", handlePageHide)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>{children}</ChakraProvider>
    </QueryClientProvider>
  )
}
