import { ChangeEvent, ReactNode, useCallback } from "react";
import { CommonInputProps } from "~~/components/scaffold-eth";
import { Input } from "~~/components/ui/Input";
type InputBaseProps<T> = CommonInputProps<T> & {
  error?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export const InputBase = <T extends { toString: () => string } | undefined = string>({
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  prefix,
  suffix,
}: InputBaseProps<T>) => {
  let modifier = "";
  if (error) {
    modifier = "border-error";
  } else if (disabled) {
    modifier = "border-disabled bg-muted";
  }

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value as unknown as T);
    },
    [onChange],
  );

  return (
    <div className={`flex items-center  ${modifier}`}>
      {prefix}
      <Input
        className=" focus:outline-none focus:text-secondary-content h-[2.2rem] min-h-[2.2rem] px-6 border w-full font-medium placeholder:text-accent/50 text-secondary-content"
        placeholder={placeholder}
        name={name}
        value={value?.toString()}
        onChange={handleChange}
        disabled={disabled}
        autoComplete="off"
      />
      {suffix}
    </div>
  );
};
