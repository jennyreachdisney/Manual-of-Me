import React, { useState } from 'react';
import { Trash2, Edit2, MessageSquare, Check, X, ThumbsUp, Save, GripVertical } from 'lucide-react';
import { UsageItem } from '../types';

interface UsageCardProps {
  item: UsageItem;
  onIncrement: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newContent: string) => void;
  onAddComment: (itemId: string, text: string) => void;
  onDeleteComment: (itemId: string, commentId: string) => void;
  
  // DND Props (Optional)
  innerRef?: React.Ref<any>;
  draggableProps?: any;
  dragHandleProps?: any;
  isDragging?: boolean;
}

const UsageCard: React.FC<UsageCardProps> = ({
  item,
  onIncrement,
  onDelete,
  onUpdate,
  onAddComment,
  onDeleteComment,
  innerRef,
  draggableProps,
  dragHandleProps,
  isDragging
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const isConfirmed = item.count >= 3;

  // Save changes to the main usage text
  const handleSaveEdit = () => {
    if (editContent.trim()) {
      onUpdate(item.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(item.content);
    setIsEditing(false);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(item.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      className={`relative bg-white rounded-xl transition-all duration-200 ${
        isDragging ? 'shadow-2xl scale-[1.02] z-50 ring-2 ring-indigo-400' : ''
      } ${
        isConfirmed
          ? 'border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
          : 'border border-slate-200 shadow-sm hover:shadow-md'
      }`}
      style={draggableProps?.style}
    >
      {/* Badge for confirmed status */}
      {isConfirmed && !isDragging && (
        <div className="absolute -top-3 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 z-10">
          <Check className="w-3 h-3" />
          확정된 사용법
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          
          {/* Drag Handle (Only visible if dragHandleProps are provided) */}
          {dragHandleProps && (
             <div 
               {...dragHandleProps}
               className="mt-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-1 -ml-2"
               title="순서 변경"
             >
               <GripVertical className="w-5 h-5" />
             </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700 resize-none"
                  rows={2}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" /> 저장
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-xs bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md hover:bg-slate-300"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className={`text-lg font-medium leading-relaxed break-words ${isConfirmed ? 'text-slate-900' : 'text-slate-700'}`}>
                  {item.content}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  작성일: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Count Button */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onIncrement(item.id)}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all active:scale-95 ${
                isConfirmed
                  ? 'bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-100'
                  : 'bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100'
              }`}
              title="사용 횟수 증가"
            >
              <ThumbsUp className={`w-5 h-5 mb-0.5 ${isConfirmed ? 'fill-yellow-600' : ''}`} />
              <span className="font-bold text-sm">{item.count}</span>
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              item.comments.length > 0 || showComments ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {showComments ? '메모 접기' : `메모 (${item.comments.length})`}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="수정"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-slate-50 px-5 py-4 rounded-b-xl border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
          {/* Comment List */}
          <div className="space-y-3 mb-4">
            {item.comments.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-2">
                추가 메모가 없습니다.
              </p>
            )}
            {item.comments.map((comment) => (
              <div key={comment.id} className="group flex gap-3 text-sm">
                <div className="w-1 bg-indigo-200 rounded-full my-1"></div>
                <div className="flex-1">
                  <p className="text-slate-700">{comment.text}</p>
                  <span className="text-[10px] text-slate-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteComment(item.id, comment.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Comment Input */}
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="변형 방법이나 참고사항 메모..."
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-900 disabled:bg-slate-300 transition-colors"
            >
              등록
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UsageCard;