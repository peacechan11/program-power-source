
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBoard } from "@/context/BoardContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ReportsPage() {
  const { boards } = useBoard();
  
  // Data preparation for charts
  const boardsData = boards.map(board => {
    const todoCards = board.cards.filter(card => 
      board.lists.find(list => list.id === card.listId && list.name === "To Do")
    ).length;
    
    const doingCards = board.cards.filter(card => 
      board.lists.find(list => list.id === card.listId && list.name === "Doing")
    ).length;
    
    const doneCards = board.cards.filter(card => 
      board.lists.find(list => list.id === card.listId && list.name === "Done")
    ).length;
    
    return {
      name: board.name,
      todo: todoCards,
      doing: doingCards,
      done: doneCards,
      total: todoCards + doingCards + doneCards
    };
  });
  
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Reports</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Boards</CardTitle>
              <CardDescription>Number of active boards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{boards.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Cards</CardTitle>
              <CardDescription>Across all boards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {boards.reduce((total, board) => total + board.cards.length, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completion Rate</CardTitle>
              <CardDescription>Tasks in "Done" status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {boards.length === 0 ? "0%" : 
                  Math.round(
                    (boards.reduce((total, board) => {
                      const doneList = board.lists.find(list => list.name === "Done");
                      return doneList 
                        ? total + board.cards.filter(card => card.listId === doneList.id).length
                        : total;
                    }, 0) / 
                    Math.max(1, boards.reduce((total, board) => total + board.cards.length, 0))) * 100
                  ) + "%"}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
            <CardDescription>Distribution of tasks across all boards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {boardsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={boardsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="todo" name="To Do" fill="#3498db" />
                    <Bar dataKey="doing" name="Doing" fill="#f39c12" />
                    <Bar dataKey="done" name="Done" fill="#2ecc71" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Closed Tasks Report</CardTitle>
            <CardDescription>Tasks that have been completed and closed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No closed tasks available yet
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
