import { useEffect, useRef, useState } from 'react';

export const usePageBreak = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<HTMLElement[]>([]);
  const pageHeight = 297; // A4 height in mm
  const pixelRatio = 3.779527559; // 1mm to px conversion

  useEffect(() => {
    const handleContentOverflow = () => {
      if (!contentRef.current) return;

      const content = contentRef.current;
      const contentHeight = content.scrollHeight;
      const pageHeightPx = pageHeight * pixelRatio;

      // Reset existing content
      while (content.firstChild) {
        content.removeChild(content.firstChild);
      }

      // Create pages and distribute content
      const newPages: HTMLElement[] = [];
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = content.innerHTML;

      let currentPage = document.createElement('div');
      currentPage.className = 'page';
      content.appendChild(currentPage);
      newPages.push(currentPage);

      Array.from(tempContainer.children).forEach((child) => {
        const clone = child.cloneNode(true) as HTMLElement;
        
        // Check if adding this component would exceed page height
        currentPage.appendChild(clone);
        if (currentPage.scrollHeight > pageHeightPx) {
          // If component is too big for a single page, keep it on its own page
          currentPage.removeChild(clone);
          
          // Create new page for this component
          currentPage = document.createElement('div');
          currentPage.className = 'page';
          content.appendChild(currentPage);
          newPages.push(currentPage);
          currentPage.appendChild(clone);
        }
      });

      setPages(newPages);
    };

    handleContentOverflow();
    window.addEventListener('resize', handleContentOverflow);

    return () => {
      window.removeEventListener('resize', handleContentOverflow);
    };
  }, []);

  return { contentRef, pages };
};
