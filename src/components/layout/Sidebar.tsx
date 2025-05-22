
import React from "react";
import { Link } from "react-router-dom";
import { useBoard } from "@/context/BoardContext";
import { 
  LayoutDashboard, 
  ListTodo, 
  PlusCircle, 
  Settings,
  FileBarChart
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Sidebar() {
  const { boards, createBoard } = useBoard();
  const { toast } = useToast();
  const [newBoardName, setNewBoardName] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) {
      toast({
        variant: "destructive",
        title: "Board name required",
        description: "Please enter a name for your new board.",
      });
      return;
    }
    
    createBoard(newBoardName);
    setNewBoardName("");
    setIsDialogOpen(false);
  };

  return (
    <div className="h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <ListTodo className="h-6 w-6" />
          <h1 className="text-xl font-bold">TaskFlow</h1>
        </div>

        <nav className="space-y-1">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
        </nav>

        <Separator className="my-4 bg-sidebar-border" />

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-sidebar-foreground/70">BOARDS</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                <PlusCircle className="h-4 w-4 text-sidebar-foreground/70" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Board</DialogTitle>
                <DialogDescription>
                  Add a name for your new board to get started.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="board-name">Board name</Label>
                <Input 
                  id="board-name" 
                  value={newBoardName} 
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="e.g., Marketing Campaign"
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateBoard}>Create Board</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
          {boards.map((board) => (
            <Link to={`/boards/${board.id}`} key={board.id}>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
              >
                <span className="truncate">{board.name}</span>
              </Button>
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <Link to="/reports">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent">
              <FileBarChart className="mr-2 h-5 w-5" />
              Reports
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
