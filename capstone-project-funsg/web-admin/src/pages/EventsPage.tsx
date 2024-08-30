import { useEffect, useState } from "react";
import useCategories, { Category } from "../hooks/useCategory.ts";
import CategoryList from "../components/CategoryList.tsx";
import { Heading } from "../components/catalystui/heading.tsx";
import GroupDropdown from "../components/GroupDropdown.tsx";
import EventsTable from "../components/EventsTable.tsx";
import { Group } from "../hooks/useGroups.ts";
import useCategorisedGroups from "../hooks/useCategorisedGroups.ts";
import useEvents, { Event } from "../hooks/useEvents.ts";
import { Button } from "../components/catalystui/button.tsx";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "../components/catalystui/pagination.tsx";

const EventsPage = () => {
  const pageSize = 15;
  const [page, setPage] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<Event[] | null>(null);

  // Fetch categories, groups, and events data
  const { data: categories } = useCategories();
  const { data: groups } = useCategorisedGroups(selectedCategory?.id ?? 0);
  const {
    data: paginatedEvents,
    error,
    isLoading,
    deleteEvent,
    reOpenEvent,
    updateAllEventsStatus,
  } = useEvents({ page, pageSize, selectedCategoryId });

  // Handle category selection
  const handleSelectCategory = (category: Category | null) => {
    setSelectedCategory(category);
    setSelectedCategoryId(category?.id);
    setSelectedGroup(null); // Reset group selection when a new category is selected
  };

  // Filter events based on selected category and group
  useEffect(() => {
    if (!paginatedEvents?.events) return;

    let filtered = paginatedEvents.events;

    if (selectedCategory) {
      const categoryGroups = groups;

      filtered = filtered?.filter((event) =>
        categoryGroups?.some((group) => group.id === event.groupId),
      );
    }

    if (selectedGroup) {
      filtered = filtered?.filter(
        (event) => event.groupId === selectedGroup.id,
      );
    }

    setFilteredEvents(filtered || null);
  }, [selectedCategory, selectedGroup, paginatedEvents, groups]);

  // Handle loading and error states
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <div className="flex flex-row">
        <div className="flex flex-col w-1/4 mt-4">
          <CategoryList
            categories={categories || []}
            onSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
          />
        </div>

        <div className="flex flex-col w-3/4">
          <Heading>
            <p className="text-4xl mb-8">Event Details</p>
          </Heading>
          <div className="flex justify-between mb-4">
            <div className="mb-4 w-48">
              <GroupDropdown
                groups={
                  groups?.filter(
                    (group) => group.categoryId === selectedCategory?.id,
                  ) || []
                }
                onSelectGroup={setSelectedGroup}
                selectedGroup={selectedGroup}
              />
            </div>
            <div>
              <Button className="w-44" outline onClick={updateAllEventsStatus}>
                Update Event Status
              </Button>
            </div>
          </div>
          <EventsTable
            handleCancel={deleteEvent}
            handleReopen={reOpenEvent}
            filteredEvents={filteredEvents || []}
          />
        </div>
      </div>
      <Pagination className="flex justify-between mt-2">
        <PaginationPrevious
          href={page > 1 ? `?page=${page - 1}` : null}
          onClick={() => setPage(page - 1)}
        />
        <PaginationNext
          href={
            page < (paginatedEvents?.totalPages ?? 1)
              ? `?page=${page + 1}`
              : null
          }
          onClick={() => setPage(page + 1)}
          disabled={page >= (paginatedEvents?.totalPages ?? 1)}
        />
      </Pagination>
    </>
  );
};

export default EventsPage;
