"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Youtube } from "@tiptap/extension-youtube";
import { Placeholder } from "@tiptap/extension-placeholder";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Table as TableIcon,
  Youtube as YoutubeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// 🚀 CUSTOM EXTENSION UNTUK GAMBAR + CAPTION/KREDIT (ZERO INSTALL)
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null,
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { caption, ...imageAttributes } = HTMLAttributes;
    
    if (caption) {
      return [
        "figure",
        { class: "my-6 text-center group" },
        ["img", imageAttributes],
        [
          "figcaption",
          { class: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic mt-2 font-medium tracking-tight" },
          caption,
        ],
      ];
    }

    return ["img", imageAttributes];
  },
});

interface TiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Tulis artikel berita sekolah di sini...",
      }),
      CustomImage.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-2xl max-w-full h-auto mx-auto border shadow-sm",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline font-medium",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-4 text-sm",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border bg-muted p-2 font-bold text-left",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border p-2",
        },
      }),
      Youtube.configure({
        controls: true,
        HTMLAttributes: {
          class: "w-full aspect-video rounded-2xl my-4 overflow-hidden border shadow-sm",
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate dark:prose-invert max-w-none min-h-[350px] p-4 focus:outline-none focus:ring-0 leading-relaxed",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Sinkronisasi Konten saat Mode Edit
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) return null;

  // 📷 FUNGSI TAMBAH GAMBAR (+KREDIT/CAPTION)
  const addImage = () => {
    const url = window.prompt("Masukkan URL Gambar (ImageKit / Firebase Storage):");
    if (!url) return;

    const caption = window.prompt("Masukkan Kredit / Keterangan Gambar (Opsional, misal: Foto: Humas SMK):");

    if (caption) {
      editor
        .chain()
        .focus()
        .setImage({ src: url, caption: caption } as any)
        .run();
    } else {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutube = () => {
    const url = window.prompt("Masukkan URL Video YouTube:");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="rounded-2xl border bg-background overflow-hidden shadow-sm">
      {/* TOOLBAR EDITOR */}
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-2">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="h-4 w-[1px] bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Tebal"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Miring"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="h-4 w-[1px] bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Kutipan (Quote)"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="h-4 w-[1px] bg-border mx-1" />

        <Button type="button" size="sm" variant="ghost" onClick={addImage} title="Sisipkan Gambar (+Kredit)">
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={addTable} title="Sisipkan Tabel">
          <TableIcon className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={addYoutube} title="Sisipkan Video YouTube">
          <YoutubeIcon className="h-4 w-4" />
        </Button>

        <div className="h-4 w-[1px] bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* AREA CANVAS KETIKAN EDITOR */}
      <EditorContent editor={editor} />
    </div>
  );
}