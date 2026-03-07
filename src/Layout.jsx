import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <style>{`
        :root {
          --background: 0 0% 3.9%;
          --foreground: 0 0% 98%;
        }
        body {
          background-color: #09090b;
          color: #fafafa;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
      {children}
    </div>
  );
}