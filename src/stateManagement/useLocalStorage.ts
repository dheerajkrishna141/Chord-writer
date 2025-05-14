const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  const getItem = () => {
    return window.localStorage.getItem(key);
  };

  const clear = () => {
    return window.localStorage.clear();
  };

  return { setItem, getItem, clear };
};

export default useLocalStorage;
