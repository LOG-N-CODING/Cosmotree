import React, { useState, useEffect, FormEvent } from 'react';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export interface Lesson {
  id?: string;
  title: string;
  content: string;
}

export interface Module {
  id?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  subtitle: string;
  imageUrl: string;
  lessons: Lesson[];
}

export const LearnList: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [newModule, setNewModule] = useState<{
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | undefined;
    title: string;
    subtitle: string;
    imageFile: File | null;
  }>({ difficulty: 'Beginner', title: '', subtitle: '', imageFile: null });
  const [modulePreview, setModulePreview] = useState<string>('');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<{
    moduleId: string;
    index: number;
    title: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'modules'), snapshot => {
      const mods: Module[] = [];
      snapshot.forEach(docSnap => {
        mods.push({ id: docSnap.id, ...(docSnap.data() as Module) });
      });
      setModules(mods);
    });
    return () => unsub();
  }, []);

  // Module handlers
  const handleAddModule = async (e: FormEvent) => {
    e.preventDefault();
    if (!newModule.title.trim() || !newModule.subtitle.trim()) return;
    if (modules.some(m => m.title === newModule.title.trim())) {
      alert('Module title already exists.');
      return;
    }
    const url = modulePreview;
    await addDoc(collection(db, 'modules'), {
      difficulty: newModule.difficulty,
      title: newModule.title.trim(),
      subtitle: newModule.subtitle.trim(),
      imageUrl: url,
      lessons: [],
    });
    setNewModule({ difficulty: 'Beginner', title: '', subtitle: '', imageFile: null });
    setModulePreview('');
  };

  const handleDeleteModule = async (moduleId: string) => {
    await deleteDoc(doc(db, 'modules', moduleId));
    if (expandedModuleId === moduleId) setExpandedModuleId(null);
  };

  const handleStartEditModule = (mod: Module) => {
    setEditingModule({ ...mod });
  };

  const handleUpdateModule = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingModule || !editingModule.id) return;
    const { id, title, subtitle, difficulty, imageUrl } = editingModule;
    if (!title.trim() || !subtitle.trim()) return;
    await updateDoc(doc(db, 'modules', id), {
      title: title.trim(),
      subtitle: subtitle.trim(),
      difficulty,
      imageUrl,
    });
    setEditingModule(null);
  };

  // Lesson handlers
  const handleAddLesson = async (moduleId: string, title: string, content: string) => {
    if (!title.trim() || !content.trim()) return;
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return;
    if (mod.lessons.some(l => l.title === title.trim())) {
      alert('Lesson title already exists.');
      return;
    }
    const updatedLessons = [...mod.lessons, { title: title.trim(), content: content.trim() }];
    await updateDoc(doc(db, 'modules', moduleId), { lessons: updatedLessons });
  };

  const handleDeleteLesson = async (moduleId: string, index: number) => {
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return;
    const updatedLessons = mod.lessons.filter((_, i) => i !== index);
    await updateDoc(doc(db, 'modules', moduleId), { lessons: updatedLessons });
  };

  const handleStartEditLesson = (moduleId: string, index: number, lesson: Lesson) => {
    setEditingLesson({ moduleId, index, title: lesson.title, content: lesson.content });
  };

  const handleUpdateLesson = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    const { moduleId, index, title, content } = editingLesson;
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return;
    const updatedLessons = mod.lessons.map((l, i) =>
      i === index ? { title: title.trim(), content: content.trim() } : l
    );
    await updateDoc(doc(db, 'modules', moduleId), { lessons: updatedLessons });
    setEditingLesson(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Learning Modules</h2>

      {/* Add New Module Form */}
      <form onSubmit={handleAddModule} className="space-y-4 mb-8 border p-4 rounded">
        <h4 className="font-medium">New Module</h4>
        <div>
          <label className="block text-sm">Difficulty</label>
          <select
            className="mt-1 block w-full border rounded p-2"
            value={newModule.difficulty}
            onChange={e => setNewModule({ ...newModule, difficulty: e.target.value as any })}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Title</label>
          <input
            type="text"
            maxLength={15}
            className="mt-1 block w-full border rounded p-2"
            value={newModule.title}
            onChange={e => setNewModule({ ...newModule, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm">Subtitle</label>
          <input
            type="text"
            maxLength={40}
            className="mt-1 block w-full border rounded p-2"
            value={newModule.subtitle}
            onChange={e => setNewModule({ ...newModule, subtitle: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm">Image File</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full"
            onChange={e => {
              const file = e.target.files?.[0] || null;
              setNewModule({ ...newModule, imageFile: file });
              setModulePreview(file ? URL.createObjectURL(file) : '');
            }}
          />
          {modulePreview && (
            <img
              src={modulePreview}
              alt="Preview"
              className="mt-2 w-32 h-20 object-cover rounded"
            />
          )}
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Add Module
        </button>
      </form>

      {/* Module List */}
      {modules.map(mod => (
        <div key={mod.id} className="border p-4 rounded mb-6">
          {editingModule?.id === mod.id ? (
            <form onSubmit={handleUpdateModule} className="space-y-2">
              <h4 className="font-medium">Edit Module</h4>
              <input
                type="text"
                value={editingModule?.title}
                onChange={e =>
                  setEditingModule(prev => (prev ? { ...prev, title: e.target.value } : null))
                }
                className="block w-full border rounded p-2"
              />
              <input
                type="text"
                value={editingModule?.subtitle}
                onChange={e =>
                  setEditingModule(prev => (prev ? { ...prev, subtitle: e.target.value } : null))
                }
                className="block w-full border rounded p-2"
              />
              <div className="flex space-x-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded" type="submit">
                  Save
                </button>
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                  type="button"
                  onClick={() => setEditingModule(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">{mod.title}</h3>
                <div className="space-x-2">
                  <button onClick={() => handleStartEditModule(mod)} className="text-blue-500">
                    Edit
                  </button>
                  <button
                    onClick={() => mod.id && handleDeleteModule(mod.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{mod.subtitle}</p>
              <button
                className="text-gray-500 mb-2"
                onClick={() => setExpandedModuleId(expandedModuleId === mod.id ? null : mod.id!)}
              >
                {expandedModuleId === mod.id ? 'Hide Lessons ▲' : 'Show Lessons ▼'}
              </button>
            </div>
          )}
          {expandedModuleId === mod.id && (
            <div className="mt-4">
              {/* Lessons */}
              {mod.lessons.map((lesson, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 p-2 mb-2 rounded"
                >
                  {editingLesson?.moduleId === mod.id && editingLesson?.index === idx ? (
                    <form onSubmit={handleUpdateLesson} className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editingLesson?.title}
                        onChange={e =>
                          setEditingLesson({ ...editingLesson, title: e.target.value })
                        }
                        className="block w-full border rounded p-1"
                      />
                      <textarea
                        rows={2}
                        value={editingLesson.content}
                        onChange={e =>
                          setEditingLesson({ ...editingLesson, content: e.target.value })
                        }
                        className="block w-full border rounded p-1"
                      />
                      <div className="flex space-x-2">
                        <button className="bg-green-600 text-white px-2 py-1 rounded" type="submit">
                          Save
                        </button>
                        <button
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                          type="button"
                          onClick={() => setEditingLesson(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div>
                        <strong>{lesson.title}</strong>
                        <p className="text-sm">{lesson.content}</p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleStartEditLesson(mod.id!, idx, lesson)}
                          className="text-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(mod.id!, idx)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {/* Add new lesson */}
              <LessonForm module={mod} onAdd={handleAddLesson} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface LessonFormProps {
  module: Module;
  onAdd: (moduleId: string, title: string, content: string) => void;
}

const LessonForm: React.FC<LessonFormProps> = ({ module, onAdd }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAdd(module.id!, title.trim(), content.trim());
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4 border-t pt-4">
      <h4 className="font-medium">Add Lesson</h4>
      <input
        type="text"
        placeholder="Lesson title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="block w-full border rounded p-2"
      />
      <textarea
        placeholder="Lesson content"
        rows={3}
        value={content}
        onChange={e => setContent(e.target.value)}
        className="block w-full border rounded p-2"
      />
      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">
        Add Lesson
      </button>
    </form>
  );
};
