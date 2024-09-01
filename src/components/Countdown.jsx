import { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';

const calculateDuration = (eventTime) =>
  moment.duration(Math.max(eventTime - Math.floor(Date.now() / 1000), 0), 'seconds');

export default function Countdown({ eventTime, interval }) {
  const [duration, setDuration] = useState(calculateDuration(eventTime));
  const timerRef = useRef(0);
  const timerCallback = useCallback(() => {
    setDuration(calculateDuration(eventTime));
  }, [eventTime]);

  useEffect(() => {
    timerRef.current = setInterval(timerCallback, interval);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [eventTime]);

  return (
    <div style={{ fontSize: '.85rem' }}>
      {duration.hours() < 10 ? '0' + duration.hours().toString() : duration.hours()}:
      {duration.minutes() < 10 ? '0' + duration.minutes().toString() : duration.minutes()}
      :
      {duration.seconds() < 10 ? '0' + duration.seconds().toString() : duration.seconds()}
    </div>
  );
}
