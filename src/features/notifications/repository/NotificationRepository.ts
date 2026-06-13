import { Types } from "mongoose";
import {
  NotificationLean,
  NotificationWithSiteAndFeedExecutionLogLean,
  NotificationWithSiteAndFeedExecutionLogLeanPagedResponse,
} from "../types/notification-leans";
import { CreateNotificationDto } from "../types";
import { NotificationModel } from "../model/notification";
import { AdminNotificationsQuery } from "@/features/admin/notifiactions/types";
import { toObjectId } from "@/shared/utils/toObjectId";

/**
 * Notification Repository
 *
 * Notification 컬렉션 접근 담당
 */
export class NotificationRepository {
  /**
   * 알림 생성
   */
  async create(dto: CreateNotificationDto): Promise<NotificationLean> {
    const notification = await NotificationModel.create(dto);

    return notification.toObject();
  }

  /**
   * 단일 알림 조회
   */
  async findById(id: Types.ObjectId): Promise<NotificationLean | null> {
    return NotificationModel.findById(id).lean();
  }

  /**
   * 사용자 알림 목록 조회
   *
   * 최신순 정렬
   */
  async findByUserId(
    userId: Types.ObjectId,
    limit = 20,
  ): Promise<NotificationLean[]> {
    return NotificationModel.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * 사용자 읽지 않은 알림 목록 조회
   */
  async findUnreadByUserId(
    userId: Types.ObjectId,
    limit = 20,
  ): Promise<NotificationLean[]> {
    return NotificationModel.find({
      userId,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * 읽지 않은 알림 개수 조회
   */
  async countUnreadByUserId(userId: Types.ObjectId): Promise<number> {
    return NotificationModel.countDocuments({
      userId,
      isRead: false,
    });
  }

  /**
   * 알림 읽음 처리
   */
  async markAsRead(
    id: Types.ObjectId | string,
    userId: Types.ObjectId | string,
  ): Promise<NotificationLean | null> {
    return NotificationModel.findByIdAndUpdate(
      { _id: toObjectId(id), userId: toObjectId(userId) },
      {
        $set: { isRead: true },
      },
      {
        returnDocument: "after",
      },
    ).lean();
  }

  /**
   * 사용자 전체 알림 읽음 처리
   */
  async markAllAsRead(userId: Types.ObjectId | string): Promise<number> {
    const result = await NotificationModel.updateMany(
      {
        userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      },
    );

    return result.modifiedCount;
  }

  /**
   * 알림 삭제
   */
  async deleteById(id: Types.ObjectId): Promise<boolean> {
    const result = await NotificationModel.deleteOne({
      _id: id,
    });

    return result.deletedCount > 0;
  }

  /**
   * 관리자 알림 목록 조회
   *
   * 페이지네이션 + 검색 + 정렬
   */
  /**
   * 관리자 알림 목록 조회
   *
   * 페이지네이션 + 검색 + 정렬
   */
  async findAllPaginated(
    params: AdminNotificationsQuery,
  ): Promise<NotificationWithSiteAndFeedExecutionLogLeanPagedResponse> {
    const {
      page,
      limit,
      search,
      searchField = "title",
      sort = "createdAt",
      sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;

    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    const sortMap = {
      title: { title: mongoOrder },
      type: { type: mongoOrder },
      isRead: { isRead: mongoOrder },
      createdAt: { createdAt: mongoOrder },
    } as const;

    const matchStage =
      search && search.trim().length > 0
        ? {
            [searchField]: {
              $regex: search,
              $options: "i",
            },
          }
        : {};

    /**
     * Site + FeedExecutionLog JOIN
     */
    const basePipeline = [
      {
        $lookup: {
          from: "sites",
          localField: "metadata.siteId",
          foreignField: "_id",
          as: "site",
        },
      },
      {
        $unwind: {
          path: "$site",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "feedexecutionlogs",
          localField: "metadata.feedExecutionLogId",
          foreignField: "_id",
          as: "feedExecutionLog",
        },
      },
      {
        $unwind: {
          path: "$feedExecutionLog",
          preserveNullAndEmptyArrays: true,
        },
      },

      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
    ];

    const [items, countResult] = await Promise.all([
      NotificationModel.aggregate<NotificationWithSiteAndFeedExecutionLogLean>([
        ...basePipeline,

        {
          $sort: sortMap[sort],
        },

        {
          $skip: skip,
        },

        {
          $limit: limit,
        },

        {
          $project: {
            _id: 1,

            userId: 1,
            target: 1,
            type: 1,

            title: 1,
            message: 1,

            isRead: 1,

            metadata: 1,

            createdAt: 1,
            updatedAt: 1,

            site: {
              _id: "$site._id",
              name: "$site.name",
              url: "$site.url",
              favicon_url: "$site.favicon_url",
            },

            feedExecutionLog: {
              _id: "$feedExecutionLog._id",
              executionId: "$feedExecutionLog.executionId",

              status: "$feedExecutionLog.status",
              reason: "$feedExecutionLog.reason",

              failedAtStage: "$feedExecutionLog.failedAtStage",

              error: "$feedExecutionLog.error",

              startedAt: "$feedExecutionLog.startedAt",

              finishedAt: "$feedExecutionLog.finishedAt",

              durationMs: "$feedExecutionLog.durationMs",
            },
          },
        },
      ]),

      NotificationModel.aggregate([
        ...basePipeline,
        {
          $count: "totalCount",
        },
      ]),
    ]);

    return {
      items,
      totalCount: countResult[0]?.totalCount ?? 0,
    };
  }

  /**
   * 관리자 알림 상세 조회
   *
   * Notification + Site + FeedExecutionLog 상세 정보
   */
  async findDetailById(
    id: string,
  ): Promise<NotificationWithSiteAndFeedExecutionLogLean | null> {
    const objectId = new Types.ObjectId(id);

    const basePipeline = [
      {
        $match: {
          _id: objectId,
        },
      },

      /**
       * Site JOIN
       */
      {
        $lookup: {
          from: "sites",
          localField: "metadata.siteId",
          foreignField: "_id",
          as: "site",
        },
      },
      {
        $unwind: {
          path: "$site",
          preserveNullAndEmptyArrays: true,
        },
      },

      /**
       * FeedExecutionLog JOIN
       */
      {
        $lookup: {
          from: "feedexecutionlogs",
          localField: "metadata.feedExecutionLogId",
          foreignField: "_id",
          as: "feedExecutionLog",
        },
      },
      {
        $unwind: {
          path: "$feedExecutionLog",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const [result] =
      await NotificationModel.aggregate<NotificationWithSiteAndFeedExecutionLogLean>(
        [
          ...basePipeline,

          {
            $project: {
              _id: 1,

              userId: 1,
              target: 1,
              type: 1,

              title: 1,
              message: 1,

              isRead: 1,

              metadata: 1,

              createdAt: 1,
              updatedAt: 1,

              site: {
                _id: "$site._id",
                name: "$site.name",
                url: "$site.url",
                favicon_url: "$site.favicon_url",
              },

              feedExecutionLog: {
                _id: "$feedExecutionLog._id",
                executionId: "$feedExecutionLog.executionId",

                status: "$feedExecutionLog.status",
                reason: "$feedExecutionLog.reason",

                failedAtStage: "$feedExecutionLog.failedAtStage",

                error: "$feedExecutionLog.error",

                startedAt: "$feedExecutionLog.startedAt",

                finishedAt: "$feedExecutionLog.finishedAt",

                durationMs: "$feedExecutionLog.durationMs",
              },
            },
          },
        ],
      );

    return result ?? null;
  }

  /**
   * 알림 일괄 생성
   *
   * @description
   * FeedItem 신규 등록 시
   * 다수 사용자에게 알림을 생성하기 위해 사용한다.
   */
  async createMany(notifications: CreateNotificationDto[]): Promise<void> {
    /**
     * 생성 대상 없음
     */
    if (!notifications.length) {
      return;
    }

    /**
     * 알림 일괄 생성
     */
    await NotificationModel.insertMany(notifications, {
      ordered: false,
    });
  }
}
