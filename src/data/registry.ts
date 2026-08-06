Skip to content
vijjiwintechsolutions-lab
Market-AI
Repository navigation
Code
Issues
Pull requests
Agents
Actions
Projects
Wiki
Security and quality
1
 (1)
Insights
Settings
Files
src/data/registry.ts
api
assets
src
app/tools/[id]
page.tsx
components
data
promptsData.ts
registry.ts
toolPresets.ts
toolsData.ts
lib
services
types
utils
App.tsx
index.css
main.tsx
.env.example
.gitignore
bun.lock
firebase-applet-config.json
firebase-blueprint.json
firestore.rules
index.html
metadata.json
package.json
server.ts
tsconfig.json
vercel.json
vite.config.ts
Market-AI/src/data
/
registry.ts
in
main

Edit

Preview
Indent mode

Spaces
Indent size

2
Line wrap mode

No wrap
Editing registry.ts file contents
  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
 11
 12
 13
 14
 15
 16
 17
 18
 19
 20
 21
 22
 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
import { MuteToolConfig } from '../types/mute';

// =====================================================================
// MARKET1 TOOL CONFIGURATION REGISTRY
// No logic here. Only configurations.
// =====================================================================

export const TOOL_REGISTRY: MuteToolConfig[] = [
  
  // ---------------------------------------------------------
  // 1. BROWSER TOOL: PDF Splitter (Runs entirely locally)
  // ---------------------------------------------------------
  {
    id: 'split-pdf',
    name: 'Split PDF Pages',
    category: 'PDF & Documents',
    description: 'Extract specific pages from your PDF securely in your browser.',
    seoKeywords: ['split pdf', 'extract pdf pages', 'cut pdf'],
    engine: 'browser',
    processor: 'pdf-lib', // Engine router knows to use client-side pdf-lib
    accepts: ['pdf'],
    outputs: ['pdf'],
    options: [
      { id: 'pageRange', label: 'Pages to Extract (e.g. 1-3)', type: 'text', defaultValue: '1', required: true }
    ],
    validation: { maxFileSizeMB: 100, maxFiles: 1 },
    capabilities: { hasPreview: true, hasDownload: true, hasHistory: true, allowMultipleUploads: false }
  },

  // ---------------------------------------------------------
  // 2. AI TOOL: Image Generator (Routes to fal.ai)
  // ---------------------------------------------------------
  {
    id: 'ai-image-generator',
    name: 'AI Text to Image',
    category: 'Image & Graphics',
Use Control + Shift + m to toggle the tab key moving focus. Alternatively, use esc then tab to move to the next interactive element on the page.
