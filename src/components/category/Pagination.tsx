import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("ellipsis");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <section className="w-full px-6 py-8">
      <div className="flex justify-start items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-transparent hover:opacity-50 disabled:opacity-30 -ml-2" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            page === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="mx-2 text-sm font-light text-muted-foreground">...</span>
            ) : (
              <Button 
                key={page}
                variant="ghost" 
                size="sm" 
                className={`min-w-8 h-8 hover:bg-transparent hover:underline text-sm ${
                  currentPage === page ? "underline font-normal" : "font-light"
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            )
          ))}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-transparent hover:opacity-50 disabled:opacity-30"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default Pagination;
