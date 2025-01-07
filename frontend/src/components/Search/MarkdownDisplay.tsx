import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownDisplayProps {
  serverResponse?: string;
}

interface CustomCodeProps extends React.HTMLProps<HTMLElement> {
  inline?: boolean;
}

export const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ serverResponse }) => {
  if (!serverResponse) return null;

  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-100" {...props} />,
          h2: ({ ...props }) => <h2 className="text-xl font-bold mt-5 mb-3 text-gray-100" {...props} />,
          h3: ({ ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-gray-100" {...props} />,
          p: ({ ...props }) => <p className="mb-4 leading-relaxed text-gray-300" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 text-gray-300" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 text-gray-300" {...props} />,
          li: ({ ...props }) => <li className="mb-2" {...props} />,
          code: ({ inline, ...props }: CustomCodeProps) =>
            inline ? (
              <code className="px-1.5 py-0.5 rounded bg-gray-700 text-gray-200 text-sm" {...props} />
            ) : (
              <code className="block bg-gray-700 p-4 rounded-lg text-gray-200 text-sm overflow-x-auto" {...props} />
            ),
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-4" {...props} />
          ),
          a: ({ ...props }) => (
            <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
          ),
          table: ({ ...props }) => (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-700 my-4" {...props} />
            </div>
          ),
          th: ({ ...props }) => (
            <th className="border border-gray-700 px-4 py-2 bg-gray-800 font-semibold" {...props} />
          ),
          td: ({ ...props }) => (
            <td className="border border-gray-700 px-4 py-2" {...props} />
          ),
        }}
      >
        {serverResponse}
      </ReactMarkdown>
    </div>
  );
};
