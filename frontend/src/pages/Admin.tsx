import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/hooks";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/axiosInstance";
import { useCallback } from "react";

import { Shield, User, Clock, MessageSquare, Send } from "lucide-react";

interface TicketResponse {
  id: string;
  message: string;
  is_admin_response: boolean;
  responder_name: string;
  created_at: string;
}

interface Ticket {
  _id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  subject: string;
  description: string;
  category: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
  responses: TicketResponse[];
}
interface BackendResponseTicket {
  _id: string;
  userId: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: string; // backend returns: "open", "in progress", etc.
  createdAt: string;
  updatedAt: string;
  responses: BackendTicketResponse[];
}

interface BackendTicketResponse {
  responderId: string;
  responderName: string;
  message: string;
  respondedAt: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // 🚨 ADMIN CHECK
  const checkAdminRole = useCallback(() => {
    try {
      if (user?.role !== "admin") {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page.",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      navigate("/");
    }
  }, [toast, user, navigate]);

  // 🔥 🚨 Add These Two useEffect Hooks
  useEffect(() => {
    checkAdminRole();
  }, [checkAdminRole]);

  // 📌 Fetch all tickets
  const fetchTickets = useCallback(async () => {
    try {
      const res = await api.get<BackendResponseTicket[]>("/tickets", {
        withCredentials: true,
      });

      const formatted: Ticket[] = res.data.map((t) => ({
        _id: t._id,
        user_id: t.userId,
        user_name: t.name,
        user_email: t.email,
        subject: t.subject,
        description: t.description,
        category: t.category,
        priority: t.priority,
        status: t.status.replace(" ", "_") as Ticket["status"],
        created_at: t.createdAt,
        updated_at: t.updatedAt,
        responses: t.responses.map((r) => ({
          id: r.respondedAt,
          message: r.message,
          responder_name: r.responderName,
          is_admin_response: r.responderId !== t.userId,
          created_at: r.respondedAt,
        })),
      }));

      setTickets(formatted);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tickets.",
      });
    }
  }, [toast]);
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchTickets();
    }
  }, [isAuthenticated, user?.role, fetchTickets]);

  // 📌 Submit response + update status
  const handleSubmitResponse = async () => {
    if (!selectedTicket || !responseMessage.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Response message cannot be empty.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1️⃣ Send admin response
      await api.post(
        `/tickets/${selectedTicket._id}/respond`,
        { message: responseMessage },
        { withCredentials: true }
      );

      // 2️⃣ Update ticket status (optional)
      if (newStatus) {
        await api.patch(
          `/tickets/${selectedTicket._id}/status`,
          { status: newStatus },
          { withCredentials: true }
        );
      }

      toast({
        title: "Success",
        description: "Response sent successfully!",
      });

      await fetchTickets();

      // Clear fields
      setSelectedTicket(null);
      setResponseMessage("");
      setNewStatus("");
    } catch (error) {
      console.error("Error submitting response:", error);

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit response.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      technical_issue: "⚙️ Technical Issue",
      feature_request: "✨ Feature Request",
      bug: "🐛 Bug Report",
      account: "👤 Account Issue",
      other: "💬 Other",
    };
    return labels[category] || category;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-200 text-yellow-900";
      case "in_progress":
        return "bg-blue-200 text-blue-900";
      case "resolved":
        return "bg-green-200 text-green-900";
      case "closed":
        return "bg-gray-300 text-gray-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-200 text-red-900";
      case "medium":
        return "bg-yellow-200 text-yellow-800";
      case "low":
        return "bg-green-200 text-green-900";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const filteredTickets = tickets.filter(
    (t) => filterStatus === "all" || t.status === filterStatus
  );

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter(
      (t) => t.status === "resolved" || t.status === "closed"
    ).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Manage user support tickets</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="text-lg font-medium">Total Tickets</div>
              <div className="text-3xl font-bold">{ticketStats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-lg font-medium">Open</div>
              <div className="text-3xl font-bold text-yellow-600">
                {ticketStats.open}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-lg font-medium">In Progress</div>
              <div className="text-3xl font-bold text-blue-600">
                {ticketStats.in_progress}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-lg font-medium">Resolved</div>
              <div className="text-3xl font-bold text-green-600">
                {ticketStats.resolved}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT — Ticket List */}
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>
                Select a ticket to view or respond
              </CardDescription>
              <div className="pt-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
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
              </div>
            </CardHeader>

            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredTickets.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tickets found
                </p>
              ) : (
                filteredTickets.map((ticket) => (
                  <Card
                    key={ticket._id}
                    className={`cursor-pointer ${
                      selectedTicket?._id === ticket._id
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace("_", " ")}
                        </Badge>
                      </div>

                      <div className="mt-1 text-sm text-muted-foreground">
                        <User className="inline-block w-3 h-3 mr-1" />
                        {ticket.user_name} •{" "}
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </div>

                      <div className="mt-2 flex gap-2">
                        <Badge>{getCategoryLabel(ticket.category)}</Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* RIGHT — Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details & Response</CardTitle>
              <CardDescription>
                {selectedTicket
                  ? "View ticket and reply to user"
                  : "Select a ticket to continue"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!selectedTicket ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  Select a ticket to view details
                </div>
              ) : (
                <Tabs defaultValue="details">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="respond">Respond</TabsTrigger>
                  </TabsList>

                  {/* DETAILS TAB */}
                  <TabsContent value="details">
                    <div className="mt-4 space-y-4">
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Subject</h3>
                        <p>{selectedTicket.subject}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm mb-1">
                          Description
                        </h3>
                        <p className="whitespace-pre-line">
                          {selectedTicket.description}
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <div>
                          <h3 className="font-semibold text-sm mb-1">User</h3>
                          <p>{selectedTicket.user_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedTicket.user_email}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-sm mb-1">
                            Category
                          </h3>
                          <Badge>
                            {getCategoryLabel(selectedTicket.category)}
                          </Badge>
                        </div>
                      </div>

                      {/* Response History */}
                      {selectedTicket.responses.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-semibold mb-3">
                            Response History
                          </h3>
                          <div className="space-y-3 max-h-[300px] overflow-y-auto">
                            {selectedTicket.responses.map((r) => (
                              <Card
                                key={r.id}
                                className={
                                  r.is_admin_response
                                    ? "border-primary bg-primary/5"
                                    : "bg-card"
                                }
                              >
                                <CardContent className="p-3">
                                  <div className="flex gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback
                                        className={
                                          r.is_admin_response
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                        }
                                      >
                                        <User className="h-3 w-3" />
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="flex justify-between">
                                        <span className="font-medium text-sm">
                                          {r.responder_name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(
                                            r.created_at
                                          ).toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="text-sm whitespace-pre-wrap mt-1">
                                        {r.message}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* RESPOND TAB */}
                  <TabsContent value="respond">
                    <div className="mt-4 space-y-4">
                      {/* Update status */}
                      <div>
                        <label className="font-semibold text-sm block mb-2">
                          Update Status
                        </label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={`Current: ${selectedTicket.status}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="font-semibold text-sm block mb-2">
                          Response Message
                        </label>
                        <Textarea
                          placeholder="Type your response..."
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                          className="min-h-[200px]"
                        />
                      </div>

                      <Button
                        onClick={handleSubmitResponse}
                        disabled={isSubmitting || !responseMessage.trim()}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        {isSubmitting ? "Sending..." : "Send Response"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
