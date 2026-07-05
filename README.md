# Table Formulas for Logseq

Excel formulas in your Logseq tables. Type a formula in a cell — see the
answer right next to it.

```
| Item  | Price | Qty | Total       |
|-------|-------|-----|-------------|
| Bread | 50    | 2   | =B2*C2      |
| Milk  | 90    | 3   | =B3*C3      |
| Total |       |     | =SUM(D2:D3) |
```

renders as `=SUM(D2:D3) = 370`.

Your notes are never touched — the plugin only adds the answer on screen.
Click the block to edit and you'll see your plain formula, exactly as you
typed it. Works with all tables you already have.

## Install

### From the Marketplace

1. Open Logseq
2. Click `⋯` (top right) → **Plugins** → **Marketplace**
3. Search for **Table Formulas** and click **Install**

Done. Open any page with a table and formulas just work.

### Manually

1. Download the latest `logseq-table-formulas.zip` from
   [Releases](../../releases) and unzip it
2. In Logseq go to **Settings → Advanced** and turn on **Developer mode**
3. Click `⋯` → **Plugins** → **Load unpacked plugin**
4. Pick the unzipped folder

## How to use

- Start a cell with `=` — that's a formula: `=B2*C2`, `=SUM(A2:A10)`,
  `=IF(C2>100, "yes", "no")`
- Cells are addressed like in Excel: **A1 is the top-left cell, the header
  row counts as row 1**
- Almost all Excel functions work (about 400 of them): SUM, AVERAGE, IF,
  COUNT, MIN, MAX, ROUND, VLOOKUP and so on
- Numbers like `12.5`, `12,5`, `1 000` and `50%` are all understood
- Errors look like in Excel: `#DIV/0!`, `#NAME?`

Small print: each table is calculated on its own (no references between
tables), function names are English, and inside a formula the decimal
separator is a dot — `=ROUND(B2/3, 2)`.

## License

GPL-3.0. Formula engine:
[HyperFormula](https://hyperformula.handsontable.com/).
