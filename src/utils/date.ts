export function formatMessageTime(timestamp: string) {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      console.error('Date parsing error:', error);
      return '';
    }
  }
  
  export function formatDateHeader(timestamp: string) {
    try {
      const date = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
  
      if (date.toDateString() === today.toDateString()) {
        return 'Bugün';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Dün';
      } else {
        return date.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    } catch (error) {
      console.error('Date parsing error:', error);
      return '';
    }
  }
  
  export function isSameDay(date1: string, date2: string) {
    try {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      return d1.toDateString() === d2.toDateString();
    } catch (error) {
      console.error('Date comparison error:', error);
      return false;
    }
  }
  
  