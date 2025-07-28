import { Switch, Route } from "wouter";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import CalendarPage from "@/pages/calendar";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CalendarPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    // Drag end logic will be handled in calendar components
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Toaster />
            <Router />
            <DragOverlay>
              {activeId ? (
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded opacity-75">
                  Dragging event...
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );

}

export default App;
