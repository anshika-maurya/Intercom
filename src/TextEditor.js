import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

const TextEditor = forwardRef(({ content, setContent, placeholder = 'Ask a question...' }, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
    ],
    content: content,
    autofocus: false,
    onUpdate: ({ editor }) => {
      // Update the content state with the HTML content
      setContent(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      // When text is selected, we can emit an event or call a callback
      const { from, to } = editor.state.selection;
      if (from !== to) {
        const selectedText = editor.state.doc.textBetween(from, to);
        // You could add a callback here if needed
      }
    },
    editorProps: {
      attributes: {
        class: 'p-2 min-h-[80px] focus:outline-none prose prose-sm max-w-none w-full',
      },
    },
  });

  useEffect(() => {
    if (editor && content === '') {
      editor.commands.setContent('');
    }
  }, [content, editor]);

  // Set placeholder
  useEffect(() => {
    const editorElement = editor?.view?.dom;
    if (editorElement && !editor?.getText()) {
      editorElement.dataset.placeholder = placeholder;
    }
  }, [editor, placeholder]);

  // Expose editor methods to parent components through ref
  useImperativeHandle(ref, () => ({
    toggleBold: () => editor?.chain().focus().toggleBold().run(),
    toggleItalic: () => editor?.chain().focus().toggleItalic().run(),
    toggleCode: () => editor?.chain().focus().toggleCode().run(),
    setLink: (url) => {
      if (url) {
        editor?.chain().focus().setLink({ href: url }).run();
      } else {
        editor?.chain().focus().unsetLink().run();
      }
    },
    getSelectedText: () => {
      if (!editor) return '';
      const { from, to } = editor.state.selection;
      if (from === to) return '';
      return editor.state.doc.textBetween(from, to);
    },
    replaceSelectedText: (text) => {
      if (!editor) return;
      const { from, to } = editor.state.selection;
      if (from === to) return;
      
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(text)
        .run();
    },
    focus: () => editor?.commands.focus(),
    blur: () => editor?.commands.blur(),
    clearContent: () => editor?.commands.clearContent(),
    getHTML: () => editor?.getHTML() || '',
    getText: () => editor?.getText() || '',
  }), [editor]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="text-editor relative">
      <style jsx global>{`
        .text-editor .ProseMirror {
          min-height: 80px;
          outline: none;
        }
        .text-editor .ProseMirror:empty::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .text-editor .ProseMirror:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        .text-editor .ProseMirror p {
          margin: 0.5em 0;
        }
        .text-editor .ProseMirror p:first-child {
          margin-top: 0;
        }
        .text-editor .ProseMirror strong {
          font-weight: bold;
        }
        .text-editor .ProseMirror em {
          font-style: italic;
        }
        .text-editor .ProseMirror code {
          background-color: #f3f4f6;
          color: #111827;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
        }
        .text-editor .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
      <EditorContent editor={editor} className="border rounded-lg overflow-hidden" />
    </div>
  );
});

TextEditor.displayName = 'TextEditor';

export default TextEditor; 