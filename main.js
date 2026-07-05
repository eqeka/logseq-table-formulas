/**
 * Table Formulas — Excel-like formulas in Logseq markdown tables.
 *
 * How it works: the plugin watches the *rendered* page (not the editor),
 * finds tables, feeds each one into HyperFormula and appends the computed
 * result next to every cell that starts with "=".
 *
 * The source markdown is never modified, so editing a block shows the raw
 * formula exactly as the user typed it.
 *
 * Cell addressing: A1 = top-left cell of the table, the header row is row 1.
 */

'use strict';

const RESULT_CLASS = 'htf-result';
const DEBOUNCE_MS = 250;

// The UMD bundle exposes a namespace object; the class lives inside it.
const HF = window.HyperFormula.HyperFormula || window.HyperFormula;

let applying = false; // true while we mutate the DOM ourselves
let scheduled = null;

function parentDoc() {
  return window.parent.document;
}

/* ---------- value parsing ---------- */

// "1 234,56" -> 1234.56, "50%" -> 0.5, otherwise null
function parseNumberLike(text) {
  let t = text.replace(/[\s  ]/g, '');
  let percent = false;
  if (t.endsWith('%')) {
    percent = true;
    t = t.slice(0, -1);
  }
  if (!/^-?\d+(?:[.,]\d+)?$/.test(t)) return null;
  const n = parseFloat(t.replace(',', '.'));
  if (Number.isNaN(n)) return null;
  return percent ? n / 100 : n;
}

// Raw text of a cell, ignoring any result span we previously appended.
function cellRaw(td) {
  if (td.dataset.htfRaw !== undefined) return td.dataset.htfRaw;
  const clone = td.cloneNode(true);
  clone.querySelectorAll('.' + RESULT_CLASS).forEach((s) => s.remove());
  return clone.textContent.trim();
}

function isFormula(raw) {
  return raw.length > 1 && raw.startsWith('=');
}

function isCellError(v) {
  return (
    v !== null &&
    typeof v === 'object' &&
    typeof v.value === 'string' &&
    v.value.startsWith('#')
  );
}

function formatValue(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) return String(v);
    return String(Math.round(v * 1e6) / 1e6);
  }
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
  if (isCellError(v)) return v.value;
  return String(v);
}

/* ---------- table processing ---------- */

function tableCells(table) {
  const rows = [];
  for (const tr of table.querySelectorAll('tr')) {
    const cells = Array.from(tr.children).filter(
      (el) => el.tagName === 'TD' || el.tagName === 'TH'
    );
    if (cells.length) rows.push(cells);
  }
  return rows;
}

function processTable(table) {
  const rows = tableCells(table);
  if (!rows.length) return;

  const raws = rows.map((row) => row.map(cellRaw));
  const hash = JSON.stringify(raws);
  if (table.dataset.htfHash === hash) return; // already up to date
  table.dataset.htfHash = hash;

  const hasFormulas = raws.some((row) => row.some(isFormula));
  if (!hasFormulas) return;

  const data = raws.map((row) =>
    row.map((raw) => {
      if (isFormula(raw)) return raw;
      const n = parseNumberLike(raw);
      return n === null ? raw : n;
    })
  );

  let hf;
  try {
    hf = HF.buildFromArray(data, { licenseKey: 'gpl-v3' });
  } catch (e) {
    console.error('[table-formulas] engine error:', e);
    return;
  }

  try {
    rows.forEach((row, r) => {
      row.forEach((td, c) => {
        const raw = raws[r][c];
        if (!isFormula(raw)) return;

        let value;
        try {
          value = hf.getCellValue({ sheet: 0, row: r, col: c });
        } catch (e) {
          value = { value: '#ERROR!' };
        }

        td.dataset.htfRaw = raw;
        td.querySelectorAll('.' + RESULT_CLASS).forEach((s) => s.remove());

        const span = parentDoc().createElement('span');
        span.className =
          RESULT_CLASS + (isCellError(value) ? ' htf-error' : '');
        span.textContent = ' = ' + formatValue(value);
        td.appendChild(span);
      });
    });
  } finally {
    hf.destroy();
  }
}

function processAll() {
  const doc = parentDoc();
  const root = doc.getElementById('app-container') || doc.body;
  applying = true;
  try {
    root.querySelectorAll('table').forEach(processTable);
  } finally {
    // let the observer see our mutations before re-enabling it
    setTimeout(() => {
      applying = false;
    }, 0);
  }
}

function processSoon() {
  if (scheduled) clearTimeout(scheduled);
  scheduled = setTimeout(() => {
    scheduled = null;
    processAll();
  }, DEBOUNCE_MS);
}

/* ---------- plugin entry ---------- */

function main() {
  logseq.provideStyle(`
    .${RESULT_CLASS} {
      color: var(--ls-link-text-color, #3b82f6);
      font-weight: 600;
      white-space: nowrap;
    }
    .${RESULT_CLASS}.htf-error {
      color: var(--ls-error-text-color, #ef4444);
    }
  `);

  const doc = parentDoc();
  const observer = new MutationObserver((mutations) => {
    if (applying) return;
    // ignore mutations caused only by our own result spans
    const relevant = mutations.some((m) => {
      const t = m.target;
      if (t.nodeType === 1 && t.classList.contains(RESULT_CLASS)) return false;
      return true;
    });
    if (relevant) processSoon();
  });
  observer.observe(doc.getElementById('app-container') || doc.body, {
    childList: true,
    subtree: true,
  });

  if (logseq.App && logseq.App.onRouteChanged) {
    logseq.App.onRouteChanged(() => setTimeout(processAll, 400));
  }

  setTimeout(processAll, 500);
  console.info('[table-formulas] loaded');
}

logseq.ready(main).catch(console.error);
