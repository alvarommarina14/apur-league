import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { OptionType } from '@/types/forms';

import Select from 'react-select';

interface CustomSelectProps {
    value: OptionType | OptionType[] | null;
    options: OptionType[];
    onChange: (newValue: SingleValue<OptionType> | MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => void;
    instanceId: string;
    isDisabled?: boolean;
    isMulti?: boolean;
    placeholder?: string;
}

export default function CustomSelect({
    value,
    options,
    instanceId,
    onChange,
    isDisabled,
    isMulti = false,
    placeholder,
}: CustomSelectProps) {
    return (
        <Select
            instanceId={`filters-select-${instanceId}`}
            value={value}
            options={options}
            isDisabled={isDisabled}
            isMulti={isMulti}
            placeholder={placeholder}
            closeMenuOnSelect={!isMulti}
            menuPlacement="auto"
            onChange={onChange}
            unstyled
            classNames={{
                control: ({ isFocused, isDisabled }) =>
                    `${isDisabled ? 'opacity-30' : ''} bg-white rounded-md border py-2 pl-4 pr-2 flex flex-wrap gap-1 focus-within:ring-1 focus-within:ring-apur-green ${
                        isFocused ? 'border-apur-green' : 'border-gray-300'
                    }`,
                menu: () => 'z-50 rounded-md shadow-lg bg-white mt-2 border border-gray-300 overflow-hidden',
                option: ({ isFocused, isSelected, isDisabled }) =>
                    `cursor-pointer select-none px-4 py-2 ${isDisabled ? 'opacity-30' : ''} ${
                        isFocused || isSelected ? 'bg-apur-green text-white' : 'text-gray-900'
                    }`,
                multiValue: () =>
                    'mr-1 bg-apur-lightGreen text-apur-green rounded-full px-2 py-1 flex items-center text-sm',
                multiValueLabel: () => 'pr-1 truncate',
                multiValueRemove: () =>
                    'pl-1 text-apur-green hover:text-red-800 hover:bg-red-100 rounded-full p-1 cursor-pointer',
                singleValue: () => 'truncate',
                input: () => 'text-gray-900 cursor-pointer',
                dropdownIndicator: () =>
                    'text-neutral-500 mx-1 p-1 rounded-full cursor-pointer hover:text-neutral-700 hover:bg-gray-200',
                indicatorSeparator: () => 'bg-gray-300',
                clearIndicator: () =>
                    'text-neutral-500 mx-1 p-1 rounded-full hover:text-neutral-700 hover:bg-gray-200 cursor-pointer',
            }}
        />
    );
}
