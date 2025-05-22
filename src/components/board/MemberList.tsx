
import { Member } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MemberListProps {
  members: Member[];
}

export function MemberList({ members }: MemberListProps) {
  // Only show up to 5 members, then show a +X more indicator
  const visibleMembers = members.slice(0, 5);
  const hiddenCount = Math.max(0, members.length - 5);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex -space-x-2 mb-6">
      <TooltipProvider>
        {visibleMembers.map((member) => (
          <Tooltip key={member.id}>
            <TooltipTrigger asChild>
              <div className="cursor-pointer">
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.email}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {hiddenCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-muted-foreground text-xs border-2 border-background cursor-pointer">
                +{hiddenCount}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{hiddenCount} more member{hiddenCount !== 1 ? 's' : ''}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}
