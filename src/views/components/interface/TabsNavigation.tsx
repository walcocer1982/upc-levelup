"use client";

import { useEffect, useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabsNavigationProps {
  tabs: Tab[];
  startupId?: string;
  defaultValue?: string;
  onTabChange?: (tab: string) => void;
}

export default function TabsNavigation({
  tabs,
  startupId,
  defaultValue,
  onTabChange,
}: TabsNavigationProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.id || "");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [listWidth, setListWidth] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Medir el contenedor y la lista para determinar si se necesitan controles
  useEffect(() => {
    const updateMeasurements = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const list = container.querySelector('[role="tablist"]');
        
        if (container && list) {
          const containerWidth = container.clientWidth;
          const listWidth = list.scrollWidth;
          
          setContainerWidth(containerWidth);
          setListWidth(listWidth);
          setShowControls(listWidth > containerWidth);
        }
      }
    };

    // Medir al montar y cuando cambia el tamaño
    updateMeasurements();
    
    const resizeObserver = new ResizeObserver(() => {
      updateMeasurements();
    });
    
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [tabs]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
    
    // Asegurar que el tab activo sea visible
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const activeTabElement = container.querySelector(`[data-state="active"]`);
        
        if (activeTabElement) {
          const tabRect = activeTabElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // Si el tab activo está fuera de la vista, centrarlo
          if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
            const centerPosition = tabRect.left - containerRect.left - containerRect.width / 2 + tabRect.width / 2;
            container.scrollTo({
              left: container.scrollLeft + centerPosition,
              behavior: "smooth"
            });
          }
        }
      }
    }, 100);
  };
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const newPosition = Math.max(0, scrollPosition - 150);
      container.scrollTo({
        left: newPosition,
        behavior: "smooth"
      });
      setScrollPosition(newPosition);
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newPosition = Math.min(maxScroll, scrollPosition + 150);
      container.scrollTo({
        left: newPosition,
        behavior: "smooth"
      });
      setScrollPosition(newPosition);
    }
  };

return (
  <div className="relative mx-2 sm:mx-0">
    {/* Botones de navegación */}
    {showControls && scrollPosition > 0 && (
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-background shadow-sm"
        onClick={scrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft size={16} />
      </Button>
    )}
    
    {/* Contenedor con scroll horizontal */}
    <div 
      ref={scrollContainerRef}
      className="overflow-x-auto scrollbar-hide pb-1"
      onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
    >
      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="h-9 bg-transparent">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="px-3 sm:px-4 h-9 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground whitespace-nowrap"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
      
      {showControls && scrollPosition < (listWidth - containerWidth - 10) && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-background shadow-sm"
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </Button>
      )}
      
    </div>
  );
}