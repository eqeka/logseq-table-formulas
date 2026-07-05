# Table Formulas for Logseq

Spreadsheet formulas in your Logseq tables. Type a formula in a cell — see
the answer right next to it.

![Table Formulas in action](./screenshot.png)

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
- Cells are addressed the usual spreadsheet way: **A1 is the top-left cell,
  the header row counts as row 1**
- About 400 functions are supported: SUM, AVERAGE, IF, COUNT, MIN, MAX,
  ROUND, VLOOKUP and so on
- Numbers like `12.5`, `12,5`, `1 000` and `50%` are all understood
- Errors are shown right in the cell: `#DIV/0!`, `#NAME?`

## Formula cheat sheet

Never used spreadsheet formulas? Here's most of what you'll ever need.
Examples assume numbers are in column B, rows 2 to 5.

| Formula | What it does |
|---------|--------------|
| `=B2+B3` | add two cells (also `-`, `*`, `/`) |
| `=(B2+B3)*2` | parentheses work as usual |
| `=SUM(B2:B5)` | add up a whole range |
| `=SUM(B2:B5)-B4` | mix functions and math freely |
| `=AVERAGE(B2:B5)` | average of a range |
| `=MIN(B2:B5)` / `=MAX(B2:B5)` | smallest / largest value |
| `=COUNT(B2:B5)` | how many numbers are in the range |
| `=ROUND(B2/3, 2)` | round to 2 decimal places |
| `=B2*15%` | percentages just work |
| `=IF(B2>100, "too much", "ok")` | show one thing or another based on a condition |
| `=SUMIF(A2:A5, "Food", B2:B5)` | sum only the rows where column A says "Food" |
| `=COUNTIF(A2:A5, "Food")` | count the rows where column A says "Food" |
| `=A2&" / "&A3` | glue text together |

`B2:B5` means "cells B2 through B5". One thing to keep in mind: don't make a
range include the cell the formula itself is in — that's a circular
reference and you'll get `#CYCLE!`. So a total at the bottom of a column
should sum the rows above it, like the `=SUM(B2:B5)` in row 6 does.

Small print: each table is calculated on its own (no references between
tables), function names are English, and inside a formula the decimal
separator is a dot — `=ROUND(B2/3, 2)`.

## License

GPL-3.0. Formula engine:
[HyperFormula](https://hyperformula.handsontable.com/).
