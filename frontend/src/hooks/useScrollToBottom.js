import { useEffect, useRef } from "react";

const useScrollToBottom = (dependency) => {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [dependency]);

  return chatContainerRef;
};

export default useScrollToBottom;
