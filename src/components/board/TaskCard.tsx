
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useBoard } from "@/context/BoardContext";
import { TaskCard as TaskCardType, Activity } from "@/types";
import { 
  CheckSquare, 
  MessageSquare, 
  MoreHorizontal, 
  PaperclipIcon, 
  X,
  Clock,
  CheckCircle2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface TaskCardProps {
  card: TaskCardType;
  boardId: string;
  index: number;
}

export function TaskCard({ card, boardId, index }: TaskCardProps) {
  const { completeActivity, addActivityToCard, addCommentToCard, closeCard, currentBoard } = useBoard();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newActivity, setNewActivity] = useState("");
  const [newComment, setNewComment] = useState("");

  // Check if card is in the "Done" list to determine if it can be closed
  const isDoneList = currentBoard?.lists.find(list => list.id === card.listId)?.name === "Done";

  const handleAddActivity = () => {
    if (!newActivity.trim()) return;
    
    addActivityToCard(boardId, card.id, {
      title: newActivity,
      isCompleted: false,
    });
    
    setNewActivity("");
  };

  const handleCompleteActivity = (activityId: string) => {
    completeActivity(boardId, card.id, activityId);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    addCommentToCard(boardId, card.id, newComment);
    setNewComment("");
  };

  const handleCloseCard = () => {
    closeCard(boardId, card.id);
    setIsDialogOpen(false);
  };

  // Calculate activity completion percentage
  const completedActivities = card.activities.filter(a => a.isCompleted).length;
  const totalActivities = card.activities.length;
  const completionPercentage = totalActivities ? Math.round((completedActivities / totalActivities) * 100) : 0;

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`task-card bg-card rounded-md p-3 mb-2 border border-border shadow-sm cursor-pointer transition-transform ${
              snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
            }`}
            onClick={() => setIsDialogOpen(true)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-card-foreground">{card.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isDoneList && (
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseCard();
                      }}
                    >
                      Close Card
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {card.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{card.description}</p>
            )}
            
            {totalActivities > 0 && (
              <div className="flex items-center text-xs text-muted-foreground mb-2">
                <CheckSquare className="h-3 w-3 mr-1" />
                <span>
                  {completedActivities}/{totalActivities} ({completionPercentage}%)
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-3">
              <div className="flex space-x-2">
                {card.comments.length > 0 && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>{card.comments.length}</span>
                  </div>
                )}
                
                {card.attachments.length > 0 && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <PaperclipIcon className="h-3 w-3 mr-1" />
                    <span>{card.attachments.length}</span>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {format(new Date(card.createdAt), 'MMM d')}
              </div>
            </div>
          </div>
        )}
      </Draggable>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{card.title}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-hidden">
            <ScrollArea className="h-full pr-4">
              {card.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Activities</h3>
                  {totalActivities > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {completionPercentage}% complete
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 mb-3">
                  {card.activities.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start space-x-2 activity-item group"
                    >
                      <Checkbox 
                        id={activity.id} 
                        checked={activity.isCompleted} 
                        onCheckedChange={() => !activity.isCompleted && handleCompleteActivity(activity.id)}
                      />
                      <label 
                        htmlFor={activity.id}
                        className={`text-sm flex-1 ${activity.isCompleted ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {activity.title}
                      </label>
                      <button 
                        className="opacity-0 activity-delete text-muted-foreground hover:text-destructive"
                        onClick={() => {/* Delete functionality would go here */}}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Input
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    placeholder="Add a new activity..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddActivity();
                      }
                    }}
                  />
                  <Button onClick={handleAddActivity} size="sm">Add</Button>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Comments</h3>
                <div className="space-y-3 mb-3">
                  {card.comments.map((comment) => (
                    <div key={comment.id} className="bg-muted/50 rounded-md p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{comment.authorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                  
                  {card.comments.length === 0 && (
                    <div className="text-center py-3 text-muted-foreground text-sm">
                      No comments yet
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment();
                      }
                    }}
                  />
                  <Button onClick={handleAddComment} size="sm">Comment</Button>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Created on {format(new Date(card.createdAt), 'MMMM d, yyyy')}
              </div>
            </ScrollArea>
          </div>
          
          <DialogFooter>
            {isDoneList && (
              <Button 
                variant="destructive" 
                onClick={handleCloseCard}
                className="mr-auto"
              >
                Close Card
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
