import React from "react";
// https://tailwindui.com/components/application-ui/navigation/pagination

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const generatePageNumbers = () => {
    const pages = [];
    pages.push(1); // Always show the first page

    if (page > 3) {
      pages.push("..."); // Ellipsis for skipped pages
    }

    // Show pages near the current page
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("..."); // Ellipsis for skipped pages
    }

    if (totalPages > 1) {
      pages.push(totalPages); // Always show the last page
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-between  px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 disabled:opacity-50 ${
            page === 1 ? "" : "hover:bg-gray-600"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 disabled:opacity-50 ${
            page === totalPages || totalPages === 0 ? "" : "hover:bg-gray-600"
          }`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-300">
            Showing{" "}
            {/* <span className="font-medium">{Math.min(totalItems, 1)}</span> to{" "} */}
            <span className="font-medium">{page * itemsPerPage - itemsPerPage + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(page * itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> result(s)
          </p>
        </div>
        <nav
          aria-label="Pagination"
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        >
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 disabled:opacity-50 ${
              page === 1 ? "" : "hover:bg-gray-600"
            }`}
          >
            Previous
          </button>
          {pageNumbers.map((pageNum, index) =>
            typeof pageNum === "number" ? (
              <button
                key={index}
                onClick={() => onPageChange(pageNum)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  pageNum === page
                    ? "bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    : "text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-600 focus:z-20 focus:outline-offset-0"
                }`}
              >
                {pageNum}
              </button>
            ) : (
              <span
                key={index}
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-200 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
              >
                {pageNum}
              </span>
            )
          )}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 disabled:opacity-50 ${
              page === totalPages || totalPages === 0 ? "" : "hover:bg-gray-600"
            }`}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
