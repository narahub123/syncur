export type FeedMoreMenuAction =
  | {
      type: "hide";
      label: string;
      variant?: "default" | "destructive";
      onClick: () => void;
    }
  | {
      type: "subscription";
      label: string;
      variant?: "default" | "destructive";
      onClick: () => void;
    }
  | {
      type: "separator";
    }
  | {
      type: "bookmark";
      label: string;
      variant?: "default" | "destructive";
      onClick: () => void;
    };
