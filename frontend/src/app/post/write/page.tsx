'use client';

import { useState, useEffect, useRef, MouseEvent } from 'react';
import Link from 'next/link';

export default function PostWritePage() {
  // State for the form fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('전체');
  const [mainCategory, setMainCategory] = useState('전체');
  
  // State for UI rendering
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // State for text formatting
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);

  // This ensures hydration errors are prevented by only rendering on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize editor once it's rendered
  useEffect(() => {
    if (isClient && editorRef.current) {
      // Make the editor area focused by default
      editorRef.current.focus();
      // Set default separator for paragraphs
      try {
        document.execCommand('defaultParagraphSeparator', false, 'p');
      } catch (e) {
        console.error('Failed to set default paragraph separator');
      }
    }
  }, [isClient]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Get the content from the contentEditable div
    const editorContent = editorRef.current?.innerHTML || '';
    console.log({ title, author, bookTitle, content: editorContent, tags, category, mainCategory });
    // Here you would typically make an API call to save the post
  };

  // Format handlers using document.execCommand for direct formatting
  const applyFormat = (event: MouseEvent<HTMLButtonElement>, format: 'bold' | 'italic' | 'underline' | 'insertUnorderedList' | 'insertOrderedList') => {
    // Prevent default button behavior (which might cause page reload)
    event.preventDefault();
    
    if (!editorRef.current) return;
    
    // Make sure the editor has focus
    editorRef.current.focus();
    
    // Get the current selection
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    
    // Execute the command
    try {
      // For simple formatting commands
      if (format === 'bold' || format === 'italic' || format === 'underline') {
        document.execCommand(format, false);
        
        // Update state to reflect active formatting
        switch (format) {
          case 'bold':
            setIsBold(!isBold);
            break;
          case 'italic':
            setIsItalic(!isItalic);
            break;
          case 'underline':
            setIsUnderline(!isUnderline);
            break;
        }
      } 
      // For list commands - handle them manually if execCommand doesn't work
      else if (format === 'insertUnorderedList') {
        // Try standard command first
        const success = document.execCommand(format, false);
        
        // If standard command fails, manual implementation
        if (!success && range && editorRef.current) {
          const selectedText = range.toString();
          const listItems = selectedText.split('\n').filter(line => line.trim() !== '');
          
          if (listItems.length > 0) {
            const ul = document.createElement('ul');
            listItems.forEach(item => {
              const li = document.createElement('li');
              li.textContent = item;
              ul.appendChild(li);
            });
            
            range.deleteContents();
            range.insertNode(ul);
          } else {
            // If no text is selected, just create an empty list item
            const ul = document.createElement('ul');
            const li = document.createElement('li');
            li.innerHTML = '&nbsp;'; // Empty list item needs a space to be visible
            ul.appendChild(li);
            
            range.deleteContents();
            range.insertNode(ul);
            
            // Place caret in the empty list item
            range.selectNodeContents(li);
            range.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }
        
        setIsBulletList(!isBulletList);
      } 
      else if (format === 'insertOrderedList') {
        // Try standard command first
        const success = document.execCommand(format, false);
        
        // If standard command fails, manual implementation
        if (!success && range && editorRef.current) {
          const selectedText = range.toString();
          const listItems = selectedText.split('\n').filter(line => line.trim() !== '');
          
          if (listItems.length > 0) {
            const ol = document.createElement('ol');
            listItems.forEach(item => {
              const li = document.createElement('li');
              li.textContent = item;
              ol.appendChild(li);
            });
            
            range.deleteContents();
            range.insertNode(ol);
          } else {
            // If no text is selected, just create an empty list item
            const ol = document.createElement('ol');
            const li = document.createElement('li');
            li.innerHTML = '&nbsp;'; // Empty list item needs a space to be visible
            ol.appendChild(li);
            
            range.deleteContents();
            range.insertNode(ol);
            
            // Place caret in the empty list item
            range.selectNodeContents(li);
            range.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }
        
        setIsNumberedList(!isNumberedList);
      }
    } catch (e) {
      console.error('Error applying format:', format, e);
    }
    
    // Return focus to editor after command is executed
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 10);
  };

  // Check if selection exists in editor (helper function)
  const hasSelection = (): boolean => {
    const selection = window.getSelection();
    return selection !== null && selection.toString().length > 0;
  };

  // If not yet client-side rendered, show a loading state or nothing
  if (!isClient) {
    return <div className="flex max-w-7xl mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="flex max-w-7xl mx-auto p-6 gap-6">
      {/* Main content - post editor */}
      <div className="flex-1 bg-white rounded shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div className="mb-8">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              className="w-full py-3 px-0 text-4xl font-light border-0 border-b border-gray-200 focus:outline-none focus:border-gray-300 focus:ring-0"
              required
            />
          </div>

          {/* Author Input */}
          <div>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="작가를 입력하세요"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Book Title Input */}
          <div>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="책 제목을 입력하세요"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Formatting Toolbar */}
          <div className="flex space-x-6 border-t border-b border-gray-200 py-2 mb-4 items-center">
            <button
              type="button"
              onMouseDown={(e) => applyFormat(e, 'bold')}
              className={`p-1 font-bold text-xl ${isBold ? 'text-[#2E804E]' : 'text-black'}`}
            >
              B
            </button>
            <button
              type="button"
              onMouseDown={(e) => applyFormat(e, 'italic')}
              className={`p-1 italic text-xl ${isItalic ? 'text-[#2E804E]' : 'text-black'}`}
            >
              I
            </button>
            <button
              type="button"
              onMouseDown={(e) => applyFormat(e, 'underline')}
              className={`p-1 underline text-xl ${isUnderline ? 'text-[#2E804E]' : 'text-black'}`}
            >
              U
            </button>
            <div className="text-gray-300">|</div>
            <button 
              type="button" 
              onMouseDown={(e) => applyFormat(e, 'insertUnorderedList')} 
              className={`p-1 text-xl ${isBulletList ? 'text-[#2E804E]' : 'text-black'}`}
            >
              •
            </button>
            <button 
              type="button" 
              onMouseDown={(e) => applyFormat(e, 'insertOrderedList')} 
              className={`p-1 text-xl ${isNumberedList ? 'text-[#2E804E]' : 'text-black'}`}
            >
              1.
            </button>
          </div>

          {/* Content Area - ContentEditable div instead of textarea */}
          <div className="min-h-[300px] border border-gray-200 rounded-md overflow-hidden mb-6">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning={true}
              className="w-full h-full min-h-[300px] p-4 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
              style={{ overflowY: 'auto' }}
              data-placeholder="내용을 입력하세요"
              onInput={() => {
                // Additional handling for changes if needed
              }}
            ></div>
          </div>


          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <Link href="/post" className="px-5 py-2 min-w-[100px] bg-white text-black rounded border border-gray-200 text-base">
              돌아가기
            </Link>
            <button type="submit" className="px-5 py-2 min-w-[100px] bg-[#2E804E] text-white rounded border border-gray-300 text-base">
              발행하기
            </button>
          </div>
        </form>
      </div>

      {/* Right sidebar - Categories */}
      <div className="w-80 space-y-6">
        {/* Combined Category Selector */}
        <div className="bg-white rounded shadow p-4">
          <div className="space-y-6">
            {/* Regular Category */}
            <div>
              <h3 className="text-lg font-medium mb-4">카테고리 선택</h3>
              <div className="relative mb-4">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded appearance-none"
                >
                  <option value="전체">전체</option>
                  <option value="소설">소설</option>
                  <option value="시">시</option>
                  <option value="에세이">에세이</option>
                  <option value="자기계발">자기계발</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Main Category */}
            <div>
              <h3 className="text-lg font-medium mb-4">메인 카테고리 선택</h3>
              <div className="relative mb-4">
                <select
                  value={mainCategory}
                  onChange={(e) => setMainCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded appearance-none"
                >
                  <option value="전체">전체</option>
                  <option value="소설">소설</option>
                  <option value="시">시</option>
                  <option value="에세이">에세이</option>
                  <option value="자기계발">자기계발</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
