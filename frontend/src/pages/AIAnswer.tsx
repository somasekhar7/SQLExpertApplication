import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { getAIHelp, fetchQuestionBySlug, AIHelpResponse } from "@/api/sqlApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Bot, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface AIResponse {
  title: string;
  explanation: string;
  steps: string;
  sampleSQL: string;
  notes: string; //FIXED
}

const AIAnswer = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [ai, setAI] = useState<AIResponse | null>(null);

  // Fetch on mount
  useEffect(() => {
    (async () => {
      try {
        const res: AIHelpResponse = await getAIHelp(slug!);
        setAI(res as AIResponse); // <-- FIXES ERROR
      } catch (err) {
        toast.error("Failed to load AI explanation");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!ai) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-10 text-center text-muted-foreground">
          AI explanation unavailable.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 max-w-3xl">
        {/* Back Btn */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate(`/problem/${slug}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Problem
        </Button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">AI Explanation</h1>
        </div>

        {/* AI Card */}
        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{ai.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Explanation */}
            <section>
              <h2 className="text-lg font-semibold mb-2">📘 Explanation</h2>
              <p className="text-sm leading-6">{ai.explanation}</p>
            </section>

            {/* Steps */}
            <section>
              <h2 className="text-lg font-semibold mb-2">📝 Steps</h2>
              <pre className="bg-muted p-4 rounded text-sm whitespace-pre-wrap">
                {ai.steps}
              </pre>
            </section>

            {/* SQL Example */}
            <section>
              <h2 className="text-lg font-semibold mb-2">💻 Sample SQL</h2>
              <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                {ai.sampleSQL}
              </pre>
            </section>

            {/* Notes */}
            {ai.notes ? (
              <section>
                <h2 className="text-lg font-semibold mb-2">💡 Notes</h2>
                <p className="text-sm">{ai.notes}</p>
              </section>
            ) : null}

            {/* Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => navigate(`/problem/${slug}`)}
              >
                Back to Editor
              </Button>

              <Button
                className="bg-primary text-primary-foreground"
                onClick={() => navigate(`/problem/${slug}`)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Try the SQL in Editor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAnswer;
