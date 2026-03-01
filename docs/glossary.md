# Tap-to-Translate Glossary Feature

## Overview

The Glossary feature allows teachers to create word-level definitions that students can access via tap/click popovers. It's designed for bilingual support with Spanish/English translations.

**Key Features:**
- ✅ Reusable markup: `[[word|key=keyName]]` syntax
- ✅ Click/tap popovers with ES/EN toggles
- ✅ Keyboard accessible (Enter/Space to open, Esc to close)
- ✅ Mobile-friendly (tap to open/close)
- ✅ Teacher authoring UI in the builder
- ✅ Progressive enhancement: glossary is optional

## Data Model

### GlossaryEntry Type

```typescript
type GlossaryEntry = {
  key: string;              // e.g., "gratuito" - stable identifier
  surface: string;          // e.g., "gratuitos" - what appears in text
  es: string;               // Spanish definition
  en: string;               // English translation
  partOfSpeech?: string;    // optional, e.g., "adjective"
};
```

### Item Type Addition

All items now support glossary:

```typescript
type ItemBase = {
  // ... existing fields ...
  glossary?: Array<{
    key: string;
    surface: string;
    es: string;
    en: string;
    partOfSpeech?: string;
  }>;
};
```

## Text Markup Format

Teachers use this format to mark glossary tokens in text:

```
[[surface|key=keyName]]
```

**Example:**
```
"El Zócalo alberga eventos [[gratuitos|key=gratuito]] para todos."
```

When this text is rendered with a glossary entry matching `key="gratuito"`, the word "gratuitos" becomes a clickable token.

## Components

### 1. GlossaryText

Main component for rendering text with glossary tokens.

**Props:**
```typescript
{
  text: string;                        // text with markup
  glossary?: GlossaryEntry[];          // optional glossary entries
  defaultLang?: "es" | "en";           // default language (default: "es")
  className?: string;                  // optional class for wrapper
}
```

**Usage:**
```tsx
import { GlossaryText } from "@/components/glossary";

<GlossaryText
  text="El Zócalo alberga eventos [[gratuitos|key=gratuito]] para todos."
  glossary={[
    {
      key: "gratuito",
      surface: "gratuitos",
      es: "Que no cuesta dinero.",
      en: "Free",
    },
  ]}
  defaultLang="es"
/>
```

**Behavior:**
- If no glossary provided: renders plain text
- If markup token key not in glossary: renders surface text without interaction
- If glossary entry found: renders clickable token with popover

### 2. GlossaryToken

Individual clickable token with popover (used by GlossaryText internally).

**Props:**
```typescript
{
  surface: string;           // visible text
  entry: GlossaryEntry;      // glossary definition
  defaultLang?: "es" | "en"; // default language
}
```

### 3. GlossaryEditor

Teacher UI component for authoring glossary entries.

**Props:**
```typescript
{
  glossary: GlossaryEntry[];
  onChange: (glossary: GlossaryEntry[]) => void;
}
```

**Features:**
- Add/edit/delete glossary entries
- Auto-generate keys from surface text
- "Copy markup" button to copy `[[surface|key=key]]` to clipboard
- Inline display of ES/EN definitions
- Part of speech support

**Usage in Builder:**
```tsx
import GlossaryEditor from "@/components/glossary/GlossaryEditor";

// In your item builder form
<GlossaryEditor
  glossary={item.glossary || []}
  onChange={(g) => onPatch({ glossary: g })}
/>
```

## Utilities

### parseGlossaryMarkup

Parses text with `[[...]]` markup into segments.

```typescript
import { parseGlossaryMarkup } from "@/lib/glossary/parseGlossaryMarkup";

const segments = parseGlossaryMarkup("Text with [[token|key=k1]]");
// Returns:
// [
//   { type: "text", value: "Text with " },
//   { type: "token", key: "k1", surface: "token" },
// ]
```

### generateGlossaryMarkup

Helper to create markup for teacher convenience.

```typescript
import { generateGlossaryMarkup } from "@/lib/glossary/parseGlossaryMarkup";

const markup = generateGlossaryMarkup("gratuitos", "gratuito");
// Returns: "[[gratuitos|key=gratuito]]"
```

## Integration Examples

### Short Answer Items

```tsx
import { GlossaryText } from "@/components/glossary";

export default function ShortResponse({ item }) {
  const { lang } = useLang();

  return (
    <div className="space-y-3">
      <div className="text-lg font-semibold">
        {item.glossary && item.glossary.length > 0 ? (
          <GlossaryText
            text={item.stem}
            glossary={item.glossary}
            defaultLang={lang === "es" ? "es" : "en"}
          />
        ) : (
          <BilingualText text={item.stem} showSupport={lang === "es"} />
        )}
      </div>
      {/* ... rest of component ... */}
    </div>
  );
}
```

### Multiple Choice Items

Already updated in `MCQ.tsx` - works for both stem and choice text.

### Teacher Builder

```tsx
import { GlossaryEditor } from "@/components/glossary";

// In your item builder
<GlossaryEditor
  glossary={itemState.glossary || []}
  onChange={(g) => updateItem({ glossary: g })}
/>
```

## Keyboard Accessibility

- **Focus token:** Tab to focus
- **Open popover:** Enter or Space
- **Close popover:** Esc
- **Focus return:** Focus returns to token when popover closes
- **Click outside:** Closes popover on mobile and desktop

## Styling

The popover inherits from the Student Dashboard theme:

- **Token styling:** Underlined text (dotted decoration, solid on hover)
- **Focus ring:** Blue ring (2px, offset 1px)
- **Popover:** White background, rounded border, shadow
- **Buttons:** Blue toggles (ES/EN), standard slate for others

To customize, modify the Tailwind classes in `GlossaryToken.tsx`.

## Files Created/Modified

**New Files:**
- `apps/web/src/types/glossary.ts` - Glossary types
- `apps/web/src/lib/glossary/parseGlossaryMarkup.ts` - Parsing utility
- `apps/web/src/components/glossary/GlossaryText.tsx` - Main renderer
- `apps/web/src/components/glossary/GlossaryToken.tsx` - Token + popover
- `apps/web/src/components/glossary/GlossaryEditor.tsx` - Teacher UI
- `apps/web/src/components/glossary/index.ts` - Exports

**Modified Files:**
- `apps/web/src/types/item.ts` - Added `glossary` field to `ItemBase`
- `apps/web/src/components/items/ShortResponse.tsx` - Integrated GlossaryText
- `apps/web/src/components/items/MCQ.tsx` - Integrated GlossaryText + added glossary to type

## Next Steps (Not in MVP)

1. **Add glossary to teacher builder UI** - Update `/app/(app)/teacher/builder/page.tsx` to include `GlossaryEditor` in the form for all item types

2. **Glossary in more item types** - Apply `GlossaryText` to:
   - Inline Choice (stem and choices)
   - Drag & Drop (stem and card/zone labels)
   - Hotspot (stem)
   - CER (stem, evidence items, etc.)
   - Card Sort (stem)

3. **Glossary import/export** - Add CSV/JSON export for teachers to bulk-manage glossaries across items

4. **Shared glossaries** - Allow teachers to create item-level vs. class-level vs. course-level glossaries

5. **Analytics** - Track which glossary tokens are most commonly clicked for teaching insights

6. **Auto-suggestions** - Use NLP to suggest words for glossary based on reading level

## Testing

### Manual Tests
- [ ] Click token → popover appears
- [ ] Tab to token → focus visible
- [ ] Press Space/Enter on token → popover opens
- [ ] Press Esc → popover closes
- [ ] Click ES/EN buttons → definition updates
- [ ] Click outside → popover closes
- [ ] Missing glossary entry → renders text without interaction
- [ ] No glossary provided → renders plain text

### Edge Cases
- Token at start/end of text
- Multiple same-key tokens in one passage
- Very long definitions
- Special characters in surface text

## Example Item JSON

```json
{
  "id": "item-123",
  "kind": "short",
  "stem": "¿Por qué el concierto fue [[gratuito|key=gratuito]] el domingo pasado?",
  "glossary": [
    {
      "key": "gratuito",
      "surface": "gratuito",
      "es": "Que no cuesta dinero; sin precio.",
      "en": "Free; costing nothing",
      "partOfSpeech": "adjective"
    }
  ],
  "rubric": {
    "points": 2,
    "criteria": ["Mentions cost saving", "References specific event"]
  },
  "teks": ["BIO.5.A"]
}
```
