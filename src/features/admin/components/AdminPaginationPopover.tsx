import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

const AdminPaginationPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="페이지로 이동"
          title="페이지로 이동"
          className="text-muted-foreground px-2 hover:text-black"
        >
          ...
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-40">
        <div className="flex gap-2">
          <input
            type="number"
            className="w-20 border px-2 py-1"
            placeholder="페이지"
          />

          <button className="border px-2 py-1">이동</button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminPaginationPopover;
