import { useState } from "react";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/contact/ContactForm";
import { TicketList } from "@/components/contact/TicketList";
import { ChatbotAssistant } from "@/components/contact/ChatbotAssistant";
import { MessageSquare, ListChecks } from "lucide-react";
import { useAppSelector } from "@/hooks";

export default function Contact() {
  const [activeTab, setActiveTab] = useState("submit");
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [ticketCount, setTicketCount] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Contact & Support Center
          </h1>
          <p className="text-muted-foreground">
            Get help with your SQL learning journey. We're here to assist you!
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="submit" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Submit Issue
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              My Issues
              {ticketCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {ticketCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="space-y-6">
            <Card className="shadow-lg border-border/50">
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
                <CardDescription>
                  Describe the issue you're facing and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm onSuccess={() => setActiveTab("tickets")} />
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Help Assistant</CardTitle>
                <CardDescription>
                  Try our AI assistant for instant answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatbotAssistant />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            {isAuthenticated ? (
              <TicketList onTicketCountChange={setTicketCount} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Sign In Required</CardTitle>
                  <CardDescription>
                    Please sign in to view your support tickets.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
