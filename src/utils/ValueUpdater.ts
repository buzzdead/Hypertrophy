// ValueUpdater.ts
interface ValueUpdater {
  handleIncrement: (currentValue: number) => void;
  handleDecrement: (currentValue: number) => void;
  handleInputChange: (currentValue: number, text: string) => void;
}

const createValueUpdater = (
  setCurrentValue: (value: number) => void,
  onChange: (value: number) => void,
  incrementValue: number = 1,
  decrementValue: number = 1,
): ValueUpdater => {
  const updateValueWith = (currentValue: number, calculateNewValue: (currentValue: number) => number) => {
    const newValue = calculateNewValue(currentValue);
    setCurrentValue(newValue);
    onChange(newValue);
  };

  return {
    handleIncrement: (currentValue: number) => updateValueWith(currentValue, value => value + incrementValue),
    handleDecrement: (currentValue: number) =>
      updateValueWith(currentValue, value => Math.max(value - decrementValue, 0)),
    handleInputChange: (currentValue: number, text: string) => {
      const newValue = parseInt(text, 10);
      if (!isNaN(newValue)) {
        updateValueWith(currentValue, () => newValue);
      }
    },
  };
};

export {createValueUpdater};
export type {ValueUpdater};
