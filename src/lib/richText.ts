type LexicalNode = {
  children?: LexicalNode[];
  text?: string;
  type?: string;
  [key: string]: unknown;
};

export type LexicalState = {
  root: LexicalNode;
};

export function lexicalFromParagraphs(paragraphs: string[]): LexicalState {
  return {
    root: {
      children: paragraphs.map((paragraph) => ({
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: paragraph,
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      })),
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}

function collectText(node: LexicalNode | undefined, output: string[]): void {
  if (!node) {
    return;
  }

  if (typeof node.text === "string") {
    output.push(node.text);
  }

  node.children?.forEach((child) => collectText(child, output));
}

export function richTextToPlainText(value: unknown): string {
  const output: string[] = [];
  const state = value as Partial<LexicalState> | undefined;
  collectText(state?.root, output);
  return output.join(" ").replace(/\s+/g, " ").trim();
}

export function sanitizeRichText(value: unknown): unknown {
  const blockedTypes = new Set(["script", "html", "iframe"]);

  function clean(node: LexicalNode): LexicalNode | null {
    if (node.type && blockedTypes.has(node.type)) {
      return null;
    }

    return {
      ...node,
      children: node.children?.map(clean).filter(Boolean) as
        LexicalNode[] | undefined,
    };
  }

  const state = value as Partial<LexicalState> | undefined;
  if (!state?.root) {
    return value;
  }

  return {
    ...state,
    root: clean(state.root),
  };
}
