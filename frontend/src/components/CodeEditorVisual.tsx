import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useState } from "react"

export function CodeEditorVisual() {
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 2000)
  }

  const handleSubmit = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 2000)
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        {/* Prompt Section */}
        <div className="bg-editor-bg border border-editor-border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Prompt</span>
            <button 
              onClick={handleRun}
              className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary-light transition-colors"
            >
              Run
            </button>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 bg-primary/80 rounded-full w-3/4"></div>
            <div className="h-2 bg-warning/80 rounded-full w-full"></div>
            <div className="h-2 bg-success/80 rounded-full w-2/3"></div>
            <div className="h-2 bg-destructive/80 rounded-full w-5/6"></div>
            <div className="h-2 bg-primary-light/80 rounded-full w-1/2"></div>
            <div className="h-2 bg-warning/80 rounded-full w-4/5"></div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-editor-bg border border-editor-border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Input</span>
          </div>
          <div className="space-y-2">
            <div className="flex gap-1.5">
              <div className="h-3 bg-success/80 rounded w-8"></div>
              <div className="h-3 bg-primary/80 rounded w-12"></div>
              <div className="h-3 bg-warning/80 rounded w-10"></div>
              <div className="h-3 bg-destructive/80 rounded w-14"></div>
            </div>
            <div className="flex gap-1.5">
              <div className="h-3 bg-warning/80 rounded w-10"></div>
              <div className="h-3 bg-primary-light/80 rounded w-16"></div>
              <div className="h-3 bg-success/80 rounded w-12"></div>
            </div>
            <div className="flex gap-1.5">
              <div className="h-3 bg-primary/80 rounded w-6"></div>
              <div className="h-3 bg-destructive/80 rounded w-8"></div>
              <div className="h-3 bg-warning/80 rounded w-14"></div>
              <div className="h-3 bg-success/80 rounded w-10"></div>
            </div>
            <div className="flex gap-1.5">
              <div className="h-3 bg-success/80 rounded w-12"></div>
              <div className="h-3 bg-primary-light/80 rounded w-8"></div>
            </div>
          </div>
        </div>

        {/* Tests Section */}
        <div className="bg-editor-bg border border-editor-border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Tests</span>
          </div>
          <div className="space-y-2">
            <div className="flex gap-1.5">
              <div className="h-3 bg-warning/80 rounded w-6"></div>
              <div className="h-3 bg-primary/80 rounded w-8"></div>
              <div className="h-3 bg-success/80 rounded w-10"></div>
              <div className="h-3 bg-destructive/80 rounded w-12"></div>
            </div>
            <div className="flex gap-1.5">
              <div className="h-3 bg-primary-light/80 rounded w-12"></div>
              <div className="h-3 bg-warning/80 rounded w-8"></div>
              <div className="h-3 bg-success/80 rounded w-10"></div>
            </div>
            <div className="flex gap-1.5">
              <div className="h-3 bg-primary/80 rounded w-6"></div>
              <div className="h-3 bg-destructive/80 rounded w-8"></div>
              <div className="h-3 bg-warning/80 rounded w-12"></div>
              <div className="h-3 bg-primary-light/80 rounded w-10"></div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-editor-bg border border-editor-border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Output</span>
            <button 
              onClick={handleSubmit}
              className="px-3 py-1 bg-success text-success-foreground text-xs font-medium rounded hover:bg-success-light transition-colors"
            >
              Submit
            </button>
          </div>
          <div className="space-y-2.5">
            {isRunning ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                  <div className="h-2.5 bg-destructive/80 rounded-full flex-1"></div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                  <div className="h-2.5 bg-success/80 rounded-full flex-1"></div>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                  <div className="h-2.5 bg-destructive/80 rounded-full flex-1"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
