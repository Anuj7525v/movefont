import React, { useState, useEffect, useRef } from 'react';
import { FaRedoAlt, FaUndoAlt } from "react-icons/fa";
import './App.css';


function App() {
  const [text, setText] = useState(''); 
  const [fontFamily, setFontFamily] = useState('Arial'); 
  const [isBold, setIsBold] = useState(false); 
  const [fontSize, setFontSize] = useState(16); 
  const [isItalic, setIsItalic] = useState(false); 
  const [isUnderLine, setIsUnderLine] = useState(false); 
  const [rotation, setRotation] = useState(0); 
  const [dragging, setDragging] = useState(false); 
  const [position, setPosition] = useState({ x: 0, y: 0 }); 
  const [isEditable, setIsEditable] = useState(false); 

  const [undoStack, setUndoStack] = useState([]); 
   const [redoStack, setRedoStack] = useState([]); 

  const textRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 }); 

  const toggleAddText = () => {
    saveToUndoStack(text); 
    setText("Anuj Verma"); 
  };

  const handleFontFamilyChange = (e) => {
    setFontFamily(e.target.value);
  };

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  const toggleBold = () => {
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    setIsItalic(!isItalic);
  };

  const toggleUnderLine = () => {
    setIsUnderLine(!isUnderLine);
  };

  const saveToUndoStack = (currentText) => {
    setUndoStack([...undoStack, currentText]);
    setRedoStack([]); // Clear redoStack on new changes
  };

  const handleTextChange = (e) => {
    saveToUndoStack(text); // Save current text before editing
    setText(e.target.value);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack([text, ...redoStack]); // Save current text to redoStack
      setText(previousState); // Restore previous state
      setUndoStack(undoStack.slice(0, undoStack.length - 1)); // Remove last item from undoStack
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setUndoStack([...undoStack, text]); // Save current text to undoStack
      setText(nextState); // Restore next state
      setRedoStack(redoStack.slice(1)); // Remove first item from redoStack
    }
  };

  // When mouse is pressed down, start dragging
  const handleMouseDown = (e) => {
    if (!isEditable) {
      setDragging(true);

      // Calculate offset between mouse and text position
      const rect = textRef.current.getBoundingClientRect();
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleTextClick = () => {
    setIsEditable(!isEditable); 
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove]);

  return (
    <div className="page">
      <div className="Navbar">
        <button className='Undo' alt={'Undo'} onClick={handleUndo}><FaUndoAlt /></button>
        <button className='Redo' alt={'Redo'} onClick={handleRedo}><FaRedoAlt /></button>
      </div>

      <div className="Middle" style={{ position: 'relative' }}>
        {text && (
          <div
            ref={textRef}
            onMouseDown={handleMouseDown}
            onClick={handleTextClick} 
            style={{
              position: 'absolute',
              top: position.y,
              left: position.x,
              fontFamily: fontFamily,
              fontSize: `${fontSize}px`,
              fontWeight: isBold ? 'bold' : 'normal',
              fontStyle: isItalic ? 'italic' : 'normal',
              textDecoration: isUnderLine ? 'underline' : 'none',
              transform: `rotate(${rotation}deg)`,
              cursor: dragging ? 'grabbing' : 'pointer',
            }}
          >
            {isEditable ? (
              <input
                type="text"
                value={text}
                onChange={handleTextChange}
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}px`,
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textDecoration: isUnderLine ? 'underline' : 'none',
                  border: 'none',
                  outline: 'none',
                  background: "none"
                }}
              />
            ) : (
              <span>{text}</span>
            )}
          </div>
        )}
      </div>

      <div className="Footer">
        <div className="upper">
          <div className="fontSelector">
            <select value={fontFamily} onChange={handleFontFamilyChange}>
              <option value="Arial">Arial</option>
              <option value="Courier">Courier</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>
          <div className="Incr-Decre">
            <input
              type="number"
              value={fontSize}
              min="10"
              onChange={handleFontSizeChange}
              max="50"
            />
          </div>
          <div className="fontStyle">
            <button onClick={toggleBold}>
              <b>B</b>
            </button>
            <button onClick={toggleItalic}>
              <i>I</i>
            </button>
            <button onClick={toggleUnderLine}>
              <u>U</u>
            </button>
          </div>
        </div>

        <div className="lower">
          <button onClick={toggleAddText}>T add text</button>
        </div>
      </div>
    </div>
  );
}

export default App;
