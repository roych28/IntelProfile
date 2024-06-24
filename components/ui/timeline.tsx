'use client';

import * as React from 'react';
import styles from './timeline.module.css';
import dayjs from 'dayjs';

interface TimelineItem {
  id: number;
  content: string;
  start: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timeline}>
        {items.map((item) => (
          <div key={item.id} className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <p className={styles.timelineText}>{item.content}</p>
              <time className={styles.timelineTime}>{new Date(item.start).toLocaleDateString()}</time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
