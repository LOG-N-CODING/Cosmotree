// src/components/admin/ChallengeList.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  collection,
  onSnapshot,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../../config/firebase';

// =========================
// Types
// =========================
type Lesson = { title: string; content: string };
type ModuleDoc = {
  id: string;
  title: string;
  difficulty?: string;
  imageUrl?: string;
  lessons: Lesson[];
  createdAt?: any;
};

type ChallengeDoc = {
  id?: string;
  templateId?: string | null;
  templateName?: string | null;
  generatedContent: any; // JSON or string (if forceJson = false)
  rawPrompt?: string | null; // admin-entered prompt saved for traceability
  createdAt?: any;
  updatedAt?: any;
};

type TemplateDoc = {
  id?: string;
  name: string;
  category?: string;
  prompt: string; // free-form prompt (can be one-liners)
  variables?: string[]; // optional
  createdAt?: any;
  updatedAt?: any;
};

// =========================
// Helpers
// =========================
const LS_API_KEY = 'openai_api_key_for_admin_only';

function buildBlueprintPromptText({
  moduleDoc,
  freePrompt,
  forceEnglish = true,
}: {
  moduleDoc: { title: string; difficulty?: string; lessons: { title: string; content: string }[] };
  freePrompt: string;
  forceEnglish?: boolean;
}) {
  const lessonsMd = clampText(toLessonsMarkdown(moduleDoc.lessons, 10), 12000);
  const lessonTitles = (moduleDoc.lessons || []).map(l => l.title).join(', ');
  const lang = forceEnglish ? 'English' : 'Korean';

  return `
You are an educational content designer.

Goal:
- Turn the admin-authored instruction into a student-facing challenge SPEC (blueprint).
- DO NOT solve the task. DO NOT produce sample answers. Output the specification only.

Admin instruction:
"${freePrompt}"

Hard constraints:
- Base everything ONLY on the Module lessons below (no external facts).
- Include a clear mission title, detailed instructions, expected output format, constraints, and an evaluation rubric.
- Language for any student-facing text: ${lang}.

Module context:
- Title: ${moduleDoc.title}
- Difficulty: ${moduleDoc.difficulty ?? 'Beginner'}
- Lesson count: ${(moduleDoc.lessons || []).length}
- Lesson titles: ${lessonTitles}

Module lessons (markdown):
${lessonsMd}
`.trim();
}

const clampText = (s: string, max = 12000) =>
  typeof s === 'string' && s.length > max ? s.slice(0, max) + '\n[TRUNCATED]' : s;

const toLessonsMarkdown = (lessons: { title: string; content: string }[], limit = 10) =>
  (lessons || [])
    .slice(0, limit)
    .map((l, i) => `### Lesson ${i + 1}: ${l.title}\n${l.content}`)
    .join('\n\n');

const fillTemplate = (tmpl: string, ctx: Record<string, string | number | boolean>) =>
  tmpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => String(k in ctx ? ctx[k] : `{{${k}}}`));

// Extract JSON even if the model added fences or extra text
const tryParseJson = (raw: string) => {
  const fence = raw.match(/```json\s*([\s\S]*?)```/i) || raw.match(/```\s*([\s\S]*?)```/);
  const text = fence ? fence[1] : raw;
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.slice(firstBrace, lastBrace + 1));
      } catch {}
    }
    throw new Error('Failed to parse JSON from the model response.');
  }
};

// OpenAI direct call (dev only; key is stored locally in browser)
async function openAIChatDirect({
  apiKey,
  system,
  user, // ← 여기로 finalUserPrompt 넣어서 호출
  model = 'gpt-4o-mini',
  temperature = 0.7,
}: {
  apiKey: string;
  system: string;
  user: string;
  model?: string;
  temperature?: number;
}) {
  const body: any = {
    model,
    temperature,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  };

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    throw new Error(`OpenAI error: ${resp.status} ${await resp.text()}`);
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content ?? '';
  return content;
}
// Cloud Functions proxy (prod recommended)
async function callFunctionGenerateChallenge(payload: {
  prompt: string;
  forceJson?: boolean;
  forceEnglish?: boolean;
}) {
  const resp = await fetch('/api/generateChallenge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Function error: ${resp.status} ${t}`);
  }
  return await resp.json();
}

// Build final prompt using admin-authored instruction + auto-injected module lessons
function buildAdminDrivenPrompt({
  moduleDoc,
  freePrompt,
  forceEnglish = true,
}: {
  moduleDoc: { title: string; difficulty?: string; lessons: { title: string; content: string }[] };
  freePrompt: string;
  forceEnglish?: boolean;
}) {
  const lessonsMd = clampText(toLessonsMarkdown(moduleDoc.lessons, 10), 12000);
  const lessonTitles = (moduleDoc.lessons || []).map(l => l.title).join(', ');
  const langHint = forceEnglish ? ' Write all outputs in English.' : '';

  return `
${freePrompt}${langHint}

Use ONLY the Module lessons below as your factual basis.

Module context:
- Title: ${moduleDoc.title}
- Difficulty: ${moduleDoc.difficulty ?? 'Beginner'}
- Lesson count: ${(moduleDoc.lessons || []).length}
- Lesson titles: ${lessonTitles}

Lessons (markdown):
${lessonsMd}
`.trim();
}

// =========================
// Template Manager (CRUD)
// =========================
function TemplateManager({
  selectedId,
  onSelectId,
}: {
  selectedId?: string;
  onSelectId: (id: string) => void;
}) {
  const [templates, setTemplates] = useState<TemplateDoc[]>([]);
  const [form, setForm] = useState<TemplateDoc>({
    name: '',
    category: '',
    prompt: '',
    variables: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Realtime subscription
  useEffect(() => {
    const qy = query(collection(db, 'challengeTemplates'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(qy, snap => {
      setTemplates(snap.docs.map(d => ({ id: d.id, ...(d.data() as TemplateDoc) })));
    });
    return unsub;
  }, []);

  const resetForm = () => {
    setForm({ name: '', category: '', prompt: '', variables: [] });
    setEditingId(null);
    onSelectId('');
  };

  const handleSave = async () => {
    if (!form.name || !form.prompt) {
      alert('Name and Prompt are required.');
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'challengeTemplates', editingId), {
          name: form.name,
          category: form.category ?? '',
          prompt: form.prompt,
          variables: form.variables ?? [],
          updatedAt: serverTimestamp(),
        });
      } else {
        const ref = await addDoc(collection(db, 'challengeTemplates'), {
          name: form.name,
          category: form.category ?? '',
          prompt: form.prompt,
          variables: form.variables ?? [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        onSelectId(ref.id);
      }
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (t: TemplateDoc) => {
    setEditingId(t.id!);
    setForm({
      id: t.id,
      name: t.name,
      category: t.category ?? '',
      prompt: t.prompt,
      variables: t.variables ?? [],
    });
    onSelectId(t.id!);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this template?')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'challengeTemplates', id));
      if (editingId === id) resetForm();
      if (selectedId === id) onSelectId('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-2xl p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Challenge Templates</h3>
      </div>

      {/* List */}
      <div className="max-h-64 overflow-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Category</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map(t => (
              <tr
                key={t.id}
                className={`border-t hover:bg-gray-50 ${selectedId === t.id ? 'bg-indigo-50' : ''}`}
              >
                <td className="p-2">{t.name}</td>
                <td className="p-2">{t.category}</td>
                <td className="p-2 text-right space-x-2">
                  <button className="px-2 py-1 border rounded" onClick={() => handleEdit(t)}>
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 border rounded text-red-600"
                    onClick={() => handleDelete(t.id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={3}>
                  No templates yet. Create one below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Keywords Essay (Admin)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.category ?? ''}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            placeholder="Essay / Quiz / Project ..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Prompt</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 h-40"
            value={form.prompt}
            onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
            placeholder="e.g., Extract 5 core keywords from the lessons and write a ~1000-character essay that includes them."
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-black text-white"
          onClick={handleSave}
        >
          {editingId ? 'Update Template' : 'Create Template'}
        </button>
        <button className="px-4 py-2 rounded-lg border" onClick={resetForm}>
          Reset
        </button>
      </div>
    </div>
  );
}

// =========================
// Main
// =========================
export default function ChallengeList() {
  // Modules
  const [modules, setModules] = useState<ModuleDoc[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');

  // Selected module doc (live)
  const [moduleDoc, setModuleDoc] = useState<ModuleDoc | null>(null);

  // Templates
  const [templates, setTemplates] = useState<TemplateDoc[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(''); // optional
  const currentTemplate = useMemo(
    () => templates.find(t => t.id === selectedTemplateId) ?? null,
    [templates, selectedTemplateId]
  );

  // Admin custom prompt
  const [adminPrompt, setAdminPrompt] = useState<string>('');

  // Output options
  const [forceJson, setForceJson] = useState<boolean>(true);
  const [forceEnglish, setForceEnglish] = useState<boolean>(true);

  // Challenges of module
  const [challenges, setChallenges] = useState<ChallengeDoc[]>([]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // Direct OpenAI key (dev)
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(LS_API_KEY) || '');
  const [useDirectKey, setUseDirectKey] = useState<boolean>(!!apiKey);

  // ===== Realtime: modules list =====
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'modules'), snap => {
      setModules(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
    return unsub;
  }, []);

  // ===== Realtime: selected module doc =====
  useEffect(() => {
    if (!selectedModuleId) {
      setModuleDoc(null);
      return;
    }
    const unsub = onSnapshot(doc(db, 'modules', selectedModuleId), snap => {
      setModuleDoc(snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null);
    });
    return unsub;
  }, [selectedModuleId]);

  // ===== Realtime: templates list =====
  useEffect(() => {
    const qy = query(collection(db, 'challengeTemplates'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(qy, snap => {
      setTemplates(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
    return unsub;
  }, []);

  // ===== Realtime: challenges of selected module =====
  useEffect(() => {
    if (!selectedModuleId) {
      setChallenges([]);
      return;
    }
    const qy = query(
      collection(db, `modules/${selectedModuleId}/challenges`),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(qy, snap => {
      setChallenges(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
    return unsub;
  }, [selectedModuleId]);

  const saveKey = () => {
    if (useDirectKey && apiKey) localStorage.setItem(LS_API_KEY, apiKey);
    else localStorage.removeItem(LS_API_KEY);
    alert('Saved.');
  };

  const handleGenerate = async (existingChallengeId?: string) => {
    if (!selectedModuleId) return alert('Select a module.');

    setIsGenerating(true);
    try {
      // Always re-fetch latest module and (optional) template before generating
      const moduleSnap = await getDoc(doc(db, 'modules', selectedModuleId));
      if (!moduleSnap.exists()) throw new Error('Module not found.');
      const moduleLatest = { id: moduleSnap.id, ...(moduleSnap.data() as any) };

      if (!Array.isArray(moduleLatest.lessons) || moduleLatest.lessons.length === 0) {
        throw new Error('This module has no lessons.');
      }

      // Decide prompt: admin first, else template
      let finalUserPrompt = '';
      let templateUsed: { id?: string; name?: string } = {};

      // (A) 관리자 커스텀 프롬프트가 있으면 그걸 규칙으로 → BLUEPRINT 생성
      if (adminPrompt?.trim()) {
        finalUserPrompt = buildBlueprintPromptText({
          moduleDoc: moduleLatest,
          freePrompt: adminPrompt.trim(),
          forceEnglish,
        });
        templateUsed = { id: 'custom', name: 'Admin Custom (Blueprint)' };

        // (B) 없으면 템플릿을 규칙으로 → BLUEPRINT 생성
      } else {
        const tmplId = currentTemplate?.id ?? templates[0]?.id;
        if (!tmplId) throw new Error('Provide a custom prompt or choose a template.');

        const tmplSnap = await getDoc(doc(db, 'challengeTemplates', tmplId));
        if (!tmplSnap.exists()) throw new Error('Template not found.');
        const tmpl = { id: tmplSnap.id, ...(tmplSnap.data() as any) };
        templateUsed = { id: tmpl.id, name: `${tmpl.name} (Blueprint)` };

        // 템플릿에 핸들바 변수가 있으면 채우고, 없으면 그대로 사용
        const lessonsMd = clampText(toLessonsMarkdown(moduleLatest.lessons, 10), 12000);
        const ctx = {
          moduleTitle: moduleLatest.title,
          moduleDifficulty: moduleLatest.difficulty ?? 'Beginner',
          lessonsMarkdown: lessonsMd,
          templateName: tmpl.name,
        };
        const hasVars = /\{\{\s*lessonsMarkdown\s*\}\}|\{\{\s*moduleTitle\s*\}\}/.test(
          tmpl.prompt || ''
        );
        const ruleText = hasVars ? fillTemplate(tmpl.prompt, ctx) : tmpl.prompt;

        finalUserPrompt = buildBlueprintPromptText({
          moduleDoc: moduleLatest,
          freePrompt: ruleText,
          forceEnglish,
        });
      }

      // Call LLM (direct or CF)
      let resultPayload: any;
      if (useDirectKey && apiKey) {
        resultPayload = await openAIChatDirect({
          apiKey,
          system: 'You are an educational content generator.',
          user: finalUserPrompt,
          model: 'gpt-4o-mini',
          temperature: 0.7,
        });
      } else {
        resultPayload = await callFunctionGenerateChallenge({
          prompt: finalUserPrompt,
          forceJson,
          forceEnglish,
        });
      }

      // Save to Firestore
      if (existingChallengeId) {
        await updateDoc(doc(db, `modules/${moduleLatest.id}/challenges/${existingChallengeId}`), {
          generatedContent: resultPayload,
          templateId: templateUsed.id ?? null,
          templateName: templateUsed.name ?? null,
          rawPrompt: adminPrompt?.trim() || null,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, `modules/${moduleLatest.id}/challenges`), {
          templateId: templateUsed.id ?? null,
          templateName: templateUsed.name ?? null,
          generatedContent: resultPayload,
          rawPrompt: adminPrompt?.trim() || null,
          createdAt: serverTimestamp(),
          updatedAt: null,
        });
      }

      alert('Generated successfully.');
    } catch (e: any) {
      console.error(e);
      alert(e.message ?? 'Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    if (!selectedModuleId) return;
    if (!window.confirm('Delete this challenge?')) return;
    await deleteDoc(doc(db, `modules/${selectedModuleId}/challenges/${id}`));
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white border rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {/* Module */}
          <div>
            <label className="block text-sm font-medium mb-1">Module</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={selectedModuleId}
              onChange={e => setSelectedModuleId(e.target.value)}
            >
              <option value="">Select a module</option>
              {modules.map(m => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              We’ll always attach the latest lessons from this module.
            </p>
          </div>

          {/* Template (optional) */}
          <div>
            <label className="block text-sm font-medium mb-1">Template (optional)</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={selectedTemplateId}
              onChange={e => setSelectedTemplateId(e.target.value)}
            >
              <option value="">(None)</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              If empty, only the admin prompt below will be used.
            </p>
          </div>

          {/* Direct API key (dev) */}
          <div className="border rounded-xl p-3">
            <label className="flex items-center gap-2 text-sm mb-2">
              <input
                type="checkbox"
                checked={useDirectKey}
                onChange={e => setUseDirectKey(e.target.checked)}
              />
              Use direct OpenAI API (dev)
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="sk-... (stored locally)"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              disabled={!useDirectKey}
            />
            <div className="flex gap-2 mt-2">
              <button
                className="px-3 py-1.5 border rounded"
                onClick={saveKey}
                disabled={!useDirectKey}
              >
                Save key
              </button>
              <button
                className="px-3 py-1.5 border rounded"
                onClick={() => {
                  localStorage.removeItem(LS_API_KEY);
                  setApiKey('');
                  setUseDirectKey(false);
                }}
              >
                Clear
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              For production, use the Cloud Function proxy to avoid exposing keys.
            </p>
          </div>
        </div>

        {/* Admin custom prompt */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-1">Custom Prompt (Admin-authored)</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 h-28"
              placeholder="Ex) 이 학습 컨텐츠들을 이용하여 핵심 키워드 5개를 추출하고, 이 핵심 키워드를 포함하여 에세이 1000자를 작성하시오."
              value={adminPrompt}
              onChange={e => setAdminPrompt(e.target.value)}
            />
            <div className="mt-2 flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={forceJson}
                  onChange={e => setForceJson(e.target.checked)}
                />
                Force JSON output
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={forceEnglish}
                  onChange={e => setForceEnglish(e.target.checked)}
                />
                Force English result
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your prompt will be sent as-is. We append the module’s lessons as context under the
              hood.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <button
            className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-60"
            onClick={() => handleGenerate()}
            disabled={!selectedModuleId || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Challenge'}
          </button>
          <button
            className="px-4 py-2 rounded-lg border disabled:opacity-60"
            onClick={() => {
              if (!selectedModuleId) return alert('Select a module.');
              if (!challenges.length) return alert('No challenge to regenerate.');
              handleGenerate(challenges[0].id); // regenerate latest (or per-row button)
            }}
            disabled={!selectedModuleId || !challenges.length || isGenerating}
          >
            Regenerate (Update latest)
          </button>
        </div>
      </div>

      {/* Two-column: Templates / Challenges */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Template manager */}
        <TemplateManager selectedId={selectedTemplateId} onSelectId={setSelectedTemplateId} />

        {/* Challenges of current module */}
        <div className="bg-white border rounded-2xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Generated Challenges</h3>
            <span className="text-sm text-gray-500">
              {moduleDoc ? moduleDoc.title : 'No module selected'}
            </span>
          </div>

          <div className="max-h-[420px] overflow-auto border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2">Template</th>
                  <th className="text-left p-2">Created</th>
                  <th className="text-left p-2">Updated</th>
                  <th className="text-right p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {challenges.map(c => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{c.templateName || 'Custom'}</td>
                    <td className="p-2">
                      {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : '-'}
                    </td>
                    <td className="p-2">
                      {c.updatedAt?.toDate ? c.updatedAt.toDate().toLocaleString() : '-'}
                    </td>
                    <td className="p-2 text-right space-x-2">
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => handleGenerate(c.id)}
                      >
                        Regenerate
                      </button>
                      <button
                        className="px-2 py-1 border rounded text-red-600"
                        onClick={() => handleDeleteChallenge(c.id!)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {(!selectedModuleId || challenges.length === 0) && (
                  <tr>
                    <td className="p-3 text-gray-500" colSpan={4}>
                      {selectedModuleId
                        ? 'No challenges yet.'
                        : 'Select a module to see its challenges.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Preview of latest */}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Preview (latest)</h4>
            <pre className="text-xs bg-gray-50 p-3 rounded-xl overflow-auto max-h-72">
              {challenges[0]?.generatedContent
                ? typeof challenges[0].generatedContent === 'string'
                  ? challenges[0].generatedContent
                  : JSON.stringify(challenges[0].generatedContent, null, 2)
                : '// No preview'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
