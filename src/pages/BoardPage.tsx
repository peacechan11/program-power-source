
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useBoard } from "@/context/BoardContext";
import { Layout } from "@/components/layout/Layout";
import { TaskList } from "@/components/board/TaskList";
import { BoardHeader } from "@/components/board/BoardHeader";
import { MemberList } from "@/components/board/MemberList";

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const { boards, currentBoard, setCurrentBoard, moveCard } = useBoard();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!boardId) return;
    
    const board = boards.find(b => b.id === boardId);
    if (board) {
      setCurrentBoard(board);
    }
    setIsLoading(false);
  }, [boardId, boards, setCurrentBoard]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-[70vh]">
          <div>Loading board...</div>
        </div>
      </Layout>
    );
  }
  
  if (!currentBoard) {
    return <Navigate to="/" />;
  }
  
  // Get cards for each list
  const getCardsForList = (listId: string) => {
    return currentBoard.cards.filter(card => card.listId === listId);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveCard(draggableId, source.droppableId, destination.droppableId);
  };
  
  return (
    <Layout>
      <div className="p-6">
        <BoardHeader boardId={currentBoard.id} boardName={currentBoard.name} />
        
        <MemberList members={currentBoard.members} />
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentBoard.lists.sort((a, b) => a.order - b.order).map((list) => (
              <TaskList 
                key={list.id}
                list={list}
                boardId={currentBoard.id}
                cards={getCardsForList(list.id)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </Layout>
  );
}
