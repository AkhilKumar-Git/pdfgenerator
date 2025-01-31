import { useEffect, useRef, useState } from 'react';

export const usePageBreak = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<HTMLElement[]>([]);
  const pageHeight = 297; // A4 height in mm

  useEffect(() => {
    const handleContentOverflow = () => {
      if (!contentRef.current) return;

      const content = contentRef.current;
      const contentHeight = content.scrollHeight;
      const numPages = Math.ceil(contentHeight / (pageHeight * 3.779527559)); // Convert mm to px

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
        currentPage.appendChild(clone);

        // Check if current page exceeds A4 height
        if (currentPage.scrollHeight > pageHeight * 3.779527559) {
          // Remove the overflowing element
          currentPage.removeChild(clone);

          // Create new page
          currentPage = document.createElement('div');
          currentPage.className = 'page';
          content.appendChild(currentPage);
          newPages.push(currentPage);

          // Add the element to the new page
          currentPage.appendChild(clone);
        }
      });

      setPages(newPages);
    };

    handleContentOverflow();

    // Re-run on content changes
    const observer = new MutationObserver(handleContentOverflow);
    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => observer.disconnect();
  }, []);

  return { contentRef, pages };
};
