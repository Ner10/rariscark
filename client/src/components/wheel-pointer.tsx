import React from 'react';

const WheelPointer: React.FC = () => {
  return (
    <div className="wheel-pointer absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-md z-10 flex items-center justify-center">
      <i className="fas fa-caret-down text-amber-500"></i>
      
      {/* Pointer triangle */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-gray-800"></div>
      
      <style jsx>{`
        .wheel-pointer {
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default WheelPointer;
