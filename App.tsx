import React, { useState, useEffect } from 'react';
import { Plus, Search, BookOpen } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { UsageItem, FilterType, Comment } from './types';
import UsageCard from './components/UsageCard';
import FilterControl from './components/FilterControl';

const App: React.FC = () => {
  // State initialization with localStorage persistence
  const [items, setItems] = useState<UsageItem[]>(() => {
    const saved = localStorage.getItem('usageItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [newItemContent, setNewItemContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('usageItems', JSON.stringify(items));
  }, [items]);

  // --- Actions ---

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemContent.trim()) return;

    const newItem: UsageItem = {
      id: crypto.randomUUID(),
      content: newItemContent.trim(),
      count: 0,
      comments: [],
      createdAt: Date.now(),
    };

    setItems([newItem, ...items]);
    setNewItemContent('');
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('이 사용법을 정말 삭제하시겠습니까?')) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleIncrement = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  const handleUpdateItem = (id: string, newContent: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, content: newContent } : item
      )
    );
  };

  const handleAddComment = (itemId: string, text: string) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
    };

    setItems(
      items.map((item) =>
        item.id === itemId
          ? { ...item, comments: [...item.comments, newComment] }
          : item
      )
    );
  };

  const handleDeleteComment = (itemId: string, commentId: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              comments: item.comments.filter((c) => c.id !== commentId),
            }
          : item
      )
    );
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(destinationIndex, 0, reorderedItem);

    setItems(newItems);
  };

  // --- Filtering Logic ---

  const isDragEnabled = filterType === FilterType.ALL && !searchTerm;

  const filteredItems = items.filter((item) => {
    // 1. Search Filter
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Status Filter
    let matchesStatus = true;
    if (filterType === FilterType.CONFIRMED) {
      matchesStatus = item.count >= 3;
    } else if (filterType === FilterType.UNCONFIRMED) {
      matchesStatus = item.count < 3;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              나만의 사용법 노트
            </h1>
          </div>
          <p className="text-slate-500 max-w-lg mx-auto">
            반복해서 검증된 방법만이 금빛으로 빛납니다.<br />3회 이상 성공하면 확정된 사용법이 됩니다.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleAddItem} className="flex gap-3">
            <input
              type="text"
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
              placeholder="새로운 사용법이나 노하우를 입력하세요..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!newItemContent.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">추가</span>
            </button>
          </form>
        </div>

        {/* Filters */}
        <FilterControl 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterChange={setFilterType}
        />

        {/* List */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              {items.length === 0 
                ? "아직 기록된 사용법이 없습니다. 첫 번째 노하우를 추가해보세요!" 
                : "검색 조건에 맞는 항목이 없습니다."}
            </div>
          ) : isDragEnabled ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="usage-list">
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {filteredItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <UsageCard
                            item={item}
                            onIncrement={handleIncrement}
                            onDelete={handleDeleteItem}
                            onUpdate={handleUpdateItem}
                            onAddComment={handleAddComment}
                            onDeleteComment={handleDeleteComment}
                            // DND props
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="space-y-4">
               {/* Normal render when filtering is active (DND disabled) */}
               {filteredItems.map((item) => (
                 <UsageCard
                   key={item.id}
                   item={item}
                   onIncrement={handleIncrement}
                   onDelete={handleDeleteItem}
                   onUpdate={handleUpdateItem}
                   onAddComment={handleAddComment}
                   onDeleteComment={handleDeleteComment}
                 />
               ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default App;