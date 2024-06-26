'use client';

import * as React from 'react';
import styles from './timeline.module.css';
import dayjs from 'dayjs';

interface TimelineItem {
  id: number;
  content: string;
  start: string;
  category: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const currentYear = dayjs().year();
  const startYear = Math.min(currentYear - 10, ...items.map(item => dayjs(item.start).year()));
  const years = [...Array(currentYear - startYear + 1)].map((_, index) => startYear + index);
  const categories = ['Last Seen', 'Created', 'Hibp', 'Google Reviews', 'Maps'];

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineGrid}>
        <div className={styles.emptyCell}></div>
        {years.map(year => (
          <div key={year} className={styles.yearLabel}>{year}</div>
        ))}
        {categories.map(category => (
          <React.Fragment key={category}>
            <div className={styles.categoryLabel}>{category}</div>
            {years.map(year => (
              <div key={`${year}-${category}`} className={styles.yearCategory}>
                {items
                  .filter(item => dayjs(item.start).year() === year && item.category === category)
                  .map(item => {
                    const month = dayjs(item.start).month();
                    const position = (month / 11) * 1; // Position based on month
                    return (
                      <div key={item.id} className={styles.timelineItem} style={{ top: `${position}% - 1rem` }}>
                        <div className={styles.timelineContent}>
                          <p className={styles.timelineText}>{item.content}</p>
                          <time className={styles.timelineTime}>{dayjs(item.start).format('MMM DD')}</time>
                        </div>
                        <div className={styles.timelineLine} style={{ height: `calc(${position}% - 12.5rem)` }}></div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
