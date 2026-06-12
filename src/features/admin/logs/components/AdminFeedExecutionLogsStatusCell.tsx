import {
  FEED_EXECUTION_STATUS_KR,
  FeedExecutionStatus,
} from "@/features/feed-execution-logs/constants/feed-execution-log";

type Props = { status: FeedExecutionStatus };

const AdminFeedExecutionLogsStatusCell = ({ status }: Props) => {
  return (
    <span>
      {FEED_EXECUTION_STATUS_KR[status.toLowerCase() as FeedExecutionStatus]}
    </span>
  );
};

export default AdminFeedExecutionLogsStatusCell;
