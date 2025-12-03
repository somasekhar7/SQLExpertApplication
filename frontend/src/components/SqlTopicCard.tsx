// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Clock, Trophy } from "lucide-react";

// interface SqlTopicCardProps {
//   title: string;
//   description: string;
//   problemCount: number;
//   difficulty: "Easy" | "Medium" | "Hard";
//   estimatedTime: string;
//   icon: React.ReactNode;
//   completed?: number;
//   concepts: string;
//   onStartLearning?: () => void;
// }

// export function SqlTopicCard({
//   title,
//   description,
//   problemCount,
//   difficulty,
//   estimatedTime,
//   icon,
//   completed = 0,
//   concepts,
//   onStartLearning,
// }: SqlTopicCardProps) {
//   const progress = (completed / problemCount) * 100;

//   const difficultyColors = {
//     Easy: "bg-success text-success-foreground",
//     Medium: "bg-warning text-warning-foreground",
//     Hard: "bg-destructive text-destructive-foreground",
//   };

//   const handleStartLearning = () => {
//     if (onStartLearning) {
//       onStartLearning();
//     }
//   };

//   return (
//     <Card className="group hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 hover:shadow-primary/30 bg-gradient-to-br from-card via-card/95 to-card/90 border-2 border-border/30 hover:border-primary/50 relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//       <div className="absolute -inset-1 bg-gradient-to-r from-primary to-success opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>

//       <CardHeader className="space-y-4 relative">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-primary/50">
//               {icon}
//             </div>
//             <div>
//               <CardTitle className="text-lg font-semibold">{title}</CardTitle>
//               <p className="text-sm text-muted-foreground">
//                 {problemCount} problems
//               </p>
//             </div>
//           </div>
//           <Badge className={`${difficultyColors[difficulty]} text-xs`}>
//             {difficulty}
//           </Badge>
//         </div>

//         <p className="text-sm text-muted-foreground leading-relaxed">
//           {description}
//         </p>

//         <div className="bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 rounded-lg p-3 border border-primary/10 group-hover:border-primary/30 transition-colors duration-300">
//           <p className="text-xs font-medium text-foreground/80">
//             Concepts:{" "}
//             <span className="text-primary group-hover:text-primary-light transition-colors duration-300">
//               {concepts}
//             </span>
//           </p>
//         </div>

//         <div className="flex items-center justify-between text-sm">
//           <div className="flex items-center space-x-1 text-muted-foreground">
//             <Clock className="h-4 w-4" />
//             <span>{estimatedTime}</span>
//           </div>
//           <div className="flex items-center space-x-1 text-success">
//             <Trophy className="h-4 w-4" />
//             <span>
//               {completed}/{problemCount}
//             </span>
//           </div>
//         </div>

//         {progress > 0 && (
//           <div className="space-y-2">
//             <div className="w-full bg-muted rounded-full h-2 overflow-hidden relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-success/20 to-transparent animate-pulse"></div>
//               <div
//                 className="bg-gradient-to-r from-success to-primary h-2 rounded-full transition-all duration-500 relative z-10 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//             <p className="text-xs text-success font-medium group-hover:text-primary transition-colors duration-300">
//               {Math.round(progress)}% Complete
//             </p>
//           </div>
//         )}
//       </CardHeader>

//       <CardContent className="pt-0 relative">
//         <Button
//           className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-primary-foreground transition-all duration-500 font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(77,144,254,0.6)] border-0 group-hover:scale-105"
//           onClick={handleStartLearning}
//         >
//           Start Learning
//           <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Trophy } from "lucide-react";

interface SqlTopicCardProps {
  title: string;
  description: string;
  problemCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  icon: React.ReactNode;
  completed?: number;
  concepts: string;
  onStartLearning?: () => void;
}

export function SqlTopicCard({
  title,
  description,
  problemCount,
  difficulty,
  estimatedTime,
  icon,
  completed = 0,
  concepts,
  onStartLearning,
}: SqlTopicCardProps) {
  const progress = (completed / problemCount) * 100;

  const difficultyColors = {
    Easy: "bg-success text-success-foreground",
    Medium: "bg-warning text-warning-foreground",
    Hard: "bg-destructive text-destructive-foreground",
  };

  const handleStartLearning = () => {
    if (onStartLearning) {
      onStartLearning(); // 🔥 fixed — DO NOT WRAP OR PASS PARAMS
    }
  };

  return (
    <Card className="group hover:scale-[1.02] transition-all duration-500">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {problemCount} problems
              </p>
            </div>
          </div>
          <Badge className={`${difficultyColors[difficulty]} text-xs`}>
            {difficulty}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="rounded-lg p-3 bg-muted/50">
          <p className="text-xs text-foreground/80">
            Concepts: <span className="text-primary">{concepts}</span>
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1 text-success">
            <Trophy className="h-4 w-4" />
            <span>
              {completed}/{problemCount}
            </span>
          </div>
        </div>

        {progress > 0 && (
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-success">
              {Math.round(progress)}% Complete
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <Button className="w-full" onClick={handleStartLearning}>
          Start Learning
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
