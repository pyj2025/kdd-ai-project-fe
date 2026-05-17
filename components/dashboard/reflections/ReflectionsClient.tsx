"use client";

import { useState } from "react";
import FilterDialog, { Filters } from "@/components/dashboard/reflections/FilterDialog";
import Pagination from "@/components/dashboard/reflections/Pagination";
import ReflectionRow from "@/components/dashboard/ReflectionRow";

type TagVariant = "deviation" | "plan-aligned" | "manual";

type Reflection = {
  id: string;
  title: string;
  date: string;
  emotion: string;
  tag: TagVariant;
};

const PAGE_SIZE = 8;

function ReflectionsClient({ reflections }: { reflections: Reflection[] }) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({ tag: "all", emotion: "all" });

  const filtered = reflections.filter(r => {
    if (filters.tag !== "all" && r.tag !== filters.tag) return false;
    if (filters.emotion !== "all" && r.emotion !== filters.emotion) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (f: Filters) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <div className="flex flex-col h-full px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-5xl font-bold text-[#0d1f35] leading-tight">Recent Reflections</h1>
        <FilterDialog filters={filters} onApply={handleFilter} />
      </div>

      {/* Rows — grows to fill available space */}
      <div className="flex-1">
        {paginated.length === 0 ? (
          <p className="text-sm text-[#6b7280] py-10 text-center">No Reflections</p>
        ) : (
          paginated.map(item => (
            <ReflectionRow
              key={item.id}
              id={item.id}
              title={item.title}
              date={item.date}
              emotion={item.emotion}
              tag={item.tag}
            />
          ))
        )}
      </div>

      <div className="pt-4 min-h-[48px] flex justify-center items-center">
        {totalPages > 1 && <Pagination current={page} total={totalPages} onChange={setPage} />}
      </div>
    </div>
  );
}

export default ReflectionsClient;
