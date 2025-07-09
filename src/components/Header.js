import React from "react";

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-400 to-blue-200 text-white p-4 flex items-center justify-between shadow-md rounded-full">
      {/* 左边 Logo */}
      <div className="flex items-center h-full">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-20 mr-3 object-contain rounded-full"
        />
      </div>

      {/* 中间文字 */}
      <div className="flex items-center justify-center flex-1">
        <span className="text-8xl font-bold font-serif">Auto Quotation</span>
      </div>
    </header>
  );
}

export default Header;
