import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:mb-2 prose-headings:mt-5 prose-headings:text-slate-100 prose-p:my-2 prose-p:text-slate-200 prose-a:text-brand-300 prose-strong:text-slate-100 prose-code:text-brand-200 prose-pre:bg-transparent prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-blockquote:border-l-brand-500 prose-blockquote:text-slate-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            const value = String(children).replace(/\n$/, "");
            const match = /language-(\w+)/.exec(className || "");
            if (inline) {
              return (
                <code
                  className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-sm text-brand-200"
                  {...props}
                >
                  {value}
                </code>
              );
            }

            return <CodeBlock language={match?.[1] ?? "text"} value={value} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
