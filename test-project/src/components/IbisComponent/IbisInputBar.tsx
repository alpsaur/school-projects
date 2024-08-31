interface IbisInputBarProps {
  labelName: string;
  attributeName: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  textAreaOnChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string | number;
  type: "text" | "number" | "checkbox" | "textarea";
  required?: boolean;
  checkFlag?: number;
  readonly?: boolean;
  checkboxLabel?: string;
}

export default function IbisInputBar({
  labelName,
  attributeName,
  onChange,
  textAreaOnChange,
  value,
  type,
  required = false,
  checkFlag,
  readonly = false,
  checkboxLabel = "Yes|No",
}: IbisInputBarProps) {
  const isText = type === "text";
  const isNumber = type === "number";
  const isCheckbox = type === "checkbox";
  const isTextArea = type === "textarea";

  const defaultValue = isText ? value || "" : value || 1;
  const defaultValueForTextArea = isTextArea ? value || "" : value || 1;

  const checkboxLables: string[] = checkboxLabel.split("|");

  return (
    <div className="flex min-h-10 items-center">
      <div className="text-left w-1/3">
        <p>{labelName}</p>
      </div>
      <div className="w-2/3">
        {isText && (
          <input
            type="text"
            name={attributeName}
            value={defaultValue}
            onChange={onChange}
            required={required}
            placeholder={`Enter the ${labelName}...`}
            disabled={readonly}
            className="w-full border"
          />
        )}
        {isNumber && (
          <input
            type="number"
            name={attributeName}
            value={defaultValue}
            onChange={onChange}
            required={required}
            disabled={readonly}
            className="border w-full"
          />
        )}
        {isCheckbox && (
          <>
            {checkboxLables.map((eachCheckboxlabel, index) => {
              const uid: string = eachCheckboxlabel + index;
              return (
                <div key={uid}>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name={`${attributeName}*${index}`}
                      checked={checkFlag === index}
                      onChange={onChange}
                      className="form-checkbox h-5 w-5 text-blue-500"
                      disabled={readonly}
                    />
                    <span className="ml-2">{eachCheckboxlabel}</span>
                  </label>
                </div>
              );
            })}
          </>
        )}
        {isTextArea && (
          <textarea
            name={attributeName}
            value={defaultValueForTextArea}
            onChange={textAreaOnChange}
            required={required}
            placeholder={`Enter the ${labelName}...`}
            disabled={readonly}
            className="border w-full"
          />
        )}
      </div>
    </div>
  );
}
