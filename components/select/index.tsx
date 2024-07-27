import { useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';
import SingleValue from "react-select/creatable";

interface ISelectProps {
  options?: { label: string; value: number }[];
  placeholder: string;
  onCreate?: (inputValue: string) => void;
  value?: { label: string; value: number };
  onChange: (value: { label: string; value: number } | null) => void;
  defaultValue?: { label: string; value: number };
}

const Select = ({ options = [], placeholder, onCreate, value, onChange, defaultValue }: ISelectProps) => {

  const onSelect = (option: { label: string; value: number; } | null) => {
    onChange(option)
  }

  const formattedValue = useMemo(() => options.find(option => option.value === value?.value), [options, value])
  return (
    <CreatableSelect
      isClearable
      options={options}
      placeholder={placeholder}
      onCreateOption={onCreate}
      value={formattedValue}
      onChange={onSelect}
      defaultValue={defaultValue}
    />
  );
};

export default Select;
