import type { ReactNode } from "react";

type MarkdownRendererProps = {
  content: string;
};

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index));
    }

    const token = match[0];

    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(<strong key={`${match.index}-strong`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(<em key={`${match.index}-em`}>{token.slice(1, -1)}</em>);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

      if (linkMatch) {
        nodes.push(
          <a
            key={`${match.index}-link`}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
          >
            {linkMatch[1]}
          </a>
        );
      }
    }

    cursor = pattern.lastIndex;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const blocks = content.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className="markdown">
      {blocks.map((block, index) => {
        if (block.startsWith("```") && block.endsWith("```")) {
          return (
            <pre key={index}>
              <code>{block.replace(/^```[\w-]*\n?/, "").replace(/\n?```$/, "")}</code>
            </pre>
          );
        }

        if (block.startsWith("# ")) {
          return <h1 key={index}>{block.slice(2)}</h1>;
        }

        if (block.startsWith("## ")) {
          return <h2 key={index}>{block.slice(3)}</h2>;
        }

        if (block.startsWith("### ")) {
          return <h3 key={index}>{block.slice(4)}</h3>;
        }

        const lines = block.split("\n");

        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={index}>
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{parseInline(line.slice(2))}</li>
              ))}
            </ul>
          );
        }

        const imageMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);

        if (imageMatch) {
          return (
            <figure key={index}>
              <img src={imageMatch[2]} alt={imageMatch[1] || "Blog image"} />
              {imageMatch[1] ? <figcaption>{imageMatch[1]}</figcaption> : null}
            </figure>
          );
        }

        return <p key={index}>{parseInline(block)}</p>;
      })}
    </div>
  );
}
