import React from 'react';

import NewHeader from './components/newheader';

export default function Home() {
  return (
    <>
      <NewHeader />
      <div data-theme="light">
        <div className="min-h-screen flex flex-col items-center justify-between p-24 bg-slate-50">
          <h1 className="text-black">Tech Demos</h1>
          
        </div>                     
      </div>
    </>
  );
}
