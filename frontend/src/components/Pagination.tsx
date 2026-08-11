/**
 * Pagination — Page navigation with prev/next
 *
 * Matches Stitch: "Hiển thị X đến Y trong số Z kết quả" + page numbers
 */

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers to display
  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-between px-md py-sm">
      <span className="text-body-sm text-neutral-text-secondary">
        Hiển thị <strong>{startItem}</strong> đến <strong>{endItem}</strong> trong số{' '}
        <strong>{totalItems}</strong> kết quả
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded border border-neutral-border text-body-sm text-neutral-text-secondary hover:bg-neutral-surface disabled:opacity-50"
        >
          &lt;
        </button>
        {pages.map((page, idx) =>
          page === '...' ? (
            <span key={`dots-${idx}`} className="px-1 text-body-sm text-neutral-text-muted">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-8 w-8 items-center justify-center rounded border text-body-sm font-medium transition-colors ${
                page === currentPage
                  ? 'border-primary bg-primary text-white'
                  : 'border-neutral-border text-neutral-text-secondary hover:bg-neutral-surface'
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded border border-neutral-border text-body-sm text-neutral-text-secondary hover:bg-neutral-surface disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  )
}
