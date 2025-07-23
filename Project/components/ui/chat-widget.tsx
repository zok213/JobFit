import React, { useEffect, useState } from "react";
import { createChat } from "@n8n/chat";

interface ChatWidgetProps {
  webhookUrl?: string;
  title?: string;
  subtitle?: string;
  inputPlaceholder?: string;
  customClass?: string;
  role?: "general" | "employer" | "employee";
  customMessages?: string[];
}

// Định nghĩa kiểu dữ liệu cho chatInstance
interface ChatInstance {
  destroy?: () => void;
  [key: string]: any;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  webhookUrl = "https://jobfit-api.vercel.app/api/chat", // Sử dụng webhook dự phòng làm mặc định
  title = "JobFit Assistant",
  subtitle = "Hello! How can I help you today?",
  inputPlaceholder = "Type your question...",
  customClass = "",
  role = "general",
  customMessages,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3; // Tăng số lần thử kết nối

  // Danh sách các webhook dự phòng
  const fallbackWebhooks = [
    "https://jobfit-api.vercel.app/api/chat",
    "https://jobfit-backend.onrender.com/api/chat", // Thêm webhook dự phòng thứ hai
    "https://api.jobfit.ai/chat", // Thêm webhook dự phòng thứ ba
  ];

  // Chọn webhook URL dựa trên số lần thử lại
  const getWebhookUrl = () => {
    // Nếu đã có lỗi kết nối, sử dụng webhook dự phòng theo thứ tự
    if (connectionError) {
      const fallbackIndex = retryCount % fallbackWebhooks.length;
      return fallbackWebhooks[fallbackIndex];
    }

    // Nếu webhook ban đầu chứa n8n.cloud (có thể không ổn định), sử dụng fallback đầu tiên
    if (webhookUrl.includes("n8n.cloud")) {
      return fallbackWebhooks[0];
    }

    // Sử dụng webhook được cung cấp
    return webhookUrl;
  };

  const getInitialMessages = () => {
    if (customMessages && customMessages.length > 0) {
      return customMessages;
    }

    switch (role) {
      case "employer":
        return [
          "Hello employer! 👋",
          "I'm the JobFit assistant for employers. I can help you create job descriptions, manage candidates, or answer questions about the recruitment process.",
        ];
      case "employee":
        return [
          "Hello! 👋",
          "I'm the JobFit assistant for job seekers. I can help you find suitable jobs, improve your CV, or prepare for interviews.",
        ];
      default:
        return ["Hello! 👋", "I'm the JobFit assistant. How can I help you?"];
    }
  };

  const getFooterText = () => {
    switch (role) {
      case "employer":
        return "Powered by JobFit AI for Employers";
      case "employee":
        return "Powered by JobFit AI for Job Seekers";
      default:
        return "Powered by JobFit AI";
    }
  };

  useEffect(() => {
    setIsClient(true);
    let chatInstance: ChatInstance | null = null;

    if (typeof window !== "undefined") {
      // Add custom CSS variables for lime green color
      const style = document.createElement("style");
      style.innerHTML = `
        :root {
          --chat--color-primary: #84cc16; /* lime-500 */
          --chat--color-primary-shade-50: #65a30d; /* lime-600 */
          --chat--color-primary-shade-100: #4d7c0f; /* lime-700 */
          --chat--color-secondary: #84cc16; /* lime-500 */
          --chat--color-secondary-shade-50: #65a30d; /* lime-600 */
          --chat--toggle--background: #84cc16; /* lime-500 */
          --chat--toggle--hover--background: #65a30d; /* lime-600 */
          --chat--toggle--active--background: #4d7c0f; /* lime-700 */
          --chat--message--user--background: #84cc16; /* lime-500 */
        }
      `;
      document.head.appendChild(style);

      const initChat = async () => {
        try {
          // Xóa instance cũ nếu có
          const chatElement = document.getElementById("n8n-chat");
          if (chatElement) {
            while (chatElement.firstChild) {
              chatElement.removeChild(chatElement.firstChild);
            }
          }

          // Kiểm tra kết nối webhook trước khi khởi tạo chat
          const currentWebhook = getWebhookUrl();

          // Kiểm tra endpoint trước khi tạo chat
          try {
            const response = await fetch(currentWebhook, {
              method: "HEAD",
              headers: {
                "Content-Type": "application/json",
              },
              mode: "no-cors", // Cho phép kết nối không cần CORS
              cache: "no-cache",
            });
            // Nếu endpoint không trả về lỗi, tiếp tục khởi tạo
          } catch (error) {
            console.warn("Chat endpoint check failed, trying anyway:", error);
            // Vẫn tiếp tục với việc khởi tạo chat
          }

          chatInstance = createChat({
            webhookUrl: currentWebhook,
            mode: "window",
            i18n: {
              en: {
                title,
                subtitle,
                footer: getFooterText(),
                getStarted: "Start conversation",
                inputPlaceholder,
                closeButtonTooltip: "Close",
              },
            },
            initialMessages: getInitialMessages(),
            metadata: {
              // Add metadata to send with each chat request
              source: "jobfit-frontend",
              version: "1.0.0",
              userRole: role,
            },
            loadPreviousSession: false, // Tắt tính năng load phiên trước đó
          });

          setConnectionError(false);
          return true;
        } catch (error) {
          console.error("Error initializing chat widget:", error);
          setConnectionError(true);
          return false;
        }
      };

      // Thử khởi tạo chat
      initChat().then((success) => {
        // Nếu thất bại và chưa vượt quá số lần thử lại tối đa, thử lại với webhook dự phòng
        if (!success && retryCount < maxRetries) {
          setRetryCount((prevCount) => prevCount + 1);
          setTimeout(() => {
            initChat();
          }, 2000); // Tăng thời gian chờ lên 2 giây trước khi thử lại
        }
      });

      // Cleanup function
      return () => {
        // Remove style when component unmounts
        if (style.parentNode) {
          document.head.removeChild(style);
        }

        try {
          const chatElement = document.getElementById("n8n-chat");
          if (chatElement) {
            // Remove children from chat container
            while (chatElement.firstChild) {
              chatElement.removeChild(chatElement.firstChild);
            }
          }

          // Nếu có instance và có phương thức destroy
          if (chatInstance && typeof chatInstance.destroy === "function") {
            chatInstance.destroy();
          }
        } catch (error) {
          console.error("Error cleaning up chat widget:", error);
        }
      };
    }
  }, [
    webhookUrl,
    title,
    subtitle,
    inputPlaceholder,
    role,
    customMessages,
    connectionError,
    retryCount,
  ]);

  // Don't render anything during SSR
  if (!isClient) return null;

  return (
    <div id="n8n-chat" className={customClass}>
      {/* n8n Chat will be automatically inserted here */}
    </div>
  );
};

export default ChatWidget;
