import Select from 'react-select';

type OptionType = {
    label: string;
    value: string;
    isDisabled?: boolean;
};

interface CustomSelectProps {
    value: OptionType | null;
    options: OptionType[];
    setValue: (value: string) => void;
    instanceId: string;
    onChangeExtra?: (option: OptionType | null) => void;
    isDisabled?: boolean;
    placeholder?: string;
}

export default function CustomSelect({
    value,
    options,
    setValue,
    instanceId,
    onChangeExtra,
    isDisabled,
    placeholder,
}: CustomSelectProps) {
    return (
        <Select
            instanceId={`filters-select-${instanceId}`}
            value={value}
            options={options}
            isDisabled={isDisabled}
            placeholder={placeholder}
            closeMenuOnSelect
            menuPlacement="auto"
            onChange={(option) => {
                if (onChangeExtra) {
                    onChangeExtra(option);
                } else {
                    setValue(option?.value ?? '');
                }
            }}
            unstyled
            classNames={{
                control: ({ isFocused, isDisabled }) =>
                    `${isDisabled && 'opacity-30'} bg-white rounded-md border py-2 pl-4 focus-within:ring-1 focus-within:ring-apur-green ${
                        isFocused ? 'border-apur-green' : 'border-gray-300'
                    }`,
                menu: () =>
                    'z-50 rounded-md shadow-lg bg-white mt-2 border border-gray-300 overflow-hidden',
                option: ({ isFocused, isSelected, isDisabled }) =>
                    `cursor-pointer select-none px-4 py-2 ${isDisabled && 'opacity-30'} ${
                        isFocused || isSelected
                            ? 'bg-apur-green text-white'
                            : 'text-gray-900'
                    }`,
                singleValue: () => 'truncate',
                input: () => 'text-gray-900 cursor-pointer',
                dropdownIndicator: () => 'text-gray-500 px-2 cursor-pointer',
                indicatorSeparator: () => 'bg-gray-300',
            }}
        />
    );
}
