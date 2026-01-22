'use client';

import { useState } from 'react';
import { formatRelativeTime } from '@/lib/utils';
import type { Activity } from '@/domain/types';
import { ActivityModal } from './activity-modal';

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  if (activities.length === 0) {
    return <p className="text-sm text-gray-500 py-4">No hay actividad reciente</p>;
  }

  return (
    <>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            onClick={() => handleActivityClick(activity)}
            className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition-colors"
          >
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                por {activity.userName} • {formatRelativeTime(activity.createdAt)}
              </p>
            </div>
            <div className="text-xs text-[#14B8A6] font-medium">Ver detalles</div>
          </div>
        ))}
      </div>

      <ActivityModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedActivity(null);
        }}
      />
    </>
  );
}
