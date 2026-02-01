export const sendToN8N = async (webhookUrl: string, data: any) => {
  if (!webhookUrl) {
    console.warn("N8N webhook URL not provided");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to send data to n8n: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending to n8n:", error);
    // We intentionally don't throw here to avoid disrupting the main flow
    return null;
  }
};
