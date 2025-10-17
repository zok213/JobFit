// Test script to verify n8n webhook is working
// Run this in browser console: testN8nWebhook()

window.testN8nWebhook = async function () {
  const webhookUrl =
    "https://nini123.app.n8n.cloud/webhook/3a5c6e88-046d-4af9-a0ec-df9dc40981cd/chat";

  console.log("🧪 Testing n8n webhook:", webhookUrl);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        action: "sendMessage",
        chatInput: "Hello, this is a test message",
        sessionId: "test-session-" + Date.now(),
      }),
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response headers:", [...response.headers.entries()]);

    const responseText = await response.text();
    console.log("📡 Response body:", responseText);

    if (response.ok) {
      console.log("✅ Webhook is working!");
      return { success: true, data: responseText };
    } else {
      console.log("❌ Webhook returned error status:", response.status);
      return { success: false, error: responseText };
    }
  } catch (error) {
    console.error("❌ Webhook test failed:", error);
    return { success: false, error: error.message };
  }
};

console.log(
  "🧪 Webhook test function loaded. Run testN8nWebhook() to test the webhook."
);
