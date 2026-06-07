import { Dropdown } from "@/shared/components/ui/Dropdown";
import { MoreVertical } from "lucide-react";

const FeedItemMoreMenu = () => {
  const menu = [
    {
      id: "share",
      label: "공유하기",
    },
    {
      id: "hide",
      label: "숨기기",
    },
  ];
  return (
    <Dropdown.Root> 
      <Dropdown.Trigger className="rounded-full">
        <MoreVertical size={20} />
      </Dropdown.Trigger>
      <Dropdown.Content>
        {menu.map((item) => (
          <Dropdown.Item key={item.id}>{item.label}</Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
};

export default FeedItemMoreMenu;
