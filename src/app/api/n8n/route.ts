import { sendToN8N } from "@/lib/n8n";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      return new Response("N8N_WEBHOOK_URL not configured", { status: 500 });
    }

    const result = await sendToN8N(webhookUrl, body);

    return new Response(JSON.stringify(result || { success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in n8n webhook proxy:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
