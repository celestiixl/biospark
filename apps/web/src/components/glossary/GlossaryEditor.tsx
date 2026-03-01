"use client";

import { useState } from "react";
import { generateGlossaryMarkup } from "@/lib/glossary/parseGlossaryMarkup";
import type { GlossaryEntry } from "@/types/glossary";

type GlossaryEditorProps = {
  glossary: GlossaryEntry[];
  onChange: (glossary: GlossaryEntry[]) => void;
};

/**
 * GlossaryEditor: UI for teachers to add/edit glossary entries
 * - Add entry form
 * - Display current entries with edit/delete buttons
 * - Copy markup button for inserting into text
 */
export default function GlossaryEditor({
  glossary,
  onChange,
}: GlossaryEditorProps) {
  const [formData, setFormData] = useState({
    surface: "",
    key: "",
    es: "",
    en: "",
    partOfSpeech: "",
  });

  const [editingKey, setEditingKey] = useState<string | null>(null);

  // Generate key from surface text (auto-lowercase, remove spaces)
  const generateKey = (surface: string) => {
    return surface.toLowerCase().replace(/\s+/g, "_");
  };

  // Auto-update key when surface changes
  const handleSurfaceChange = (surface: string) => {
    setFormData((prev) => ({
      ...prev,
      surface,
      key: !editingKey && !prev.key ? generateKey(surface) : prev.key,
    }));
  };

  // Add or update entry
  const handleSave = () => {
    if (!formData.surface || !formData.key || !formData.es || !formData.en) {
      alert("Please fill in all required fields");
      return;
    }

    const newEntry: GlossaryEntry = {
      key: formData.key,
      surface: formData.surface,
      es: formData.es,
      en: formData.en,
      partOfSpeech: formData.partOfSpeech || undefined,
    };

    if (editingKey) {
      // Update existing
      const updated = glossary.map((e) =>
        e.key === editingKey ? newEntry : e
      );
      onChange(updated);
      setEditingKey(null);
    } else {
      // Add new
      if (glossary.some((e) => e.key === formData.key)) {
        alert(`Entry with key "${formData.key}" already exists`);
        return;
      }
      onChange([...glossary, newEntry]);
    }

    setFormData({ surface: "", key: "", es: "", en: "", partOfSpeech: "" });
  };

  // Start editing
  const handleEdit = (entry: GlossaryEntry) => {
    setFormData({
      surface: entry.surface,
      key: entry.key,
      es: entry.es,
      en: entry.en,
      partOfSpeech: entry.partOfSpeech || "",
    });
    setEditingKey(entry.key);
  };

  // Copy markup to clipboard
  const handleCopyMarkup = (entry: GlossaryEntry) => {
    const markup = generateGlossaryMarkup(entry.surface, entry.key);
    navigator.clipboard.writeText(markup);
  };

  // Delete entry
  const handleDelete = (key: string) => {
    onChange(glossary.filter((e) => e.key !== key));
    if (editingKey === key) {
      setEditingKey(null);
      setFormData({ surface: "", key: "", es: "", en: "", partOfSpeech: "" });
    }
  };

  return (
    <div className="space-y-4 rounded-lg border bg-slate-50 p-4">
      <div>
        <h3 className="font-semibold text-sm">Glossary Entries</h3>
        <p className="text-xs text-slate-600 mt-1">
          Define glossary entries and insert them into your passage using the
          markup: <code className="bg-white px-1.5 py-0.5 rounded text-xs">[[word|key=keyName]]</code>
        </p>
      </div>

      {/* Form */}
      <div className="space-y-3 border-t pt-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Word/Surface *
            </label>
            <input
              type="text"
              value={formData.surface}
              onChange={(e) => handleSurfaceChange(e.target.value)}
              placeholder="e.g., gratuitos"
              className="w-full px-3 py-2 border rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Key (auto-filled) *
            </label>
            <input
              type="text"
              value={formData.key}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, key: e.target.value }))
              }
              placeholder="e.g., gratuito"
              className="w-full px-3 py-2 border rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Spanish Definition *
            </label>
            <input
              type="text"
              value={formData.es}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, es: e.target.value }))
              }
              placeholder="Que no cuesta dinero."
              className="w-full px-3 py-2 border rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              English Definition *
            </label>
            <input
              type="text"
              value={formData.en}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, en: e.target.value }))
              }
              placeholder="Free"
              className="w-full px-3 py-2 border rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Part of Speech (optional)
          </label>
          <input
            type="text"
            value={formData.partOfSpeech}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, partOfSpeech: e.target.value }))
            }
            placeholder="e.g., adjective, noun"
            className="w-full px-3 py-2 border rounded text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700"
          >
            {editingKey ? "Update Entry" : "Add Entry"}
          </button>
          {editingKey && (
            <button
              type="button"
              onClick={() => {
                setEditingKey(null);
                setFormData({
                  surface: "",
                  key: "",
                  es: "",
                  en: "",
                  partOfSpeech: "",
                });
              }}
              className="px-3 py-2 bg-slate-300 text-slate-700 text-xs font-semibold rounded hover:bg-slate-400"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Entries List */}
      {glossary.length > 0 && (
        <div className="space-y-2 border-t pt-3">
          <div className="text-xs font-medium text-slate-700">
            {glossary.length} entr{glossary.length === 1 ? "y" : "ies"}
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {glossary.map((entry) => (
              <div
                key={entry.key}
                className={`flex items-start gap-3 p-2 rounded border ${
                  editingKey === entry.key
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">
                    {entry.surface}
                    {entry.partOfSpeech && (
                      <span className="ml-2 text-xs text-slate-500">
                        ({entry.partOfSpeech})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    <span className="block">ES: {entry.es}</span>
                    <span className="block">EN: {entry.en}</span>
                  </div>
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyMarkup(entry)}
                    title="Copy markup to clipboard"
                    className="px-2 py-1 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(entry)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.key)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
