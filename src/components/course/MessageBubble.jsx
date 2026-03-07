import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center mt-0.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-zinc-700 text-zinc-100' 
            : 'bg-zinc-800/80 border border-zinc-700/50 text-zinc-200'
        }`}>
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              className="text-sm prose prose-sm prose-invert max-w-none 
                [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:my-2
                prose-strong:text-zinc-100
                prose-ul:my-2 prose-ol:my-2
                prose-li:text-zinc-300 prose-li:my-0.5
                prose-headings:text-zinc-100
                prose-code:text-emerald-400 prose-code:bg-zinc-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-blockquote:border-emerald-700 prose-blockquote:text-zinc-400"
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}