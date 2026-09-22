# Mini Workspace Explorer

## How to Run

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```text
src/
├── components/
│   ├── layout/
│   ├── main_panel/
│   ├── sidebar/
│   └── common/
├── libs/
│   ├── redux/
│   ├── interface/
│   ├── helper/
│   └── constant/
└── App.tsx
```

## State Management

All file system actions (create, read, update, delete) are dispatched as RTK actions. A custom Redux middleware listens to every state mutation and instantly writes the current `workspace` state to `localStorage`. When the app loads, the store initializes itself from `localStorage`, ensuring data perfectly persists across browser refreshes.

## Data Structure

```typescript
{
  "uuid-1": { id: "uuid-1", name: "Projects", type: "folder", parentId: null },
  "uuid-2": { id: "uuid-2", name: "notes", type: "file", parentId: "uuid-1", content: "..." }
}
```

## Features

- Create, Rename, and Delete nested folder & text file.
- Searching Items.
- Text file editor.
- Breadcrumb navigation.
