import { Avatar } from "@/shared/components/common/Avartar";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton"; // 설치하신 스켈레톤 컴포넌트 경로
import { UserDto } from "@/features/users/dto/userDto";

type Props = {
  user?: UserDto;
  isLoading?: boolean;
  onEdit: () => void;
};

export const UserProfileView = ({ user, isLoading, onEdit }: Props) => {
  if (isLoading || !user) {
    return (
      <section className="flex w-full items-end gap-4">
        <div className="flex-1">
          <Skeleton className="mb-4 h-6 w-24" /> {/* 제목 영역 */}
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full" /> {/* 아바타 영역 */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" /> {/* 이름 영역 */}
              <Skeleton className="h-4 w-48" /> {/* 이메일 영역 */}
            </div>
          </div>
        </div>
        <Skeleton className="h-9 w-20" /> {/* 버튼 영역 */}
      </section>
    );
  }

  return (
    <section className="flex w-full items-end gap-4">
      <div className="flex-1">
        <h2 className="mb-4 text-lg font-semibold">프로필 정보</h2>
        <div className="flex items-center gap-6">
          <button onClick={onEdit} type="button">
            <Avatar
              src={user.profileImage?.url || user.image}
              name={user.name}
              className="h-20 w-20"
            />
          </button>
          <div className="space-y-1">
            <p className="px-1 font-medium">{user.name}</p>
            <p className="px-1 text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>
      <Button onClick={onEdit}>수정하기</Button>
    </section>
  );
};
