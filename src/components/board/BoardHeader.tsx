
import { useState } from "react";
import { useBoard } from "@/context/BoardContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";

interface BoardHeaderProps {
  boardId: string;
  boardName: string;
}

export function BoardHeader({ boardId, boardName }: BoardHeaderProps) {
  const { addMemberToBoard } = useBoard();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddMember = () => {
    if (!newMemberEmail.trim()) return;
    
    addMemberToBoard(boardId, newMemberEmail);
    setNewMemberEmail("");
    setIsDialogOpen(false);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{boardName}</h1>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-1" />
            Add Member
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Board Member</DialogTitle>
            <DialogDescription>
              Invite someone to collaborate on this board. They will receive an email invitation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Email address"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="mb-2"
              type="email"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember}>Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
