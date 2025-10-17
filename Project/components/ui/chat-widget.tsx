"use client";

import React, { useEffect, useState } from "react";
import { createChat } from "@n8n/chat";

interface ChatWidgetProps {
  webhookUrl?: string;
  title?: string;
  subtitle?: string;
  inputPlaceholder?: string;
  mode?: "window" | "fullscreen";
  enableStreaming?: boolean;
  showWelcomeScreen?: boolean;
  allowFileUploads?: boolean;
  customClass?: string;
  target?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  webhookUrl = "https://nini123.app.n8n.cloud/webhook/3a5c6e88-046d-4af9-a0ec-df9dc40981cd/chat",
  title = "JobFit Assistant",
  subtitle = "I'm here to support your career",
  inputPlaceholder = "Ask me anything...",
  mode = "window",
  enableStreaming = false,
  showWelcomeScreen = false,
  allowFileUploads = true,
  customClass = "",
  target = "#n8n-chat",
}) => {
  const [isClient, setIsClient] = useState(false);
  const [chatInstance, setChatInstance] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || isInitialized) return;

    let mounted = true;

    const initializeChat = async () => {
      try {
        console.log("🚀 Initializing n8n chat with webhook:", webhookUrl);

        // Create the target div if it doesn't exist
        const targetElement = document.querySelector(target);
        if (!targetElement) {
          const chatDiv = document.createElement("div");
          chatDiv.id = target.replace("#", "");
          if (customClass) {
            chatDiv.className = customClass;
          }
          document.body.appendChild(chatDiv);
        }

        // Initialize the n8n chat
        const chat = createChat({
          webhookUrl,
          target,
          mode,
          showWelcomeScreen,
          enableStreaming,
          allowFileUploads,
          allowedFilesMimeTypes: "image/*,application/pdf,text/*",
          loadPreviousSession: false, // Disable session loading to avoid conflicts
          defaultLanguage: "en",
          initialMessages: ["Hello, I'm Frank, lets start your success career"],
          i18n: {
            en: {
              title,
              subtitle,
              footer: "Powered by JobFit.AI",
              getStarted: "Start Conversation",
              inputPlaceholder,
              closeButtonTooltip: "Close Chat",
            },
          },
          webhookConfig: {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
          metadata: {
            source: "jobfit-website",
            timestamp: new Date().toISOString(),
          },
        });

        if (mounted) {
          setChatInstance(chat);
          setIsInitialized(true);
          console.log("✅ N8N Chat initialized successfully");
        }
      } catch (error) {
        console.error("❌ Error initializing n8n chat:", error);

        // Fallback: Show a simple message if n8n chat fails
        if (mounted) {
          const targetElement = document.querySelector(target);
          if (targetElement) {
            targetElement.innerHTML = `
              <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                max-width: 300px;
              ">
                <strong>Chat Unavailable</strong><br>
                Sorry, the AI assistant is temporarily unavailable. Please try again later.
              </div>
            `;
          }
        }
      }
    };

    // Delay initialization to ensure the DOM is ready
    const timer = setTimeout(initializeChat, 1000);

    return () => {
      mounted = false;
      clearTimeout(timer);

      // Cleanup chat instance if it exists
      if (chatInstance && typeof chatInstance.destroy === "function") {
        try {
          chatInstance.destroy();
        } catch (error) {
          console.warn("Warning: Error destroying chat instance:", error);
        }
      }
    };
  }, [
    isClient,
    isInitialized,
    webhookUrl,
    target,
    mode,
    title,
    subtitle,
    inputPlaceholder,
    enableStreaming,
    showWelcomeScreen,
    allowFileUploads,
    customClass,
    chatInstance,
  ]);

  // Don't render anything on server side
  if (!isClient) {
    return null;
  }

  // The chat widget will be rendered by the n8n library
  return null;
};

export default ChatWidget;
