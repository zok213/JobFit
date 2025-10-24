import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysisData } = body;

    if (!analysisData) {
      return NextResponse.json({ error: 'Missing analysis data' }, { status: 400 });
    }

    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPos = margin;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // Helper function to add text with automatic line wrapping
    const addText = (text: string, fontSize: number, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', style);
      doc.setTextColor(color[0], color[1], color[2]);
      
      const lines = doc.splitTextToSize(text, contentWidth);
      const lineHeight = fontSize * 0.5;
      
      lines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        doc.text(line, margin, yPos);
        yPos += lineHeight;
      });
    };

    // Title
    addText('CV ANALYSIS REPORT', 24, 'bold', [0, 0, 0]);
    yPos += 5;

    // Overall Score
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(margin, yPos, contentWidth, 20, 3, 3, 'F');
    yPos += 7;
    addText(`Overall Score: ${analysisData.overallScore}/100`, 18, 'bold', [132, 204, 22]);
    yPos += 8;

    // Date
    addText(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 10, 'normal', [100, 100, 100]);
    yPos += 10;

    // Section Scores
    if (analysisData.scores && analysisData.scores.length > 0) {
      addText('Section Scores', 16, 'bold');
      yPos += 3;

      analysisData.scores.forEach((score: any) => {
        checkPageBreak(15);
        
        // Score bar background
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');
        
        // Score bar fill
        const scorePercentage = score.score / 100;
        const barWidth = (contentWidth - 40) * scorePercentage;
        const color = score.score >= 80 ? [132, 204, 22] : score.score >= 60 ? [251, 191, 36] : [239, 68, 68];
        doc.setFillColor(color[0], color[1], color[2]);
        doc.roundedRect(margin + 2, yPos + 2, barWidth, 8, 1, 1, 'F');
        
        // Score text
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(score.category, margin + 5, yPos + 8);
        doc.text(`${score.score}%`, pageWidth - margin - 15, yPos + 8);
        
        yPos += 15;
      });
      yPos += 5;
    }

    // Strengths
    if (analysisData.strengths && analysisData.strengths.length > 0) {
      checkPageBreak(20);
      addText('✓ Strengths', 14, 'bold', [34, 197, 94]);
      yPos += 3;

      analysisData.strengths.forEach((strength: string) => {
        checkPageBreak(10);
        doc.setFillColor(240, 253, 244);
        doc.roundedRect(margin, yPos, contentWidth, 8, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(`• ${strength}`, contentWidth - 10);
        lines.forEach((line: string, index: number) => {
          if (index > 0) checkPageBreak(5);
          doc.text(line, margin + 5, yPos + 5 + (index * 5));
        });
        yPos += Math.max(8, lines.length * 5 + 3);
      });
      yPos += 5;
    }

    // Areas for Improvement
    if (analysisData.improvements && analysisData.improvements.length > 0) {
      checkPageBreak(20);
      addText('⚠ Areas for Improvement', 14, 'bold', [251, 191, 36]);
      yPos += 3;

      analysisData.improvements.forEach((improvement: any) => {
        checkPageBreak(15);
        doc.setFillColor(254, 252, 232);
        doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`• ${improvement.area}`, margin + 5, yPos + 5);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const suggestionLines = doc.splitTextToSize(improvement.suggestion, contentWidth - 15);
        suggestionLines.forEach((line: string, index: number) => {
          checkPageBreak(5);
          doc.text(line, margin + 10, yPos + 10 + (index * 4));
        });
        
        yPos += Math.max(12, suggestionLines.length * 4 + 10);
      });
      yPos += 5;
    }

    // Keywords Analysis
    if (analysisData.keywords) {
      checkPageBreak(20);
      addText('Keywords Analysis', 14, 'bold');
      yPos += 3;

      if (analysisData.keywords.matched && analysisData.keywords.matched.length > 0) {
        checkPageBreak(10);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(34, 197, 94);
        doc.text('✓ Matched Keywords:', margin, yPos);
        yPos += 5;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const matchedText = analysisData.keywords.matched.join(', ');
        const matchedLines = doc.splitTextToSize(matchedText, contentWidth - 10);
        matchedLines.forEach((line: string) => {
          checkPageBreak(5);
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });
        yPos += 3;
      }

      if (analysisData.keywords.missing && analysisData.keywords.missing.length > 0) {
        checkPageBreak(10);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(239, 68, 68);
        doc.text('✗ Missing Keywords:', margin, yPos);
        yPos += 5;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const missingText = analysisData.keywords.missing.join(', ');
        const missingLines = doc.splitTextToSize(missingText, contentWidth - 10);
        missingLines.forEach((line: string) => {
          checkPageBreak(5);
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });
      }
      yPos += 5;
    }

    // Recommendations
    if (analysisData.recommendations && analysisData.recommendations.length > 0) {
      checkPageBreak(20);
      addText('💡 Recommendations', 14, 'bold', [59, 130, 246]);
      yPos += 3;

      analysisData.recommendations.forEach((rec: string, index: number) => {
        checkPageBreak(10);
        doc.setFillColor(239, 246, 255);
        doc.roundedRect(margin, yPos, contentWidth, 8, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, contentWidth - 10);
        lines.forEach((line: string, lineIndex: number) => {
          if (lineIndex > 0) checkPageBreak(5);
          doc.text(line, margin + 5, yPos + 5 + (lineIndex * 5));
        });
        yPos += Math.max(8, lines.length * 5 + 3);
      });
    }

    // Footer
    yPos = pageHeight - 15;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by JobFit AI - Your Career Success Partner', pageWidth / 2, yPos, { align: 'center' });

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="cv-analysis-report-${Date.now()}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating analysis report PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF report', details: error.message },
      { status: 500 }
    );
  }
}
