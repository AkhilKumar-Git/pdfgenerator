// src/app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pdfGenerator } from "@/lib/pdfGenerator";

export const maxDuration = 300; // 5 minutes timeout
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { html, styles, options } = data;

    if (!html) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }

    const pdfBuffer = await pdfGenerator.generatePDF(html, styles, options);

    // Cleanup browser instance after generating PDF
    await pdfGenerator.cleanup();

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", 'attachment; filename="report.pdf"');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 }
    );
  }
}
