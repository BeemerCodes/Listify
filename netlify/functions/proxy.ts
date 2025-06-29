// NOVO ARQUIVO: netlify/functions/proxy.ts
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const barcode = event.queryStringParameters?.barcode;

  if (!barcode) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Código de barras não fornecido." }),
    };
  }

  const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "ListfyApp/1.0" },
    });

    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Falha ao buscar dados do produto." }),
    };
  }
};

export { handler };
