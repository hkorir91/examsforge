import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function generateExamPDF(exam, meta) {
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

  // ── COVER PAGE ─────────────────────────────────────
  // Kenya flag stripe at top
  const stripeH = 4
  const stripeW = contentW / 5
  const flagColors = [[0, 102, 0], [204, 0, 0], [0, 0, 0], [204, 0, 0], [0, 102, 0]]
  flagColors.forEach((c, i) => {
    doc.setFillColor(...c)
    doc.rect(margin + i * stripeW, y, stripeW, stripeH, 'F')
  })
  y += stripeH + 8

  // School name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...colors.black)
  doc.text((meta.school || 'Kenya Public School').toUpperCase(), pageW / 2, y, { align: 'center' })
  y += 6

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9)
  doc.setTextColor(...colors.gray)
  doc.text('Excellence in Education', pageW / 2, y, { align: 'center' })
  y += 10

  drawLine(colors.blue)

  // Exam title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(...colors.blue)
  const title = exam.title || `${meta.grade} ${meta.subject} ${meta.examType} Examination`
  doc.text(title, pageW / 2, y, { align: 'center' })
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...colors.gray)
  doc.text(`${meta.term} ${meta.year} Examination`, pageW / 2, y, { align: 'center' })
  y += 10

  // Info grid
  doc.setFillColor(...colors.lightGray)
  doc.roundedRect(margin, y, contentW, 28, 3, 3, 'F')

  const col1 = margin + 6
  const col2 = pageW / 2 + 6
  const rowH = 7

  const infoRows = [
    [`Grade / Class: ${meta.grade}`, `Subject: ${meta.subject}`],
    [`Strand: ${meta.strand}`, `Sub-Strand: ${meta.substrand || 'General'}`],
    [`Duration: ${exam.time || '1 hour 30 minutes'}`, `Total Marks: ${meta.totalMarks}`],
    [`Term: ${meta.term}`, `Year: ${meta.year}`],
  ]

  doc.setFontSize(9)
  infoRows.forEach((row, i) => {
    const rowY = y + 6 + i * rowH
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...colors.black)
    doc.text(row[0], col1, rowY)
    doc.text(row[1], col2, rowY)
  })
  y += 35

  // Instructions box
  doc.setDrawColor(...colors.red)
  doc.setLineWidth(0.5)
  doc.roundedRect(margin, y, contentW, 38, 3, 3, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...colors.red)
  doc.text('INSTRUCTIONS TO CANDIDATES', margin + 5, y + 7)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...colors.black)
  const instructions = exam.instructions || []
  instructions.forEach((inst, i) => {
    const txt = `${i + 1}. ${inst}`
    const lines = doc.splitTextToSize(txt, contentW - 10)
    doc.text(lines, margin + 5, y + 14 + i * 5)
  })
  y += 45

  // ── SECTION A ──────────────────────────────────────
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

    exam.sectionA.questions.forEach((q) => {
      checkPage(30)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(...colors.black)
      const qLines = doc.splitTextToSize(`${q.num}. ${q.text}`, contentW - 15)
      doc.text(qLines, margin, y)
      y += qLines.length * 5 + 2

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
      }
    })
  }

  // ── SECTION B ──────────────────────────────────────
  if (exam.sectionB?.questions?.length) {
    checkPage(20)
    doc.addPage()
    y = margin

    doc.setFillColor(...colors.blue)
    doc.roundedRect(margin, y, contentW, 8, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...colors.white)
    doc.text(`SECTION B — SHORT ANSWER  (${exam.sectionB.marks} marks)`, margin + 5, y + 5.5)
    y += 12

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8.5)
    doc.setTextColor(...colors.gray)
    doc.text(exam.sectionB.instruction || '', margin, y)
    y += 7

    exam.sectionB.questions.forEach((q) => {
      checkPage(35)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(...colors.black)
      const qLines = doc.splitTextToSize(`${q.num}. ${q.text}`, contentW - 15)
      doc.text(qLines, margin, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...colors.gray)
      doc.text(`(${q.marks} marks)`, pageW - margin, y, { align: 'right' })
      y += qLines.length * 5 + 3
      // Answer lines
      for (let i = 0; i < 3; i++) {
        doc.setDrawColor(...colors.lightGray)
        doc.setLineWidth(0.3)
        doc.line(margin, y, pageW - margin, y)
        y += 6
      }
      y += 3
    })
  }

  // ── SECTION C ──────────────────────────────────────
  if (exam.sectionC?.questions?.length) {
    checkPage(20)
    doc.addPage()
    y = margin

    doc.setFillColor(...colors.blue)
    doc.roundedRect(margin, y, contentW, 8, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...colors.white)
    doc.text(`SECTION C — STRUCTURED QUESTIONS  (${exam.sectionC.marks} marks)`, margin + 5, y + 5.5)
    y += 12

    exam.sectionC.questions.forEach((q) => {
      checkPage(50)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(...colors.black)
      const parts = q.text.split('\n')
      parts.forEach((part) => {
        const lines = doc.splitTextToSize(part, contentW - 15)
        doc.text(lines, margin, y)
        y += lines.length * 5 + 1
      })
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...colors.gray)
      doc.text(`(${q.marks} marks)`, pageW - margin, y - 4, { align: 'right' })
      for (let i = 0; i < 6; i++) {
        doc.setDrawColor(...colors.lightGray)
        doc.line(margin, y, pageW - margin, y)
        y += 7
      }
      y += 4
    })
  }

  // ── MARKING SCHEME ─────────────────────────────────
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

  const renderSchemeSection = (section, label) => {
    if (!section?.questions?.length) return
    checkPage(15)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...colors.blue)
    doc.text(label, margin, y)
    y += 7

    section.questions.forEach((q) => {
      checkPage(20)
      doc.setFillColor(240, 247, 255)
      const ansLines = doc.splitTextToSize(q.answer || '', contentW - 30)
      const boxH = ansLines.length * 5 + 10
      doc.roundedRect(margin, y, contentW, boxH, 2, 2, 'F')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(...colors.blue)
      doc.text(`Q${q.num}`, margin + 4, y + 6)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...colors.black)
      doc.text(ansLines, margin + 14, y + 6)

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...colors.red)
      doc.text(`${q.marks}mk${q.marks > 1 ? 's' : ''}`, pageW - margin - 4, y + 6, { align: 'right' })

      y += boxH + 3
    })
    y += 4
  }

  renderSchemeSection(exam.sectionA, 'SECTION A — Multiple Choice')
  renderSchemeSection(exam.sectionB, 'SECTION B — Short Answer')
  renderSchemeSection(exam.sectionC, 'SECTION C — Structured Questions')

  // Footer on all pages
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...colors.gray)
    doc.text(
      `SmartSchool Digital — ${meta.school} — ${meta.grade} ${meta.subject} ${meta.examType} ${meta.term} ${meta.year}`,
      margin, doc.internal.pageSize.getHeight() - 8
    )
    doc.text(`Page ${i} of ${totalPages}`, pageW - margin, doc.internal.pageSize.getHeight() - 8, { align: 'right' })
  }

  const filename = `${meta.school}_${meta.grade}_${meta.subject}_${meta.examType}_${meta.term}_${meta.year}.pdf`
    .replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '')

  doc.save(filename)
  return filename
}
