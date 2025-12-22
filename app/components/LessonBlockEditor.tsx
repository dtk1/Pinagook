'use client';

import { useState } from 'react';
import { LessonBlock, LessonBlockType } from '../types/lesson';
import Button from './Button';
import Card from './Card';

interface LessonBlockEditorProps {
  blocks: LessonBlock[];
  onChange: (blocks: LessonBlock[]) => void;
}

export default function LessonBlockEditor({ blocks, onChange }: LessonBlockEditorProps) {
  const [selectedType, setSelectedType] = useState<LessonBlockType>('text');

  const addBlock = () => {
    const newBlock: LessonBlock = {
      id: Date.now().toString(),
      type: selectedType,
      content: '',
      order: blocks.length,
      ...(selectedType === 'question' && { options: [], correctAnswer: '' }),
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<LessonBlock>) => {
    onChange(
      blocks.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    newBlocks.forEach((block, i) => {
      block.order = i;
    });
    onChange(newBlocks);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as LessonBlockType)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
        >
          <option value="text">Text</option>
          <option value="question">Question</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="file">File</option>
        </select>
        <Button variant="primary" onClick={addBlock} type="button">
          Add Block
        </Button>
      </div>

      <div className="space-y-3">
        {blocks.map((block, index) => (
          <Card key={block.id}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {block.type}
                </span>
                <span className="text-xs text-gray-400">#{index + 1}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => moveBlock(block.id, 'up')}
                  disabled={index === 0}
                  className="text-xs text-gray-600 hover:text-[#0ea5e9] disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveBlock(block.id, 'down')}
                  disabled={index === blocks.length - 1}
                  className="text-xs text-gray-600 hover:text-[#0ea5e9] disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() => deleteBlock(block.id)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            {block.type === 'text' && (
              <textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                rows={3}
                placeholder="Enter text content..."
              />
            )}

            {block.type === 'question' && (
              <div className="space-y-3">
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  rows={2}
                  placeholder="Enter question..."
                />
                <div className="space-y-2">
                  {(block.options || []).map((option, optIndex) => (
                    <div key={optIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(block.options || [])];
                          newOptions[optIndex] = e.target.value;
                          updateBlock(block.id, { options: newOptions });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                        placeholder={`Option ${optIndex + 1}`}
                      />
                      <input
                        type="radio"
                        checked={block.correctAnswer === option}
                        onChange={() => updateBlock(block.id, { correctAnswer: option })}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [...(block.options || []), ''];
                      updateBlock(block.id, { options: newOptions });
                    }}
                    className="text-sm text-[#0ea5e9] hover:underline"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            )}

            {(block.type === 'image' || block.type === 'video' || block.type === 'file') && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  placeholder={`Enter ${block.type} URL...`}
                />
                {block.type === 'file' && (
                  <input
                    type="text"
                    value={block.fileName || ''}
                    onChange={(e) => updateBlock(block.id, { fileName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    placeholder="File name (optional)"
                  />
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {blocks.length === 0 && (
        <p className="text-center text-gray-500 py-8">No blocks yet. Add your first block above.</p>
      )}
    </div>
  );
}



