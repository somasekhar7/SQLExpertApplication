import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, UserCog } from "lucide-react";

interface TicketResponse {
  id: string;
  message: string;
  is_admin_response: boolean;
  responder_name: string;
  created_at: string;
}

interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  responses: TicketResponse[];
}

interface TicketDetailProps {
  ticket: Ticket;
}

export function TicketDetail({ ticket }: TicketDetailProps) {
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      bug: "🐛 Bug Report",
      feature_request: "✨ Feature Request",
      technical_issue: "⚙️ Technical Issue",
      account: "👤 Account Issue",
      other: "💬 Other"
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">{getCategoryLabel(ticket.category)}</Badge>
        </div>
        <p className="text-foreground whitespace-pre-wrap">{ticket.description}</p>
      </div>

      {ticket.responses.length > 0 && (
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Response Timeline</h4>
          <div className="space-y-4">
            {ticket.responses.map((response) => (
              <Card 
                key={response.id} 
                className={response.is_admin_response ? "border-primary/50 bg-primary/5" : "bg-card"}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={response.is_admin_response ? "bg-primary text-primary-foreground" : "bg-muted"}>
                        {response.is_admin_response ? <UserCog className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">{response.responder_name}</span>
                          {response.is_admin_response && (
                            <Badge variant="secondary" className="text-xs">Admin</Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(response.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{response.message}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
