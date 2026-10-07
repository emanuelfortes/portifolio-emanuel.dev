import { Fragment, type ReactNode } from "react";

/**
 * Markdown → React, no lugar de react-markdown + remark-gfm + rehype-slug, que
 * não estão instalados no portfólio.
 *
 * Cobre o que os .md de content/ usam (conferido em todos os arquivos):
 * parágrafos, títulos (com id no padrão do rehype-slug), listas com marcador e
 * numeradas, citações, tabelas GFM, linha horizontal, negrito, itálico, código
 * em linha e links. O HTML gerado é o mesmo do react-markdown: parágrafos em
 * <p>, listas compactas sem <p> nos itens, tabela com <thead>/<tbody> e
 * `data-label` nas células (o rehypeTableLabels do original).
 */

/* -------------------------------------------------------------------------- */
/*  Blocos                                                                     */
/* -------------------------------------------------------------------------- */

type Align = "left" | "center" | "right" | null;

type MdBlock =
  | { t: "p"; text: string }
  | { t: "h"; level: number; text: string }
  | { t: "hr" }
  | { t: "quote"; children: MdBlock[] }
  | { t: "list"; ordered: boolean; start: number; loose: boolean; items: MdBlock[][] }
  | { t: "table"; align: Align[]; head: string[]; rows: string[][] };

const HEADING = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/;
const HR = /^ {0,3}((?:-[ \t]*){3,}|(?:\*[ \t]*){3,}|(?:_[ \t]*){3,})$/;
const QUOTE = /^ {0,3}>/;
const LIST_ITEM = /^( {0,3})([-*+]|\d{1,9}[.)])([ \t]+|$)(.*)$/;
const TABLE_DELIM = /^ {0,3}\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const SETEXT = /^ {0,3}(=+|-+)\s*$/;

const isBlank = (l: string) => /^\s*$/.test(l);

function splitRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|") && !s.endsWith("\\|")) s = s.slice(0, -1);
  const cells: string[] = [];
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "\\" && s[i + 1] === "|") {
      cur += "|";
      i++;
    } else if (s[i] === "|") {
      cells.push(cur.trim());
      cur = "";
    } else cur += s[i];
  }
  cells.push(cur.trim());
  return cells;
}

/** Linha que começa outro bloco (interrompe um parágrafo). */
function startsBlock(line: string): boolean {
  if (HEADING.test(line) || HR.test(line) || QUOTE.test(line)) return true;
  const li = line.match(LIST_ITEM);
  if (li && li[4].trim() !== "") {
    // lista numerada só interrompe parágrafo começando em 1
    return !/^\d/.test(li[2]) || /^1[.)]$/.test(li[2]);
  }
  return false;
}

function parseBlocks(lines: string[]): MdBlock[] {
  const out: MdBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) {
      i++;
      continue;
    }

    const h = line.match(HEADING);
    if (h) {
      out.push({ t: "h", level: h[1].length, text: (h[2] ?? "").trim() });
      i++;
      continue;
    }

    if (HR.test(line)) {
      out.push({ t: "hr" });
      i++;
      continue;
    }

    if (QUOTE.test(line)) {
      const inner: string[] = [];
      while (i < lines.length && !isBlank(lines[i])) {
        const l = lines[i];
        if (QUOTE.test(l)) inner.push(l.replace(/^ {0,3}> ?/, ""));
        else if (startsBlock(l)) break;
        else inner.push(l); // continuação preguiçosa
        i++;
      }
      out.push({ t: "quote", children: parseBlocks(inner) });
      continue;
    }

    // Tabela GFM: linha de cabeçalho + linha delimitadora
    if (line.includes("|") && i + 1 < lines.length && TABLE_DELIM.test(lines[i + 1]) && lines[i + 1].includes("-")) {
      const head = splitRow(line);
      const align: Align[] = splitRow(lines[i + 1]).map((c) =>
        c.startsWith(":") && c.endsWith(":") ? "center" : c.endsWith(":") ? "right" : c.startsWith(":") ? "left" : null,
      );
      if (align.length === head.length) {
        i += 2;
        const rows: string[][] = [];
        while (i < lines.length && !isBlank(lines[i]) && !startsBlock(lines[i])) {
          const cells = splitRow(lines[i]);
          rows.push(head.map((_, k) => cells[k] ?? ""));
          i++;
        }
        out.push({ t: "table", align, head, rows });
        continue;
      }
    }

    const li = line.match(LIST_ITEM);
    if (li) {
      const ordered = /^\d/.test(li[2]);
      const marker = li[2].slice(-1);
      const start = ordered ? parseInt(li[2], 10) : 1;
      const items: MdBlock[][] = [];
      let loose = false;
      while (i < lines.length) {
        const m = lines[i].match(LIST_ITEM);
        if (!m || /^\d/.test(m[2]) !== ordered || m[2].slice(-1) !== marker) break;
        const indent = m[1].length + m[2].length + Math.min(Math.max(m[3].length, 1), 4);
        const body: string[] = [m[4]];
        i++;
        let sawBlank = false;
        while (i < lines.length) {
          const l = lines[i];
          if (isBlank(l)) {
            sawBlank = true;
            body.push("");
            i++;
            continue;
          }
          const lead = l.match(/^\s*/)![0].length;
          if (lead >= indent) {
            if (sawBlank) loose = true;
            body.push(l.slice(indent));
            sawBlank = false;
            i++;
            continue;
          }
          if (!sawBlank && !startsBlock(l) && !LIST_ITEM.test(l)) {
            body.push(l); // continuação preguiçosa
            i++;
            continue;
          }
          break;
        }
        // linhas em branco no fim do item: se vier outro item, a lista é espaçada
        while (body.length && isBlank(body[body.length - 1])) body.pop();
        if (sawBlank && i < lines.length) {
          const next = lines[i].match(LIST_ITEM);
          if (next && /^\d/.test(next[2]) === ordered && next[2].slice(-1) === marker) loose = true;
        }
        items.push(parseBlocks(body));
        if (sawBlank) {
          const next = i < lines.length ? lines[i].match(LIST_ITEM) : null;
          if (!next) break;
        }
      }
      out.push({ t: "list", ordered, start, loose, items });
      continue;
    }

    // Parágrafo
    const para: string[] = [line.trim()];
    i++;
    while (i < lines.length && !isBlank(lines[i])) {
      const l = lines[i];
      const st = l.match(SETEXT);
      if (st) {
        out.push({ t: "h", level: st[1][0] === "=" ? 1 : 2, text: para.join("\n") });
        para.length = 0;
        i++;
        break;
      }
      if (startsBlock(l)) break;
      if (l.includes("|") && i + 1 < lines.length && TABLE_DELIM.test(lines[i + 1]) && lines[i + 1].includes("-")) break;
      para.push(l.trim());
      i++;
    }
    if (para.length) out.push({ t: "p", text: para.join("\n") });
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/*  Inline                                                                     */
/* -------------------------------------------------------------------------- */

export type LinkRenderer = (href: string, children: ReactNode, key: string) => ReactNode;

type Ctx = { link: LinkRenderer; seq: { n: number } };

const key = (ctx: Ctx) => `m${ctx.seq.n++}`;

/** Fecho de ênfase válido: não precedido de espaço. */
function findClose(s: string, from: number, delim: string): number {
  let j = from;
  while (true) {
    j = s.indexOf(delim, j);
    if (j < 0) return -1;
    const prev = s[j - 1];
    const after = s[j + delim.length];
    // "*" simples não pode ser parte de "**"
    const partOfDouble = delim === "*" && (after === "*" || prev === "*");
    if (prev && !/\s/.test(prev) && !partOfDouble) return j;
    j += delim.length;
  }
}

/** Fecha o colchete do texto do link, respeitando colchetes aninhados. */
function matchBracket(s: string, open: number): number {
  let depth = 0;
  for (let j = open; j < s.length; j++) {
    if (s[j] === "\\") {
      j++;
      continue;
    }
    if (s[j] === "[") depth++;
    else if (s[j] === "]") {
      depth--;
      if (depth === 0) return j;
    }
  }
  return -1;
}

function inline(s: string, ctx: Ctx): ReactNode[] {
  const out: ReactNode[] = [];
  let text = "";
  const flush = () => {
    if (text) out.push(text);
    text = "";
  };
  let i = 0;
  while (i < s.length) {
    const c = s[i];

    // escape
    if (c === "\\" && i + 1 < s.length && /[!-/:-@[-`{-~]/.test(s[i + 1])) {
      text += s[i + 1];
      i += 2;
      continue;
    }

    // código em linha
    if (c === "`") {
      const run = s.slice(i).match(/^`+/)![0];
      const end = s.indexOf(run, i + run.length);
      if (end > 0) {
        flush();
        out.push(<code key={key(ctx)}>{s.slice(i + run.length, end).replace(/\n/g, " ").trim()}</code>);
        i = end + run.length;
        continue;
      }
    }

    // link [texto](url)
    if (c === "[") {
      const close = matchBracket(s, i);
      if (close > 0 && s[close + 1] === "(") {
        const end = s.indexOf(")", close + 2);
        if (end > 0) {
          const target = s.slice(close + 2, end).trim().split(/\s+/)[0].replace(/^<|>$/g, "");
          flush();
          out.push(ctx.link(target, inline(s.slice(i + 1, close), ctx), key(ctx)));
          i = end + 1;
          continue;
        }
      }
    }

    // negrito / itálico
    if (c === "*") {
      const dbl = s[i + 1] === "*";
      const delim = dbl ? "**" : "*";
      const next = s[i + delim.length];
      if (next && !/\s/.test(next)) {
        const close = findClose(s, i + delim.length, delim);
        if (close >= i + delim.length) {
          const content = s.slice(i + delim.length, close);
          if (content.length) {
            flush();
            const children = inline(content, ctx);
            out.push(dbl ? <strong key={key(ctx)}>{children}</strong> : <em key={key(ctx)}>{children}</em>);
            i = close + delim.length;
            continue;
          }
        }
      }
    }

    text += c;
    i++;
  }
  flush();
  return out;
}

/* -------------------------------------------------------------------------- */
/*  Ids dos títulos (github-slugger, usado pelo rehype-slug)                    */
/* -------------------------------------------------------------------------- */

function plain(s: string): string {
  return s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*`]/g, "");
}

function slugger() {
  const seen = new Map<string, number>();
  return (value: string) => {
    let slug = value.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, "").replace(/ /g, "-");
    const original = slug;
    while (seen.has(slug)) {
      const n = seen.get(original)! + 1;
      seen.set(original, n);
      slug = `${original}-${n}`;
    }
    seen.set(slug, 0);
    return slug;
  };
}

/* -------------------------------------------------------------------------- */
/*  Renderização                                                                */
/* -------------------------------------------------------------------------- */

function render(blocks: MdBlock[], ctx: Ctx & { slug: (s: string) => string }, tight = false): ReactNode[] {
  return blocks.map((b) => {
    const k = key(ctx);
    switch (b.t) {
      case "p":
        return tight ? <Fragment key={k}>{inline(b.text, ctx)}</Fragment> : <p key={k}>{inline(b.text, ctx)}</p>;
      case "h": {
        const Tag = `h${b.level}` as "h1";
        return (
          <Tag key={k} id={ctx.slug(plain(b.text))}>
            {inline(b.text, ctx)}
          </Tag>
        );
      }
      case "hr":
        return <hr key={k} />;
      case "quote":
        return <blockquote key={k}>{render(b.children, ctx)}</blockquote>;
      case "list": {
        const items = b.items.map((item, n) => <li key={n}>{render(item, ctx, !b.loose)}</li>);
        return b.ordered ? (
          <ol key={k} start={b.start !== 1 ? b.start : undefined}>
            {items}
          </ol>
        ) : (
          <ul key={k}>{items}</ul>
        );
      }
      case "table": {
        const style = (n: number) => (b.align[n] ? { textAlign: b.align[n]! } : undefined);
        const labels = b.head.map((h) => plain(h).trim());
        const hasLabels = labels.some(Boolean);
        return (
          <div key={k} className="table-wrap">
            <table>
              <thead>
                <tr>
                  {b.head.map((h, n) => (
                    <th key={n} style={style(n)}>
                      {inline(h, ctx)}
                    </th>
                  ))}
                </tr>
              </thead>
              {b.rows.length > 0 && (
                <tbody>
                  {b.rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, n) => (
                        <td key={n} style={style(n)} data-label={hasLabels && labels[n] ? labels[n] : undefined}>
                          {inline(cell, ctx)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        );
      }
    }
  });
}

/** Converte o Markdown em elementos React. */
export function renderMarkdown(md: string, link: LinkRenderer): ReactNode[] {
  const lines = md.replace(/\r\n?/g, "\n").replace(/\t/g, "    ").split("\n");
  const ctx = { link, seq: { n: 0 }, slug: slugger() };
  return render(parseBlocks(lines), ctx);
}
