import { useEffect, useState } from "react";

export const useClientSide = () => {
  const [isClientSide, setIsClientSide] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClientSide(true);
    }
  }, []);
  return isClientSide;
};
