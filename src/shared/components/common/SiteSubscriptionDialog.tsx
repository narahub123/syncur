"use client";

import { Dialog } from "@base-ui/react";
import SiteSubscriptionTrigger from "./SiteSubscriptionTrigger";
import SiteSubscriptionForm from "@/features/subscriptions/components/SiteSubscriptionForm";

const SiteSubscriptionDialog = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        render={<SiteSubscriptionTrigger />}
        nativeButton={false}
      />

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/50" />
        <Dialog.Popup className="bg-background text-foreground border-border fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border p-6 shadow-xl outline-none">
          <SiteSubscriptionForm />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SiteSubscriptionDialog;
