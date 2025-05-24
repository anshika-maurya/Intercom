import React, { useState, useRef, useEffect } from "react";
import "./selection.css";
import { FaIntercom } from "react-icons/fa";

const AskFinCopilot = ({ onOpenAICopilot, setShowQuickQuestion, setCopilotQuestion }) => {
  const [showButton, setShowButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const buttonRef = useRef(null);

  const getSafeSelection = () => {
    const selection = window.getSelection();
    const selected = selection?.toString();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const messageElement = selection?.anchorNode?.parentElement;
    const customerMessage = messageElement?.closest('[data-customer-message="true"]');

    if (selected && selected.trim() && range && customerMessage) {
      return { selected: selected.trim(), rect: range.getBoundingClientRect() };
    }
    return null;
  };

  const updateButtonPosition = (rect) => {
    const popupWidth = 160;
    const viewportWidth = window.innerWidth;
    let x = rect.left + rect.width / 2 - popupWidth / 2;
    const y = rect.top - 12;

    if (x + popupWidth > viewportWidth) x = viewportWidth - popupWidth - 10;
    if (x < 10) x = 10;

    setButtonPosition({ x, y: Math.max(10, y) });
  };

  const handleSelectionChange = () => {
    const result = getSafeSelection();
    if (result) {
      const text = result.selected;
      setSelectedText(text);
      updateButtonPosition(result.rect);
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    const handleMouseUp = (e) => {
      if (!e.target.closest(".copilot-popup")) {
        handleSelectionChange();
      }
    };

    const handleTouchEnd = (e) => {
      if (!e.target.closest(".copilot-popup")) {
        setTimeout(handleSelectionChange, 100); // delay for mobile selection to finalize
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".copilot-popup")) {
        setShowButton(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle text selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (selectedText) {
        setShowQuickQuestion(true);
        // Only set a suggested question if we have specific context
        // Otherwise, leave it empty and let the UI handle it appropriately
        if (selectedText.length > 10) {  // Only suggest for meaningful selections
          setCopilotQuestion(`Help me understand: "${selectedText}"`);
        } else {
          setCopilotQuestion('');
        }
      } else {
        setShowQuickQuestion(false);
        setCopilotQuestion('');
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [setShowQuickQuestion, setCopilotQuestion]);

  const handleAskFinCopilot = () => {
    let question = selectedText.trim();
    if (!question.endsWith("?")) question += "?";
    onOpenAICopilot?.(question);
    setShowButton(false);
  };

  return (
    <>
      {showButton && (
        <div
          ref={buttonRef}
          className="copilot-popup fixed z-50 cursor-pointer transform transition-all duration-300 ease-in-out"
          style={{
            left: buttonPosition.x,
            top: buttonPosition.y,
            transform: "translate(0, -100%)",
          }}
          onClick={handleAskFinCopilot}
        >
          <div className="flex items-center gap-2 rounded-lg shadow-lg border border-gray-100 bg-white/95 backdrop-blur-sm text-black text-sm font-medium px-4 py-2.5 transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-100 hover:shadow-xl group">
            <FaIntercom className="text-gray-700 text-lg transition-colors duration-200 group-hover:text-indigo-600" />
            <span className="group-hover:text-indigo-700">Ask Fin Copilot</span>
          </div>
        </div>
      )}
    </>
  );
};

export default AskFinCopilot;
