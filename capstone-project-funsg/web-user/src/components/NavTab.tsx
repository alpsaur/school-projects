import React, {useEffect, useState} from 'react';

import "../css/NavTab.css"

type Props = {
    content: string[];
    onContentChange: (selectedOption: string) => void;
};

function NavTab({ content , onContentChange}: Props) {
    const [selectedOption, setSelectedOption] = useState<string>(content[0]);

    const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        onContentChange(selectedValue);
    };

    useEffect(() => {
        onContentChange(selectedOption); // Initial selection notification
    }, [selectedOption, onContentChange]);

    return (
        <>
            <div className="radio-inputs">
                {content.map((str, index) => (
                    <label className="radio" key={index}>
                        <input
                            type="radio"
                            name="radio"
                            value={str}
                            checked={selectedOption === str}
                            onChange={handleContentChange}
                        />
                        <span className="name">{str}</span>
                    </label>
                ))}
            </div>
        </>
    );
}

export default NavTab;
