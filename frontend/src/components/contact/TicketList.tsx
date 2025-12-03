import { useState, useEffect } from "react";
import api from "@/api/axiosInstance";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import {
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { TicketDetail } from "./TicketDetail";

interface BackendTicketResponse {
  responderId: string;
  responderName: string;
  message: string;
  respondedAt: string;
}

interface BackendTicket {
  _id: string;
  subject: string;
  description: string;
  category: string;
  status: string; // "in progress"
  priority: string;
  createdAt: string;
  updatedAt: string;
  responses: BackendTicketResponse[];
}

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
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
  responses: TicketResponse[];
}

interface TicketListProps {
  onTicketCountChange?: (count: number) => void;
}

export function TicketList({ onTicketCountChange }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  // --------------------------
  // 🔥 Load Backend Tickets
  // --------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<BackendTicket[]>("/tickets/my", {
          withCredentials: true,
        });

        const mapped: Ticket[] = res.data.map((t) => ({
          id: t._id,
          subject: t.subject,
          description: t.description,
          category: t.category,
          priority: t.priority.toLowerCase() as Ticket["priority"],
          status: t.status.replace(" ", "_") as Ticket["status"], // "in progress" -> "in_progress"
          created_at: t.createdAt,
          updated_at: t.updatedAt,
          responses: t.responses.map((r) => ({
            id: r.respondedAt,
            message: r.message,
            responder_name: r.responderName,
            created_at: r.respondedAt,
            is_admin_response: true, // backend does not send userId, so assume admin replies
          })),
        }));

        setTickets(mapped);
        onTicketCountChange?.(mapped.length);
      } catch (error) {
        console.error("Failed to load tickets", error);
      }
    };

    load();
    // 🔇 prevent React exhaustive-deps warning (safe here)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------
  // 🔎 Filtering + Sorting
  // --------------------------
  useEffect(() => {
    let result = [...tickets];

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortBy === "priority") {
      const order = { high: 3, medium: 2, low: 1 };
      result.sort((a, b) => order[b.priority] - order[a.priority]);
    }

    setFilteredTickets(result);
  }, [tickets, statusFilter, sortBy]);

  // --------------------------
  // 🎨 Badges + Icons
  // --------------------------
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-primary/10 text-primary";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-200 text-gray-700";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "";
    }
  };

  // --------------------------
  // UI Rendering
  // --------------------------
  return (
    <div className="space-y-6">
      {/* FILTERS */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Sort</CardTitle>
          <CardDescription>Organize your support tickets</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* NO TICKETS */}
      {filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No tickets found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Collapsible
              key={ticket.id}
              open={expandedTicket === ticket.id}
              onOpenChange={(open) =>
                setExpandedTicket(open ? ticket.id : null)
              }
            >
              <Card className="hover:shadow-md transition-shadow">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1 capitalize">
                              {ticket.status.replace("_", " ")}
                            </span>
                          </Badge>

                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority.toUpperCase()}
                          </Badge>
                        </div>

                        <CardTitle className="text-lg">
                          {ticket.subject}
                        </CardTitle>

                        <CardDescription className="mt-1">
                          {new Date(ticket.created_at).toLocaleDateString()} •{" "}
                          {ticket.responses.length} response(s)
                        </CardDescription>
                      </div>

                      <Button variant="ghost" size="sm">
                        {expandedTicket === ticket.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent>
                    <TicketDetail ticket={ticket} />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
