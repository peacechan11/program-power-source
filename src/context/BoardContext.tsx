
import React, { createContext, useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { Board, TaskCard, Member, TaskList, Activity, Comment, ListType } from "@/types";

interface BoardContextProps {
  boards: Board[];
  currentBoard: Board | null;
  currentUser: { id: string; name: string; email: string };
  setCurrentBoard: (board: Board) => void;
  createBoard: (name: string) => void;
  addMemberToBoard: (boardId: string, email: string) => void;
  addCardToList: (boardId: string, listId: string, title: string) => void;
  moveCard: (cardId: string, sourceListId: string, destinationListId: string) => void;
  addActivityToCard: (boardId: string, cardId: string, activity: Omit<Activity, "id" | "createdAt" | "createdBy">) => void;
  completeActivity: (boardId: string, cardId: string, activityId: string) => void;
  addCommentToCard: (boardId: string, cardId: string, text: string) => void;
  closeCard: (boardId: string, cardId: string) => void;
}

const BoardContext = createContext<BoardContextProps | undefined>(undefined);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  
  // Mock current user - in a real app, this would come from authentication
  const currentUser = {
    id: "user-1",
    name: "Current User",
    email: "user@example.com",
  };

  useEffect(() => {
    // Initialize with sample data
    const initialBoard = {
      id: uuidv4(),
      name: "Project Management",
      members: [
        { id: "user-1", name: "Current User", email: "user@example.com" },
        { id: "user-2", name: "John Doe", email: "john@example.com" },
      ],
      lists: [
        { id: "list-1", name: "To Do", order: 0, isDefault: true },
        { id: "list-2", name: "Doing", order: 1, isDefault: true },
        { id: "list-3", name: "Done", order: 2, isDefault: true },
      ],
      cards: [
        {
          id: "card-1",
          title: "Research Project Requirements",
          description: "Gather all necessary information for the project",
          listId: "list-1",
          activities: [
            {
              id: "activity-1",
              title: "Review client documentation",
              isCompleted: false,
              createdAt: new Date().toISOString(),
              createdBy: "user-1",
            }
          ],
          attachments: [],
          createdAt: new Date().toISOString(),
          comments: [],
        },
        {
          id: "card-2",
          title: "Design User Interface",
          description: "Create wireframes and mockups",
          listId: "list-2",
          activities: [],
          attachments: [],
          createdAt: new Date().toISOString(),
          comments: [],
        },
      ],
    };
    
    setBoards([initialBoard]);
    setCurrentBoard(initialBoard);
  }, []);

  const createBoard = (name: string) => {
    const newBoard: Board = {
      id: uuidv4(),
      name,
      members: [{ ...currentUser }],
      lists: [
        { id: "list-1", name: "To Do", order: 0, isDefault: true },
        { id: "list-2", name: "Doing", order: 1, isDefault: true },
        { id: "list-3", name: "Done", order: 2, isDefault: true },
      ],
      cards: [],
    };
    
    setBoards([...boards, newBoard]);
    setCurrentBoard(newBoard);
    
    toast({
      title: "Board Created",
      description: `${name} board has been created successfully.`,
    });
  };

  const addMemberToBoard = (boardId: string, email: string) => {
    if (!email) return;
    
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        if (board.id !== boardId) return board;
        
        // Check if member already exists
        const memberExists = board.members.some(member => member.email === email);
        if (memberExists) {
          toast({
            title: "Member already exists",
            description: `${email} is already a member of this board.`,
            variant: "destructive",
          });
          return board;
        }
        
        const newMember: Member = {
          id: uuidv4(),
          name: email.split("@")[0],
          email,
        };
        
        toast({
          title: "Member Added",
          description: `${email} has been added to the board.`,
        });
        
        return {
          ...board,
          members: [...board.members, newMember],
        };
      });
    });
    
    // Update current board if it's the one being modified
    if (currentBoard && currentBoard.id === boardId) {
      setCurrentBoard(prevBoard => {
        if (!prevBoard) return null;
        
        const memberExists = prevBoard.members.some(member => member.email === email);
        if (memberExists) return prevBoard;
        
        const newMember: Member = {
          id: uuidv4(),
          name: email.split("@")[0],
          email,
        };
        
        return {
          ...prevBoard,
          members: [...prevBoard.members, newMember],
        };
      });
    }
  };

  const addCardToList = (boardId: string, listId: string, title: string) => {
    if (!title.trim()) return;
    
    const newCard: TaskCard = {
      id: uuidv4(),
      title,
      listId,
      activities: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      comments: [],
    };
    
    setBoards(prevBoards => 
      prevBoards.map(board => {
        if (board.id !== boardId) return board;
        
        // Send notification to members (in a real app)
        const list = board.lists.find(l => l.id === listId);
        toast({
          title: "Card Created",
          description: `New card "${title}" added to ${list?.name}.`,
        });
        
        return {
          ...board,
          cards: [...board.cards, newCard],
        };
      })
    );
    
    // Update current board if it's the one being modified
    if (currentBoard && currentBoard.id === boardId) {
      setCurrentBoard(prevBoard => {
        if (!prevBoard) return null;
        
        return {
          ...prevBoard,
          cards: [...prevBoard.cards, newCard],
        };
      });
    }
  };

  const moveCard = (cardId: string, sourceListId: string, destinationListId: string) => {
    if (!currentBoard) return;
    
    setBoards(prevBoards => 
      prevBoards.map(board => {
        const cardToMove = board.cards.find(c => c.id === cardId);
        if (!cardToMove) return board;
        
        const sourceList = board.lists.find(l => l.id === sourceListId);
        const destList = board.lists.find(l => l.id === destinationListId);
        
        if (sourceList && destList) {
          toast({
            title: "Card Moved",
            description: `Card "${cardToMove.title}" moved from ${sourceList.name} to ${destList.name}.`,
          });
        }
        
        return {
          ...board,
          cards: board.cards.map(card => 
            card.id === cardId
              ? { ...card, listId: destinationListId }
              : card
          ),
        };
      })
    );
    
    setCurrentBoard(prevBoard => {
      if (!prevBoard) return null;
      
      return {
        ...prevBoard,
        cards: prevBoard.cards.map(card => 
          card.id === cardId
            ? { ...card, listId: destinationListId }
            : card
        ),
      };
    });
  };

  const addActivityToCard = (
    boardId: string,
    cardId: string,
    activityData: Omit<Activity, "id" | "createdAt" | "createdBy">
  ) => {
    const newActivity: Activity = {
      id: uuidv4(),
      ...activityData,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
    };
    
    setBoards(prevBoards => 
      prevBoards.map(board => {
        if (board.id !== boardId) return board;
        
        return {
          ...board,
          cards: board.cards.map(card => {
            if (card.id !== cardId) return card;
            
            toast({
              title: "Activity Added",
              description: `New activity "${activityData.title}" added to card "${card.title}".`,
            });
            
            return {
              ...card,
              activities: [...card.activities, newActivity],
            };
          }),
        };
      })
    );
    
    // Update current board
    if (currentBoard && currentBoard.id === boardId) {
      setCurrentBoard(prevBoard => {
        if (!prevBoard) return null;
        
        return {
          ...prevBoard,
          cards: prevBoard.cards.map(card => {
            if (card.id !== cardId) return card;
            
            return {
              ...card,
              activities: [...card.activities, newActivity],
            };
          }),
        };
      });
    }
  };

  const completeActivity = (boardId: string, cardId: string, activityId: string) => {
    setBoards(prevBoards => 
      prevBoards.map(board => {
        if (board.id !== boardId) return board;
        
        return {
          ...board,
          cards: board.cards.map(card => {
            if (card.id !== cardId) return card;
            
            const updatedActivities = card.activities.map(activity => 
              activity.id === activityId
                ? { ...activity, isCompleted: true }
                : activity
            );
            
            const completedActivity = card.activities.find(a => a.id === activityId);
            if (completedActivity) {
              toast({
                title: "Activity Completed",
                description: `Activity "${completedActivity.title}" marked as complete.`,
              });
            }
            
            return {
              ...card,
              activities: updatedActivities,
            };
          }),
        };
      })
    );
    
    // Update current board
    if (currentBoard && currentBoard.id === boardId) {
      setCurrentBoard(prevBoard => {
        if (!prevBoard) return null;
        
        return {
          ...prevBoard,
          cards: prevBoard.cards.map(card => {
            if (card.id !== cardId) return card;
            
            const updatedActivities = card.activities.map(activity => 
              activity.id === activityId
                ? { ...activity, isCompleted: true }
                : activity
            );
            
            // Automatically move to "Doing" if all activities are completed
            let updatedListId = card.listId;
            const isAllCompleted = updatedActivities.length > 0 && 
                                 updatedActivities.every(activity => activity.isCompleted);
            
            if (isAllCompleted && card.listId === "list-1") { // TODO list
              updatedListId = "list-2"; // DOING list
            }
            
            return {
              ...card,
              listId: updatedListId,
              activities: updatedActivities,
            };
          }),
        };
      });
    }
  };

  const addCommentToCard = (boardId: string, cardId: string, text: string) => {
    const newComment: Comment = {
      id: uuidv4(),
      text,
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdAt: new Date().toISOString(),
    };
    
    setBoards(prevBoards => 
      prevBoards.map(board => {
        if (board.id !== boardId) return board;
        
        return {
          ...board,
          cards: board.cards.map(card => 
            card.id === cardId
              ? { ...card, comments: [...card.comments, newComment] }
              : card
          ),
        };
      })
    );
    
    // Update current board
    if (currentBoard && currentBoard.id === boardId) {
      setCurrentBoard(prevBoard => {
        if (!prevBoard) return null;
        
        return {
          ...prevBoard,
          cards: prevBoard.cards.map(card => 
            card.id === cardId
              ? { ...card, comments: [...card.comments, newComment] }
              : card
          ),
        };
      });
    }
  };

  const closeCard = (boardId: string, cardId: string) => {
    const board = boards.find(b => b.id === boardId);
    const card = board?.cards.find(c => c.id === cardId);
    
    if (!board || !card) return;
    
    // Check if card is in "Done" list
    const doneList = board.lists.find(l => l.name === "Done" && l.isDefault);
    if (!doneList || card.listId !== doneList.id) {
      toast({
        title: "Cannot Close Card",
        description: "Only cards in the 'Done' list can be closed.",
        variant: "destructive",
      });
      return;
    }
    
    setBoards(prevBoards => 
      prevBoards.map(b => {
        if (b.id !== boardId) return b;
        
        toast({
          title: "Card Closed",
          description: `Card "${card.title}" has been closed.`,
        });
        
        return {
          ...b,
          cards: b.cards.filter(c => c.id !== cardId),
        };
      })
    );
    
    // Update current board
    if (currentBoard && currentBoard.id === boardId) {
      setCurrentBoard(prevBoard => {
        if (!prevBoard) return null;
        
        return {
          ...prevBoard,
          cards: prevBoard.cards.filter(c => c.id !== cardId),
        };
      });
    }
  };

  const contextValue = {
    boards,
    currentBoard,
    currentUser,
    setCurrentBoard,
    createBoard,
    addMemberToBoard,
    addCardToList,
    moveCard,
    addActivityToCard,
    completeActivity,
    addCommentToCard,
    closeCard,
  };

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
};
