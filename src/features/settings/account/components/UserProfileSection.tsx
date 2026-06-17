"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ProfileEditForm } from "./ProfileEditForm";
import { useState } from "react";
import { UserDto } from "@/features/users/dto/userDto";
import { Button } from "@/shared/components/ui/button";
import UserAvatar from "@/features/users/components/UserAvatar";

type Props = {
  user: UserDto;
};

const UserProfileSection = ({ user }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="border-b px-6 pb-6">
      <section className="overflow-hidden">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileEditForm
                user={user}
                onCancel={() => setIsEditing(false)}
              />
            </motion.div>
          ) : (
            <section className="flex w-full items-end">
              <div className="flex-1">
                <h2 className="mb-4 text-lg font-semibold">프로필 정보</h2>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    type="button"
                  >
                    <UserAvatar
                      src={user.image}
                      profileImage={user.profileImage}
                      className="h-20 w-20"
                    />
                  </button>
                  <div className="space-y-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.div
                    key="edit-button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button onClick={() => setIsEditing(true)}>수정하기</Button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </section>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default UserProfileSection;
