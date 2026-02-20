"use client";

import { Icon } from "@iconify/react";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  type UnscheduledItem as UnscheduledItemType,
} from "../_data/calendar-data";

type UnscheduledItemProps = {
  item: UnscheduledItemType;
  onSchedule: (item: UnscheduledItemType) => void;
};

export function UnscheduledItemCard({ item, onSchedule }: UnscheduledItemProps) {
  return (
    <div className="bg-white border border-stone-custom/40 border-l-2 border-l-dashed border-l-faded rounded-xl p-3">
      <div className="flex items-start gap-2.5">
        <span className="text-lg flex-shrink-0">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-ink line-clamp-2 leading-snug">
            {item.hook}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${STATUS_COLORS[item.status]}15`,
                color: STATUS_COLORS[item.status],
              }}
            >
              {STATUS_LABELS[item.status]}
            </span>
          </div>
          <button
            onClick={() => onSchedule(item)}
            className="schedule-btn mt-2 border border-stone-custom rounded-lg px-3 py-1.5 text-[10px] font-bold text-muted-rb flex items-center gap-1.5"
          >
            <Icon icon="solar:calendar-add-linear" width={12} />
            Planifier
          </button>
        </div>
      </div>
    </div>
  );
}
