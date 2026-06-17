"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProfileEditForm } from "./ProfileEditForm";
import { UserDto } from "@/features/users/dto/userDto";
import { UserProfileView } from "./UserProfileView";

type Props = {
  user: UserDto;
  isLoading: boolean;
};

const UserProfile = ({ user, isLoading }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="overflow-hidden">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit-form"
            // y축 이동을 제거하고 opacity(fade)만 적용
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ProfileEditForm user={user} onCancel={() => setIsEditing(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="view-form"
            // y축 이동을 제거하고 opacity(fade)만 적용
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <UserProfileView
              user={user}
              isLoading={isLoading} // 여기서 로딩 상태 전달
              onEdit={() => setIsEditing(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
