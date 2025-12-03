import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatbotAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your SQL learning assistant. How can I help you today? I can answer questions about SQL syntax, best practices, and common issues.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Integrate with actual LLM API (OpenAI, Anthropic, etc.)
    // For now, simulate response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSimulatedResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const getSimulatedResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('join')) {
      return 'SQL JOINs are used to combine rows from two or more tables. The most common types are:\n\n• INNER JOIN: Returns matching records from both tables\n• LEFT JOIN: Returns all records from left table and matched records from right\n• RIGHT JOIN: Returns all records from right table and matched records from left\n• FULL JOIN: Returns all records when there\'s a match in either table\n\nWould you like a specific example?';
    }
    
    if (lowerQuery.includes('syntax') || lowerQuery.includes('error')) {
      return 'Common SQL syntax errors include:\n\n• Missing semicolons\n• Incorrect table/column names\n• Missing quotes around string values\n• Incorrect JOIN syntax\n\nCan you share the specific error message you\'re seeing?';
    }
    
    if (lowerQuery.includes('select')) {
      return 'The SELECT statement is used to query data from a database. Basic syntax:\n\nSELECT column1, column2 FROM table_name WHERE condition;\n\nYou can also use:\n• SELECT * to get all columns\n• WHERE to filter results\n• ORDER BY to sort results\n• LIMIT to restrict number of rows\n\nWhat specific aspect would you like to learn about?';
    }

    return 'I\'m here to help with SQL questions! You can ask me about:\n\n• SQL syntax and commands\n• Query optimization\n• JOINs and relationships\n• Common errors and solutions\n• Best practices\n\nOr feel free to submit a detailed ticket for more complex issues.';
  };

  return (
    <div className="flex flex-col h-[400px] border border-border rounded-lg bg-card">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <Card className={`max-w-[80%] p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </Card>

              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-3 bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-primary hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
