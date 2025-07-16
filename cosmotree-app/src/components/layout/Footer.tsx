import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-14 text-start">
          <div className="w-80">
            <h4 className="text-2xl font-gowun text-black mb-4 leading-relaxed tracking-tight">
              Contact
            </h4>
            <div>
              <p className="text-2xl font-gowun text-black leading-relaxed tracking-tight">
                hello@cosmotree.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
