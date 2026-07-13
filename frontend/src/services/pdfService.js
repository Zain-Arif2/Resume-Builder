export async function downloadPDF(html, css = "") {
  const response = await fetch("/api/v1/pdf/generate", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ html, css }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate PDF");
  }

  return response.blob();
}