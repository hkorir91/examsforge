import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ── SVG → PNG data URL (browser-only) ────────────────────────────────────────
// Converts a raw SVG string to a PNG data URL via an HTML canvas.
// Key fixes:
//   1. Inject explicit width/height into SVG — without them img.naturalWidth = 0
//      and ctx.drawImage renders a blank canvas.
//   2. Use FileReader.readAsDataURL for encoding — btoa() breaks on any
//      Unicode character (°, →, etc.) outside Latin-1. FileReader handles all UTF-8.
//   3. 5-second timeout so a malformed SVG never hangs the PDF download.
function svgToDataUrl(svgString, widthPx = 280, heightPx = 200) {
  return new Promise((resolve) => {
    try {
      // Step 1: inject explicit dimensions if missing
      let svg = svgString.trim()
      if (!svg.startsWith('<svg')) {
        resolve(null); return
      }
      // Replace the opening <svg tag to add width/height if not already present
      svg = svg.replace(/^<svg([^>]*)>/, (match, attrs) => {
        const w = /\bwidth=/.test(attrs) ? '' : ` width="${widthPx}"`
        const h = /\bheight=/.test(attrs) ? '' : ` height="${heightPx}"`
        return `<svg${attrs}${w}${h}>`
      })

      // Step 2: encode via FileReader (handles all UTF-8 correctly)
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
      const reader = new FileReader()

      reader.onloadend = () => {
        const img = new Image()
        const timer = setTimeout(() => resolve(null), 5000) // safety timeout

        img.onload = () => {
          clearTimeout(timer)
          try {
            const canvas = document.createElement('canvas')
            canvas.width  = widthPx * 2   // 2× for crisp PDF rendering
            canvas.height = heightPx * 2
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = '#ffffff'      // white bg — SVG backgrounds can be transparent
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.scale(2, 2)
            ctx.drawImage(img, 0, 0, widthPx, heightPx)
            resolve(canvas.toDataURL('image/png'))
          } catch {
            resolve(null)
          }
        }
        img.onerror = () => { clearTimeout(timer); resolve(null) }
        img.src = reader.result   // FileReader gives a proper data: URL
      }
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    } catch {
      resolve(null)
    }
  })
}

// ── Markdown table parser ─────────────────────────────────────────────────────
// The AI sometimes embeds data tables as markdown (| col | col |) in q.text.
// These functions detect and extract them so we can render with autoTable.
function parseMarkdownTable(text) {
  if (!text || !text.includes('|')) return null
  const lines = text.split('\n').map(l => l.trim())
  const tableLines = lines.filter(l => l.startsWith('|') && l.endsWith('|'))
  if (tableLines.length < 2) return null

  // Separator lines are like |---|---| — only pipes, dashes, colons, spaces
  const isSeparator = l => /^[\|\-:\s]+$/.test(l)
  const contentLines = tableLines.filter(l => !isSeparator(l))
  if (contentLines.length < 2) return null

  const parseCells = line =>
    line.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1)

  const headers = parseCells(contentLines[0])
  const rows    = contentLines.slice(1).map(parseCells)
  return { headers, rows }
}

// Splits question text into segments: text before table, the table itself, text after
function splitTextAroundTable(text) {
  if (!text || !text.includes('|')) return { before: text, table: null, after: '' }
  const lines = text.split('\n')
  const firstTableIdx = lines.findIndex(l => l.trim().startsWith('|') && l.trim().endsWith('|'))
  if (firstTableIdx === -1) return { before: text, table: null, after: '' }

  // Find where table ends
  let lastTableIdx = firstTableIdx
  for (let i = firstTableIdx; i < lines.length; i++) {
    const t = lines[i].trim()
    if (t.startsWith('|') && t.endsWith('|')) lastTableIdx = i
    else if (t && !t.startsWith('|') && i > firstTableIdx) break
  }

  const before = lines.slice(0, firstTableIdx).join('\n').trim()
  const tableText = lines.slice(firstTableIdx, lastTableIdx + 1).join('\n')
  const after = lines.slice(lastTableIdx + 1).join('\n').trim()
  return { before, table: parseMarkdownTable(tableText), after }
}

export async function generateExamPDF(exam, meta) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentW = pageW - margin * 2
  let y = margin

  const colors = {
    blue: [0, 51, 153],
    red: [204, 0, 0],
    black: [26, 26, 46],
    gray: [107, 107, 128],
    lightGray: [240, 242, 247],
    white: [255, 255, 255],
  }

  // ── Helpers ────────────────────────────────────────
  const checkPage = (needed = 20) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      // Stamp footer on current page before moving to next
      addFooter(doc.internal.getNumberOfPages())
      addFooter(doc.internal.getNumberOfPages())
  doc.addPage()
      y = margin
    }
  }

  const drawLine = (color = colors.lightGray) => {
    doc.setDrawColor(...color)
    doc.setLineWidth(0.3)
    doc.line(margin, y, pageW - margin, y)
    y += 4
  }

  // BUG 1 FIX: meta.strands is an array — join it for display
  // (kept for use in footer only — NOT shown on cover page per design spec)
  const strandsDisplay = Array.isArray(meta.strands)
    ? meta.strands.filter(s => s && s !== 'undefined' && s !== 'General').join(', ')
    : (meta.strand || '')

  // ── FOOTER HELPER ───────────────────────────────────
  // Called after every new page — stamps SmartSchool Digital watermark
  const addFooter = (pageNum) => {
    const footerY = doc.internal.pageSize.getHeight() - 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...colors.gray)
    doc.text(
      `SmartSchool Digital  |  ${meta.school || 'Kenya Public School'}  |  ${meta.subject}  |  ${meta.grade}  |  ${meta.examType} ${meta.term} ${meta.year}`,
      pageW / 2, footerY, { align: 'center' }
    )
    doc.setDrawColor(...colors.lightGray)
    doc.setLineWidth(0.2)
    doc.line(margin, footerY - 3, pageW - margin, footerY - 3)
    // Page number on right
    doc.setTextColor(...colors.gray)
    doc.text(`Page ${pageNum}`, pageW - margin, footerY, { align: 'right' })
  }

  // ── COVER PAGE ─────────────────────────────────────

  // Kenya flag stripe at top
  const stripeH = 4
  const stripeW = contentW / 5
  const flagColors = [[0, 102, 0], [204, 0, 0], [0, 0, 0], [204, 0, 0], [0, 102, 0]]
  flagColors.forEach((c, i) => {
    doc.setFillColor(...c)
    doc.rect(margin + i * stripeW, y, stripeW, stripeH, 'F')
  })
  y += stripeH + 7

  // ── School name ────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(...colors.black)
  doc.text((meta.school || 'Kenya Public School').toUpperCase(), pageW / 2, y, { align: 'center' })
  y += 6

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8.5)
  doc.setTextColor(...colors.gray)
  doc.text('Excellence in Education', pageW / 2, y, { align: 'center' })
  y += 6

  // ── KCBE Header ────────────────────────────────────
  doc.setDrawColor(...colors.blue)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageW - margin, y)
  y += 5

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(...colors.blue)
  doc.text('KENYA CERTIFICATE OF BASIC EDUCATION (K.C.B.E)', pageW / 2, y, { align: 'center' })
  y += 5

  doc.setDrawColor(...colors.blue)
  doc.line(margin, y, pageW - margin, y)
  y += 6

  // ── Exam title ────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...colors.blue)
  const title = exam.title || `${meta.grade} ${meta.subject} ${meta.examType} Examination`
  doc.text(title, pageW / 2, y, { align: 'center' })
  y += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...colors.gray)
  doc.text(`${meta.term} ${meta.year} Examination`, pageW / 2, y, { align: 'center' })
  y += 8

  // ── Info grid — Grade, Subject, Duration, Marks, Term, Year (NO strand/substrand) ──
  const colW = contentW / 2 - 12
  const infoRows = [
    [`Grade / Class: ${meta.grade}`, `Subject: ${meta.subject}`],
    [`Duration: ${exam.time || exam.duration || '2 hours'}`, `Total Marks: ${meta.totalMarks}`],
    [`Term: ${meta.term}`, `Year: ${meta.year}`],
  ]

  doc.setFontSize(9)
  const rowHeights = infoRows.map(row => {
    const lines0 = doc.splitTextToSize(row[0], colW)
    const lines1 = doc.splitTextToSize(row[1], colW)
    return Math.max(lines0.length, lines1.length) * 5.5 + 3
  })
  const gridH = rowHeights.reduce((s, h) => s + h, 0) + 8

  doc.setFillColor(...colors.lightGray)
  doc.roundedRect(margin, y, contentW, gridH, 3, 3, 'F')

  const col1 = margin + 6
  const col2 = pageW / 2 + 6
  let rowY = y + 6
  infoRows.forEach((row, i) => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...colors.black)
    doc.setFontSize(9)
    const lines0 = doc.splitTextToSize(row[0], colW)
    const lines1 = doc.splitTextToSize(row[1], colW)
    doc.text(lines0, col1, rowY)
    doc.text(lines1, col2, rowY)
    rowY += rowHeights[i]
  })
  y += gridH + 6

  // ── Learner's Details Box ─────────────────────────
  const detailsBoxH = 32
  doc.setDrawColor(...colors.blue)
  doc.setLineWidth(0.5)
  doc.roundedRect(margin, y, contentW, detailsBoxH, 3, 3, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...colors.blue)
  doc.text("LEARNER'S DETAILS", margin + 5, y + 7)

  // Row 1: Name + Admission Number
  const detY1 = y + 15
  const detY2 = y + 26
  const midX = pageW / 2

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...colors.black)
  doc.text('Name:', margin + 5, detY1)
  doc.setLineWidth(0.3)
  doc.setDrawColor(...colors.gray)
  doc.line(margin + 20, detY1, midX - 8, detY1)  // name line

  doc.text('Adm No:', midX - 2, detY1)
  doc.line(midX + 16, detY1, pageW - margin - 3, detY1)  // adm no line

  // Row 2: Date + Signature
  doc.text('Date:', margin + 5, detY2)
  doc.line(margin + 18, detY2, midX - 8, detY2)  // date line

  doc.text('Signature:', midX - 2, detY2)
  doc.line(midX + 20, detY2, pageW - margin - 3, detY2)  // signature line

  y += detailsBoxH + 6

  // ── Instructions box ──────────────────────────────
  const instructions = exam.instructions || []
  let instrLines = []
  instructions.forEach((inst, i) => {
    const txt = `${i + 1}. ${inst}`
    instrLines.push(...doc.splitTextToSize(txt, contentW - 10))
  })
  const instrBoxH = Math.max(20, instrLines.length * 5 + 14)

  doc.setDrawColor(...colors.red)
  doc.setLineWidth(0.5)
  doc.roundedRect(margin, y, contentW, instrBoxH, 3, 3, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...colors.red)
  doc.text('INSTRUCTIONS TO CANDIDATES', margin + 5, y + 7)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...colors.black)
  let instrY = y + 13
  instrLines.forEach(line => {
    doc.text(line, margin + 5, instrY)
    instrY += 5
  })
  y += instrBoxH + 6

  // ── Score Grid ────────────────────────────────────
  // Collect all questions across sections to build Q# → Marks mapping
  const allQuestions = [
    ...(exam.sectionA?.questions || []),
    ...(exam.sectionB?.questions || []),
    ...(exam.sectionC?.questions || []),
  ]

  if (allQuestions.length > 0) {
    const scoreHeaders = ['Question', ...allQuestions.map(q => `Q${q.num}`), 'Total']
    const scoreMarks   = ['Marks',   ...allQuestions.map(q => q.marks ?? ''),  meta.totalMarks]
    const scoreBlank   = ["Learner's Score", ...allQuestions.map(() => ''), '']

    autoTable(doc, {
      startY: y,
      head: [scoreHeaders],
      body: [scoreMarks, scoreBlank],
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 7,
        cellPadding: 2,
        halign: 'center',
        lineColor: [180, 180, 180],
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: colors.blue,
        textColor: colors.white,
        fontStyle: 'bold',
        fontSize: 7,
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', fillColor: colors.lightGray },
      },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      theme: 'grid',
    })
    y = doc.lastAutoTable.finalY + 8
  }

  // ── Footer on page 1 ──────────────────────────────
  addFooter(1)
  // ── Diagram rendering helper ────────────────────────────
  // If diagram.svg exists: convert to PNG and embed (real AI diagram).
  // Otherwise: draw a clean labelled placeholder box.
  const drawDiagram = async (diagram) => {
    if (!diagram?.type) return

    if (diagram.svg) {
      // Render AI-generated SVG as image
      const dataUrl = await svgToDataUrl(diagram.svg, 280, 200)
      if (dataUrl) {
        const imgW = contentW - 20       // fit within content width with small margins
        const imgH = imgW * (200 / 280)  // maintain 280:200 aspect ratio
        checkPage(imgH + 10)
        doc.addImage(dataUrl, 'PNG', margin + 10, y, imgW, imgH)
        y += imgH + 4
        if (diagram.caption) {
          doc.setFont('helvetica', 'italic')
          doc.setFontSize(8)
          doc.setTextColor(...colors.gray)
          doc.text(diagram.caption, pageW / 2, y, { align: 'center' })
          y += 5
        }
        return
      }
      // SVG conversion failed — fall through to placeholder
    }

    // Placeholder box (no SVG available)
    const caption = diagram.caption || `Figure (${diagram.type.replace(/_/g, ' ')})`
    const boxH = 36
    checkPage(boxH + 6)
    doc.setDrawColor(...colors.gray)
    doc.setLineWidth(0.5)
    doc.setLineDashPattern([3, 2], 0)
    doc.roundedRect(margin + 10, y, contentW - 20, boxH, 2, 2, 'S')
    doc.setLineDashPattern([], 0)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8.5)
    doc.setTextColor(...colors.gray)
    doc.text(caption, pageW / 2, y + boxH / 2 - 2, { align: 'center' })
    doc.setFontSize(7.5)
    doc.text('[ Diagram — see digital preview ]', pageW / 2, y + boxH / 2 + 5, { align: 'center' })
    y += boxH + 5
  }

  // ── Question text renderer ──────────────────────────────
  // Renders question text which may contain an embedded markdown table.
  // Returns the y-advance so the caller knows where y ended up.
  const renderQuestionText = (text, indentLeft = margin) => {
    const maxW = pageW - margin - indentLeft
    const { before, table, after } = splitTextAroundTable(text || '')

    // Before-table text
    if (before) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(...colors.black)
      const lines = doc.splitTextToSize(before, maxW)
      doc.text(lines, indentLeft, y)
      y += lines.length * 5 + 2
    }

    // Table (if any)
    if (table) {
      checkPage(table.rows.length * 8 + 16)
      autoTable(doc, {
        startY: y,
        head: [table.headers],
        body: table.rows,
        margin: { left: indentLeft, right: margin },
        styles: {
          fontSize: 8.5,
          cellPadding: 2.5,
          textColor: colors.black,
          lineColor: [180, 180, 180],
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: colors.blue,
          textColor: colors.white,
          fontStyle: 'bold',
          fontSize: 8.5,
        },
        alternateRowStyles: { fillColor: [245, 247, 252] },
        theme: 'grid',
      })
      y = doc.lastAutoTable.finalY + 4
    }

    // After-table text
    if (after) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(...colors.black)
      const lines = doc.splitTextToSize(after, maxW)
      doc.text(lines, indentLeft, y)
      y += lines.length * 5 + 2
    }
  }
  if (exam.sectionA?.questions?.length) {
    checkPage(20)
    y += 4
    doc.setFillColor(...colors.blue)
    doc.roundedRect(margin, y, contentW, 8, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...colors.white)
    doc.text(`SECTION A — SHORT ANSWER  (${exam.sectionA.marks} marks)`, margin + 5, y + 5.5)
    y += 12

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8.5)
    doc.setTextColor(...colors.gray)
    doc.text(exam.sectionA.instruction || '', margin, y)
    y += 7

    for (const q of exam.sectionA.questions) {
      checkPage(30)
      const hasSubParts = Array.isArray(q.subParts) && q.subParts.length > 0

      // Question number prefix
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(...colors.black)
      doc.text(`${q.num}.`, margin, y)

      if (!hasSubParts) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(...colors.gray)
        doc.text(`(${q.marks} mark${Number(q.marks) === 1 ? '' : 's'})`, pageW - margin, y, { align: 'right' })
      }

      // Question body (handles embedded tables)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(...colors.black)
      renderQuestionText(q.text, margin + 6)
      y += qLines.length * 5 + 2

      if (q.diagram) await drawDiagram(q.diagram)

      if (q.options) {
        const half = Math.ceil(q.options.length / 2)
        q.options.forEach((opt, oi) => {
          const col = oi < half ? margin + 8 : pageW / 2
          const optY = y + (oi % half) * 5
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          doc.text(opt, col, optY)
        })
        y += half * 5 + 4
      } else if (hasSubParts) {
        for (const sp of q.subParts) {
          checkPage(20)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          doc.setTextColor(...colors.black)
          const spLines = doc.splitTextToSize(sp.text, contentW - 25)
          doc.text(spLines, margin + 8, y)
          doc.setFontSize(8)
          doc.setTextColor(...colors.gray)
          doc.text(`(${sp.marks} mark${Number(sp.marks) === 1 ? '' : 's'})`, pageW - margin, y, { align: 'right' })
          y += spLines.length * 5 + 2
          const lineCount = Math.min(Math.max(Number(sp.marks) * 2, 2), 6)
          for (let i = 0; i < lineCount; i++) {
            doc.setDrawColor(...colors.lightGray)
            doc.setLineWidth(0.3)
            doc.line(margin + 8, y, pageW - margin, y)
            y += 5
          }
          y += 2
        }
      } else {
        // Simple answer lines for flat questions
        const lineCount = Math.min(Math.max(Number(q.marks) * 2, 2), 6)
        for (let i = 0; i < lineCount; i++) {
          doc.setDrawColor(...colors.lightGray)
          doc.setLineWidth(0.3)
          doc.line(margin, y, pageW - margin, y)
          y += 5
        }
      }
      y += 4
    }
  }

  // ── SECTION B ──────────────────────────────────────
  if (exam.sectionB?.questions?.length) {
    checkPage(20)
    addFooter(doc.internal.getNumberOfPages())
  doc.addPage()
    y = margin

    doc.setFillColor(...colors.blue)
    doc.roundedRect(margin, y, contentW, 8, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...colors.white)
    // BUG 2 FIX: Section B is STRUCTURED QUESTIONS, not SHORT ANSWER
    doc.text(`SECTION B — STRUCTURED QUESTIONS  (${exam.sectionB.marks} marks)`, margin + 5, y + 5.5)
    y += 12

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8.5)
    doc.setTextColor(...colors.gray)
    doc.text(exam.sectionB.instruction || '', margin, y)
    y += 7

    for (const q of exam.sectionB.questions) {
      checkPage(35)
      const hasSubParts = Array.isArray(q.subParts) && q.subParts.length > 0

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(...colors.black)
      doc.text(`${q.num}.`, margin, y)

      if (!hasSubParts) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(...colors.gray)
        doc.text(`(${q.marks} marks)`, pageW - margin, y, { align: 'right' })
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(...colors.black)
      renderQuestionText(q.text, margin + 6)

      if (q.diagram) await drawDiagram(q.diagram)

      if (hasSubParts) {
        for (const sp of q.subParts) {
          checkPage(25)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          doc.setTextColor(...colors.black)
          const spLines = doc.splitTextToSize(sp.text, contentW - 25)
          doc.text(spLines, margin + 8, y)
          doc.setFontSize(8)
          doc.setTextColor(...colors.gray)
          doc.text(`(${sp.marks} mark${Number(sp.marks) === 1 ? '' : 's'})`, pageW - margin, y, { align: 'right' })
          y += spLines.length * 5 + 2
          const lineCount = Math.min(Math.max(Number(sp.marks) * 2, 2), 8)
          for (let i = 0; i < lineCount; i++) {
            doc.setDrawColor(...colors.lightGray)
            doc.setLineWidth(0.3)
            doc.line(margin + 8, y, pageW - margin, y)
            y += 6
          }
          y += 3
        }
      } else {
        for (let i = 0; i < 3; i++) {
          doc.setDrawColor(...colors.lightGray)
          doc.setLineWidth(0.3)
          doc.line(margin, y, pageW - margin, y)
          y += 6
        }
      }
      y += 4
    }
  }

  // ── SECTION C ──────────────────────────────────────
  if (exam.sectionC?.questions?.length) {
    checkPage(20)
    addFooter(doc.internal.getNumberOfPages())
  doc.addPage()
    y = margin

    doc.setFillColor(...colors.blue)
    doc.roundedRect(margin, y, contentW, 8, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...colors.white)
    doc.text(`SECTION C — STRUCTURED QUESTIONS  (${exam.sectionC.marks} marks)`, margin + 5, y + 5.5)
    y += 12

    for (const q of exam.sectionC.questions) {
      checkPage(50)
      const hasSubParts = Array.isArray(q.subParts) && q.subParts.length > 0

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(...colors.black)
      doc.text(`${q.num}.`, margin, y)

      if (!hasSubParts) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(...colors.gray)
        doc.text(`(${q.marks} marks)`, pageW - margin, y, { align: 'right' })
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(...colors.black)
      renderQuestionText(q.text, margin + 6)

      // Diagram (below stem, above sub-parts)
      if (q.diagram) await drawDiagram(q.diagram)

      // Sub-parts (a, b, c...)
      if (hasSubParts) {
        for (const sp of q.subParts) {
          checkPage(30)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          doc.setTextColor(...colors.black)
          const spLines = doc.splitTextToSize(sp.text, contentW - 25)
          doc.text(spLines, margin + 8, y)
          doc.setFontSize(8)
          doc.setTextColor(...colors.gray)
          doc.text(`(${sp.marks} mark${Number(sp.marks) === 1 ? '' : 's'})`, pageW - margin, y, { align: 'right' })
          y += spLines.length * 5 + 2
          // Answer lines per sub-part (2 lines per mark, min 2, max 8)
          const lineCount = Math.min(Math.max(Number(sp.marks) * 2, 2), 8)
          for (let i = 0; i < lineCount; i++) {
            doc.setDrawColor(...colors.lightGray)
            doc.setLineWidth(0.3)
            doc.line(margin + 8, y, pageW - margin, y)
            y += 6
          }
          y += 3
        }
      } else {
        // No sub-parts — draw answer lines based on total marks
        const lineCount = Math.min(Math.max(Number(q.marks) * 2, 6), 14)
        for (let i = 0; i < lineCount; i++) {
          doc.setDrawColor(...colors.lightGray)
          doc.setLineWidth(0.3)
          doc.line(margin, y, pageW - margin, y)
          y += 7
        }
      }
      y += 5
    }
  }

  // ── MARKING SCHEME ─────────────────────────────────
  addFooter(doc.internal.getNumberOfPages())
  doc.addPage()
  y = margin

  doc.setFillColor(...colors.red)
  doc.rect(margin, y, contentW, 10, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...colors.white)
  doc.text('MARKING SCHEME', pageW / 2, y + 7, { align: 'center' })
  y += 16

  doc.setFontSize(9)
  doc.setTextColor(...colors.gray)
  doc.setFont('helvetica', 'italic')
  doc.text(`${meta.grade} ${meta.subject} ${meta.examType} — ${meta.term} ${meta.year} | Total: ${meta.totalMarks} marks`, pageW / 2, y, { align: 'center' })
  y += 10

  // BUG 3 FIX: renderSchemeSection now handles subParts correctly
  const renderSchemeSection = (section, label) => {
    if (!section?.questions?.length) return
    checkPage(15)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...colors.blue)
    doc.text(label, margin, y)
    y += 7

    section.questions.forEach((q) => {
      const hasSubParts = Array.isArray(q.subParts) && q.subParts.length > 0
      const qMarks = hasSubParts
        ? q.subParts.reduce((s, sp) => s + (Number(sp.marks) || 0), 0)
        : (Number(q.marks) || 0)

      checkPage(20)

      // Build answer lines to render
      let answerLines = []
      if (hasSubParts) {
        q.subParts.forEach(sp => {
          const header = `(${sp.label}) [${sp.marks} ${Number(sp.marks) === 1 ? 'mark' : 'marks'}]`
          answerLines.push(...doc.splitTextToSize(header, contentW - 30))
          answerLines.push(...doc.splitTextToSize(sp.answer || '—', contentW - 34))
        })
      } else {
        answerLines = doc.splitTextToSize(q.answer || '—', contentW - 30)
      }

      const boxH = answerLines.length * 5 + 10
      checkPage(boxH + 4)

      doc.setFillColor(240, 247, 255)
      doc.roundedRect(margin, y, contentW, boxH, 2, 2, 'F')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(...colors.blue)
      doc.text(`Q${q.num}`, margin + 4, y + 6)

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...colors.red)
      doc.text(`${qMarks}mk${qMarks > 1 ? 's' : ''}`, pageW - margin - 4, y + 6, { align: 'right' })

      // Render answer content
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...colors.black)
      let lineY = y + 6
      answerLines.forEach(line => {
        doc.text(line, margin + 14, lineY)
        lineY += 5
      })

      y += boxH + 3
    })
    y += 4
  }

  renderSchemeSection(exam.sectionA, 'SECTION A — Short Answer')
  renderSchemeSection(exam.sectionB, 'SECTION B — Structured Questions')
  renderSchemeSection(exam.sectionC, 'SECTION C — Extended Questions')

  // ── Stamp footer on every page (overwrite with final page count) ───────────
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    const footerY = doc.internal.pageSize.getHeight() - 8
    // Clear the area first
    doc.setFillColor(255, 255, 255)
    doc.rect(margin - 2, footerY - 6, contentW + 4, 10, 'F')
    // Separator line
    doc.setDrawColor(...colors.lightGray)
    doc.setLineWidth(0.2)
    doc.line(margin, footerY - 3, pageW - margin, footerY - 3)
    // SmartSchool Digital watermark text
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...colors.gray)
    doc.text(
      `SmartSchool Digital  |  ${meta.school || 'Kenya Public School'}  |  ${meta.subject}  |  ${meta.grade}  |  ${meta.examType} ${meta.term} ${meta.year}`,
      pageW / 2, footerY, { align: 'center' }
    )
    doc.text(`Page ${i} of ${totalPages}`, pageW - margin, footerY, { align: 'right' })
  }

  const filename = `${meta.school}_${meta.grade}_${meta.subject}_${meta.examType}_${meta.term}_${meta.year}.pdf`
    .replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '')

  doc.save(filename)
  return filename
}
