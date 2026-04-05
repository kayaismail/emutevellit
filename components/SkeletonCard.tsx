import React from 'react';

interface SkeletonCardProps {
  featured?: boolean;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ featured = false }) => {
  if (featured) {
    return (
      <article className="grid md:grid-cols-12 gap-0 overflow-hidden rounded-2xl bg-white shadow-lg mb-16 animate-pulse border border-gray-100">
        <div className="md:col-span-7 h-64 md:h-[500px] bg-gray-200"></div>
        <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex gap-3 mb-6">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 w-1/2 bg-gray-200 rounded mb-8"></div>
          
          <div className="space-y-3 mb-8">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
          </div>
          
          <div className="mt-auto flex justify-between items-center">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-50 animate-pulse">
      <div className="w-full aspect-[4/3] bg-gray-200"></div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex gap-2 mb-4">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-5/6 bg-gray-200 rounded mb-3"></div>
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
        
        <div className="space-y-2 mb-6">
            <div className="h-3 w-full bg-gray-200 rounded"></div>
            <div className="h-3 w-full bg-gray-200 rounded"></div>
            <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-50">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </article>
  );
};

export default SkeletonCard;
