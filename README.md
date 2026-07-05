# Table Formulas for Logseq

Excel-like formulas in plain Logseq markdown tables. Type `=SUM(A1:A3)` in a
cell — the computed result appears right next to it: `=SUM(A1:A3) = 42`.

- **Non-destructive.** The plugin only decorates the *rendered* page. Your
  markdown is never modified: click into the block and you see the plain
  formula you typed — no cursor jumps, no hidden state.
- **Works with all your existing tables.** Install the plugin and every table
  in every page that contains `=...` cells gets results immediately.
- **Real formula engine.** Powered by
  [HyperFormula](https://hyperformula.handsontable.com/) — ~400 Excel
  functions (SUM, AVERAGE, IF, COUNT, MIN, MAX, VLOOKUP, ROUND,
  CONCATENATE…), ranges, arithmetic, nested formulas.

## Usage

A regular markdown table; a formula is any cell starting with `=`:

```
| Item  | Price | Qty | Total       |
|-------|-------|-----|-------------|
| Bread | 50    | 2   | =B2*C2      |
| Milk  | 90    | 3   | =B3*C3      |
| Total |       |     | =SUM(D2:D3) |
```

Addressing works like Excel: **A1 is the top-left cell of the table, the
header row is row 1.** Columns are A, B, C…; rows are 1, 2, 3… Each table is
computed independently (no cross-table references).

Numbers in cells are recognized in the forms `1234`, `12.5`, `12,5`,
`1 000`, `50%`. Errors are shown Excel-style: `#DIV/0!`, `#NAME?`, `#REF!`.

## Installation

From the marketplace: `⋯ → Plugins → Marketplace → Table Formulas`.

Manually:

1. In Logseq enable `Settings → Advanced → Developer mode`.
2. `⋯ → Plugins → Load unpacked plugin` and pick this folder.

## Notes & limitations

- Results are shown in view mode only; while editing a block you see the raw
  formula (by design).
- Function names are English, arguments are separated by commas, the decimal
  separator inside a formula is a dot: `=ROUND(B2/3, 2)`.

## License

GPL-3.0 (required by the bundled HyperFormula engine, which is dual-licensed
and used here under GPLv3).

---

## По-русски

Excel-формулы в обычных markdown-таблицах Logseq: пишешь в ячейке
`=SUM(A1:A3)` — рядом появляется ответ. Исходный текст не изменяется, при
редактировании блока видна обычная формула, курсор не сбивается. Работает со
всеми существующими таблицами сразу после установки. Адресация как в Excel:
A1 — левая верхняя ячейка, строка заголовков — строка 1. Каждая таблица
считается независимо. Названия функций английские, десятичный разделитель в
формуле — точка: `=ROUND(B2/3, 2)`.
