import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

import SiteSubscriptionTrigger from "./SiteSubscriptionTrigger";
import SiteSubscriptionForm from "@/features/subscriptions/components/SiteSubscriptionForm";

const SiteSubscriptionDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild className="hover:bg-accent">
        <SiteSubscriptionTrigger />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle></DialogTitle>
        <SiteSubscriptionForm />
      </DialogContent>
    </Dialog>
  );
};

export default SiteSubscriptionDialog;
