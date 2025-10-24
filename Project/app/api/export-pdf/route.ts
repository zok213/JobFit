import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';

export async function POST(req: NextRequest) {
  try {
    const cvData = await req.json();

    // Create new PDF document (A4 size)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      if (isBold) doc.setFont('helvetica', 'bold');
      else doc.setFont('helvetica', 'normal');
      
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += fontSize * 0.5;
      });
      yPosition += 3;
    };

    const addSection = (title: string) => {
      yPosition += 5;
      doc.setFillColor(59, 130, 246); // Blue color
      doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(title.toUpperCase(), margin + 2, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 10;
    };

    // Header - Name and Title with Photo
    doc.setFillColor(37, 99, 235); // Darker blue
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Add photo if available
    if (cvData.personal?.photoUrl) {
      try {
        let imageData = cvData.personal.photoUrl;
        let imageType = 'JPEG';
        
        // Check if it's already a data URL
        if (imageData.startsWith('data:image/')) {
          // Already base64, use directly
          imageType = imageData.includes('image/png') ? 'PNG' : 'JPEG';
        } else if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
          // HTTP URL - fetch and convert
          const imageResponse = await fetch(imageData);
          const imageBuffer = await imageResponse.arrayBuffer();
          const base64Image = Buffer.from(imageBuffer).toString('base64');
          imageType = imageData.toLowerCase().includes('.png') ? 'PNG' : 'JPEG';
          imageData = `data:image/${imageType.toLowerCase()};base64,${base64Image}`;
        } else {
          // Blob URL or invalid - skip
          throw new Error('Unsupported image URL format');
        }
        
        // Add circular photo on the left side
        const photoSize = 35;
        const photoX = 15;
        const photoY = 7.5;
        
        // Draw white circle background
        doc.setFillColor(255, 255, 255);
        doc.circle(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 'F');
        
        // Add image inside circle (clipped)
        doc.addImage(
          imageData,
          imageType,
          photoX,
          photoY,
          photoSize,
          photoSize,
          undefined,
          'FAST'
        );
      } catch (error) {
        console.error('Error loading photo:', error);
        // Continue without photo if error
      }
    }
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    const fullName = `${cvData.personal?.firstName || ''} ${cvData.personal?.lastName || ''}`.trim() || 'Your Name';
    // Adjust text position if photo exists
    const textX = cvData.personal?.photoUrl ? 60 : pageWidth / 2;
    const textAlign = cvData.personal?.photoUrl ? 'left' : 'center';
    doc.text(fullName, textX, 20, { align: textAlign as any });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(cvData.personal?.jobTitle || 'Professional Title', textX, 30, { align: textAlign as any });
    
    doc.setFontSize(10);
    const contactInfo = [
      cvData.personal?.email,
      cvData.personal?.phone,
      cvData.personal?.location
    ].filter(Boolean).join(' | ');
    doc.text(contactInfo, textX, 40, { align: textAlign as any });
    
    doc.setTextColor(0, 0, 0);
    yPosition = 60;

    // Professional Summary
    if (cvData.summary) {
      addSection('PROFESSIONAL SUMMARY');
      addText(cvData.summary, 10);
    }

    // Employment History
    if (cvData.experience?.length > 0) {
      addSection('WORK EXPERIENCE');
      cvData.experience.forEach((job: any) => {
        addText(`${job.jobTitle || job.title} at ${job.company}`, 12, true);
        addText(`${job.startDate} - ${job.endDate || 'Present'} | ${job.location || ''}`, 9);
        if (job.description) {
          addText(job.description, 10);
        }
        yPosition += 3;
      });
    }

    // Education
    if (cvData.education?.length > 0) {
      addSection('EDUCATION');
      cvData.education.forEach((edu: any) => {
        addText(`${edu.degree} in ${edu.fieldOfStudy || edu.field}`, 12, true);
        addText(`${edu.school} | ${edu.graduationDate || edu.endDate}`, 9);
        if (edu.description) {
          addText(edu.description, 10);
        }
        yPosition += 3;
      });
    }

    // Skills
    if (cvData.skills?.length > 0) {
      addSection('SKILLS');
      const skillsText = cvData.skills.map((s: any) => s.name || s).join(' • ');
      addText(skillsText, 10);
    }

    // Links
    if (cvData.links?.length > 0) {
      addSection('LINKS');
      cvData.links.forEach((link: any) => {
        doc.setTextColor(59, 130, 246);
        addText(`${link.label || link.name}: ${link.url}`, 10);
        doc.setTextColor(0, 0, 0);
      });
    }

    // Custom Sections
    if (cvData.customSections?.length > 0) {
      cvData.customSections.forEach((section: any) => {
        addSection(section.title || 'CUSTOM SECTION');
        addText(section.content || '', 10);
      });
    }

    // Generate PDF as buffer
    const pdfBuffer = doc.output('arraybuffer');
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CV_${fullName.replace(/\s+/g, '_')}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
