
import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useBoard } from "@/context/BoardContext";
import { TaskList as TaskListType } from "@/types";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TaskListProps {
  list: TaskListType;
  boardId: string;
  cards: Array<{
    id: string;
    title: string;
    description?: string;
    activities: any[];
    attachments: any[];
    createdAt: string;
    listId: string;
    comments: any[];
  }>;
}

export function TaskList({ list, boardId, cards }: TaskListProps) {
  const { addCardToList } = useBoard();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;
    
    addCardToList(boardId, list.id, newCardTitle);
    setNewCardTitle("");
    setIsAddingCard(false);
  };

  // Determine list color
  const getListColor = () => {
    if (list.name === "To Do") return "todo";
    if (list.name === "Doing") return "doing";
    if (list.name === "Done") return "done";
    return "";
  };

  return (
    <div className={`board-column bg-card rounded-md shadow-sm p-2 border board-column-${getListColor()}`}>
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">{list.name}</h3>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
            {cards.length}
          </span>
        </div>
        
        <Droppable droppableId={list.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[100px] transition-colors ${
                snapshot.isDraggingOver ? 'bg-muted/50' : ''
              }`}
            >
              {cards.map((card, index) => (
                <TaskCard 
                  key={card.id} 
                  card={card} 
                  boardId={boardId}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        
        {isAddingCard ? (
          <div className="mt-2">
            <Input
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="mb-2"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCard();
                } else if (e.key === 'Escape') {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }
              }}
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleAddCard}>Add Card</Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground mt-2"
            onClick={() => setIsAddingCard(true)}
          >
            <PlusIcon className="h-4 w-4 mr-1" /> Add a card
          </Button>
        )}
      </div>
    </div>
  );
}
