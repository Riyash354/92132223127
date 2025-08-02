export function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  export function isValidShortcode(code) {
    return /^[a-zA-Z0-9]{4,20}$/.test(code);
  }
  