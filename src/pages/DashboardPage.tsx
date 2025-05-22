
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBoard } from "@/context/BoardContext";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
  const { boards } = useBoard();
  const navigate = useNavigate();
  
  // Redirect to the first board if one exists
  useEffect(() => {
    if (boards.length === 1) {
      navigate(`/boards/${boards[0].id}`);
    }
  }, [boards, navigate]);
  
  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome to TaskFlow</h1>
          <p className="text-muted-foreground mt-2">
            Manage your tasks and collaborate with team members effectively
          </p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Boards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <Card key={board.id} className="animate-fade-in">
                <CardHeader className="pb-2">
                  <CardTitle>{board.name}</CardTitle>
                  <CardDescription>
                    {board.cards.length} tasks • {board.members.length} members
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex -space-x-2">
                    {board.members.slice(0, 3).map((member) => (
                      <div 
                        key={member.id} 
                        className="rounded-full h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground text-xs border-2 border-background"
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {board.members.length > 3 && (
                      <div className="rounded-full h-8 w-8 flex items-center justify-center bg-muted text-muted-foreground text-xs border-2 border-background">
                        +{board.members.length - 3}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => navigate(`/boards/${board.id}`)}
                  >
                    View Board
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground">Create New Board</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <Button 
                  variant="outline" 
                  className="text-muted-foreground border-dashed"
                  onClick={() => {
                    document.querySelector<HTMLButtonElement>('[data-create-board]')?.click();
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Board
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Your recent activity will appear here
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
