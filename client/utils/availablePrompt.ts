export const availablePromptTypes = [
  {
    value: "improve grammar",
    label: "Improve Grammar",
    description: "Fix grammar and style issues",
  },
  {
    value: "summarize",
    label: "Summarize",
    description: "Create a concise summary",
  },
  {
    value: "expand",
    label: "Expand",
    description: "Add more details and context",
  },
];


 export const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "2-digit",
      });
    }
  };