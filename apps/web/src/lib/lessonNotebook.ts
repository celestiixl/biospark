export interface NotebookObservation {
  id: string;
  timestamp: string; // ISO
  text: string;
}

export interface LessonNotebook {
  lessonSlug: string;
  studentId: string;
  lastUpdated: string; // ISO
  notes: string;
  sketch: string | null; // data URL or null
  observations: NotebookObservation[];
}

function storageKey(studentId: string, lessonSlug: string): string {
  return `notebook:${studentId}:${lessonSlug}`;
}

export function loadNotebook(
  studentId: string,
  lessonSlug: string,
): LessonNotebook {
  const empty: LessonNotebook = {
    lessonSlug,
    studentId,
    lastUpdated: new Date().toISOString(),
    notes: "",
    sketch: null,
    observations: [],
  };
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(storageKey(studentId, lessonSlug));
    if (!raw) return empty;
    return { ...empty, ...(JSON.parse(raw) as Partial<LessonNotebook>) };
  } catch {
    return empty;
  }
}

export function saveNotebook(notebook: LessonNotebook): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      storageKey(notebook.studentId, notebook.lessonSlug),
      JSON.stringify({ ...notebook, lastUpdated: new Date().toISOString() }),
    );
  } catch {
    // storage unavailable — silently ignore
  }
}

/** Returns true if a notebook has any content (notes, observations, or sketch). */
export function notebookHasContent(notebook: LessonNotebook): boolean {
  return (
    notebook.notes.trim().length > 0 ||
    notebook.observations.length > 0 ||
    notebook.sketch !== null
  );
}
