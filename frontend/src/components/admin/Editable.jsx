import React, { useRef, useEffect } from 'react';
import { useAdminEdit } from '../../context/AdminEditContext';

export function EditableText({ path, className = '', children, skipReload, ...props }) {
  const { isEditMode, updatePath } = useAdminEdit();
  const elementRef = useRef(null);

  // Sync content with ref when children change
  useEffect(() => {
    if (elementRef.current && elementRef.current.innerText !== children) {
      elementRef.current.innerText = children || '';
    }
  }, [children]);

  if (!isEditMode) {
    return <span className={className} {...props}>{children}</span>;
  }

  const handleBlur = (e) => {
    const newValue = e.target.innerText.trim();
    updatePath(path, newValue, skipReload);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };

  return (
    <span
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className} outline-none border border-dashed border-amber-500/50 hover:bg-amber-500/5 focus:bg-amber-500/10 px-1 py-0.5 rounded cursor-text relative group transition-all`}
      title="Click to edit text"
      {...props}
    >
      {children}
    </span>
  );
}

export function EditableArea({ path, className = '', children, skipReload, ...props }) {
  const { isEditMode, updatePath } = useAdminEdit();
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current && elementRef.current.innerText !== children) {
      elementRef.current.innerText = children || '';
    }
  }, [children]);

  if (!isEditMode) {
    return <span className={`block ${className}`} {...props}>{children}</span>;
  }

  const handleBlur = (e) => {
    const newValue = e.target.innerText.trim();
    updatePath(path, newValue, skipReload);
  };

  return (
    <span
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      className={`block ${className} outline-none border border-dashed border-amber-500/40 hover:bg-amber-500/5 focus:bg-amber-500/10 p-2 rounded cursor-text relative group transition-all`}
      title="Click to edit paragraph"
      {...props}
    >
      {children}
    </span>
  );
}
