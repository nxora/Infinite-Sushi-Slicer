/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import styles from "./App.module.css";

const INITIAL_SLICE_COUNT = 6;
const REMOVE_ANIMATION_DURATION = 500;
const ADD_ANIMATION_DURATION = 500;
const MAX_SLICES = 10;

interface Slice {
  id: string;
  state: "" | "removing" | "adding";
}

export default function App() {
  const [slices, setSlices] = useState<Slice[]>(
    Array.from({ length: INITIAL_SLICE_COUNT }, () => ({
      id: crypto.randomUUID(),
      state: "",
    }))
  );

  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    return () => {
      let id = window.setTimeout(() => {}, 0);
      while (id--) window.clearTimeout(id);
    };
  }, []);

  const randomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  const changeBackground = () => {
    document.body.style.transition = "background 0.5s ease";
    document.body.style.background = randomColor();
  };

  const handleSliceClick = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);

      changeBackground(); // ✅ Bonus feature!

      const updatedSlices = slices.map((slice, i) =>
        i === index ? { ...slice, state: "removing" } : slice
      );
      setSlices(updatedSlices);

      setTimeout(() => {
        setSlices((current) => current.filter((_, i) => i !== index));
        addSlice();
      }, REMOVE_ANIMATION_DURATION);
    },
    [animating, slices]
  );

  const addSlice = useCallback(() => {
    setSlices((currentSlices) => {
      if (currentSlices.length >= MAX_SLICES) return currentSlices;
      return [
        ...currentSlices,
        { id: crypto.randomUUID(), state: "adding" },
      ];
    });

    setTimeout(() => {
      setSlices((currentSlices) =>
        currentSlices.map((slice) =>
          slice.state === "adding" ? { ...slice, state: "" } : slice
        )
      );
      setAnimating(false);
    }, ADD_ANIMATION_DURATION);
  }, []);

  return (
    <div className={styles.roll}>
      {slices.map((slice, index) => (
        <div
          key={slice.id}
          className={`${styles.slice} ${styles[slice.state]}`}
          role="button"
          tabIndex={0}
          aria-label={`Slice number ${index + 1}`}
          onClick={() => handleSliceClick(index)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleSliceClick(index);
            }
          }}
        ></div>
      ))}
    </div>
  );
}
