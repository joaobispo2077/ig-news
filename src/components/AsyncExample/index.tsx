import { useEffect, useState } from 'react';

export function AsyncExample() {
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsButtonVisible(true), 1000);
  }, []);

  return (
    <div>
      <h1>Async Example</h1>
      {isButtonVisible && <button>Click me</button>}
    </div>
  );
}
