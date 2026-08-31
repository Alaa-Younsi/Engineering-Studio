import type { Submission } from './content/types'
import { SUBMISSION_LABELS, formatSubmissionDate } from './content/types'

/**
 * CSV export of the form submissions ("Demandes") shown in the admin dashboard.
 *
 * The client runs follow-up off this file, so it opens cleanly in Excel /
 * Google Sheets: a UTF-8 BOM keeps the accents intact, `;` is the separator
 * French Excel expects, and every value is passed through `csvSafe()` so a
 * visitor-supplied name/message beginning with `= + - @` can't execute as a
 * formula when the dispatcher opens it (CSV/Excel formula injection).
 */

const SEP = ';'

/** Quote a field and neutralise leading formula characters. */
export function csvSafe(value: string): string {
  const v = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return `"${v.replace(/"/g, '""')}"`
}

const joinFields = (rows: { label: string; value: string }[]) =>
  rows.map((f) => `${f.label}: ${f.value}`).join(' | ')

export function submissionsToCsv(rows: Submission[]): string {
  const header = ['Date', 'Type', 'Nom', 'Email', 'Téléphone', 'Lu', 'Champs', 'Pièces jointes']
  const lines = rows.map((s) =>
    [
      formatSubmissionDate(s.createdAt),
      SUBMISSION_LABELS[s.kind],
      s.name,
      s.email,
      s.phone ?? '',
      s.read ? 'oui' : 'non',
      joinFields(s.fields),
      (s.attachments ?? []).map((a) => a.name).join(' | '),
    ]
      .map((c) => csvSafe(String(c)))
      .join(SEP),
  )
  // Leading BOM so Excel reads it as UTF-8 rather than the system code page.
  return '﻿' + [header.map(csvSafe).join(SEP), ...lines].join('\r\n')
}

/** Builds the CSV and prompts a download. */
export function downloadSubmissionsCsv(rows: Submission[]): void {
  const blob = new Blob([submissionsToCsv(rows)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const today = new Date().toISOString().slice(0, 10)
  const a = document.createElement('a')
  a.href = url
  a.download = `demandes-${today}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
