"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

declare global {
  interface Window {
    $chatwoot: {
      run: (config: {
        websiteToken: string
        baseUrl: string
      }) => void
      setUser: (identifier: string, userInfo: {
        email: string
        name: string
      }) => void
      setCustomAttributes: (attributes: Record<string, any>) => void
      toggle: () => void
      hide: () => void
      show: () => void
    }
    chatwootSDK: {
      run: (config: {
        websiteToken: string
        baseUrl: string
      }) => void
    }
  }
}

export function ChatwootWidget() {
  const { data: session, status } = useSession()

  useEffect(() => {
    const chatwootToken = process.env.NEXT_PUBLIC_CHATWOOT_TOKEN
    const chatwootBaseUrl = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL

    if (!chatwootToken || !chatwootBaseUrl) {
      console.warn("Chatwoot configuration missing")
      return
    }

    // Load Chatwoot SDK if not already loaded
    if (typeof window !== "undefined" && !window.chatwootSDK) {
      const script = document.createElement("script")
      script.async = true
      script.src = `${chatwootBaseUrl}/packs/js/sdk.js`
      script.onload = () => {
        window.chatwootSDK.run({
          websiteToken: chatwootToken,
          baseUrl: chatwootBaseUrl,
        })
      }
      document.head.appendChild(script)

      // Initialize Chatwoot
      window.$chatwoot.run({
        websiteToken: chatwootToken,
        baseUrl: chatwootBaseUrl,
      })
    } else if (window.chatwootSDK) {
      // SDK already loaded, just initialize
      window.chatwootSDK.run({
        websiteToken: chatwootToken,
        baseUrl: chatwootBaseUrl,
      })
      window.$chatwoot.run({
        websiteToken: chatwootToken,
        baseUrl: chatwootBaseUrl,
      })
    }
  }, [])

  // Set user identity when authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const chatwootToken = process.env.NEXT_PUBLIC_CHATWOOT_TOKEN

      if (chatwootToken && window.$chatwoot) {
        // Set user identity
        window.$chatwoot.setUser(session.user.id, {
          email: session.user.email!,
          name: session.user.name!,
        })

        // Set custom attributes including role
        window.$chatwoot.setCustomAttributes({
          role: session.user.role,
          apiKey: session.user.apiKey,
          plan: "premium", // You can set actual plan based on user subscription
        })
      }
    }
  }, [status, session])

  return null // This component doesn't render anything visible
}