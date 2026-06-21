"use client";

import { CreateCategoryForm } from "./CreateCategoryForm";
import { CreateInterestForm } from "./CreateInterestForm";

const AdminInterestsClient = () => {
  return (
    <div>
      <CreateCategoryForm />
      <CreateInterestForm />
    </div>
  );
};

export default AdminInterestsClient;
