"use client";
import { CreateFileCategoryInput } from '@/API';
import IbisInputBar from '@/components/IbisComponent/IbisInputBar';
import Link from 'next/link';
import React, { useState } from 'react';

interface FileCategoryDetailProps {
    fileCategoryDataFromServer: CreateFileCategoryInput;
    finalSubmit: (inputSubmitData: CreateFileCategoryInput) => Promise<void>;
}

interface FileCategoryInputSetting {
    labelName: string;
    attributeName: string;
    value?: string;
    required?: boolean;
}

const IbisFileCategoryDetailComponent: React.FC<FileCategoryDetailProps> = ({
    fileCategoryDataFromServer,
    finalSubmit,
}) => {
    const [filecategoryInput, setFilecategoryInput] = useState<CreateFileCategoryInput>(fileCategoryDataFromServer);
    const [acceptableExtensions, setAcceptableExtensions] = useState<string[]>(fileCategoryDataFromServer.acceptableExtensions as string[]);
    const [finalSubmitValid, setFinalSubmitValid] = useState<boolean>(false);

    const filecategoryInputSettingEntities: FileCategoryInputSetting[] = [
        {
            labelName: "File Category Name: ",
            attributeName: "name",
            value: filecategoryInput.name || "",
            required: true,
        },
        {
            labelName: "File Category Description: ",
            attributeName: "description",
            value: filecategoryInput.description || "",
            required: true,
        },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const newFileCategoryInput = { ...filecategoryInput, [name]: value };
        setFilecategoryInput(newFileCategoryInput);
    };

    const handleFinalSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Submit data: ", filecategoryInput);
        e.preventDefault();
        await finalSubmit(filecategoryInput);
    };

    return (
        <div className="flex flex-col items-center w-full p-5">
            <div className="contents p-5 w-full items-center">
                {/* back to list page button ... */}
                <Link
                    href={"/admin/filecategory"}
                    className='w-4/5'
                >
                    <div
                        className={`bg-blue-400 hover:bg-blue-800 text-white w-full h-6 font-bold rounded text-center`}
                    >
                        Back to File Category List Page
                    </div>
                </Link>

                {/* File Category Info Input Part ... */}
                <div className='bg-white p-5 w-4/5 mt-2 mb-2 rounded-lg border-2 border-cyan-700'>
                    <p>File Category Detail</p>
                    {filecategoryInputSettingEntities.map((entity) => {
                        return (
                            <div key={entity.attributeName}>
                                <IbisInputBar
                                    labelName={entity.labelName}
                                    attributeName={entity.attributeName}
                                    type='text'
                                    required={entity.required}
                                    onChange={handleInputChange}
                                    value={entity.value}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Select AcceptableExtensions Component ... */}
                <div className='bg-white p-5 w-4/5 mt-2 mb-2 rounded-lg border-2 border-cyan-700'>
                    <p> empty </p>
                </div>

                {/* Final Submit Button ... */}
                <div className='w-4/5'>
                    <button
                        className={`w-full bg-green-400 hover:bg-green-900 text-white font-bold py-2 px-4 rounded ${finalSubmitValid ? 'cursor-pointer' : 'disabled:bg-gray-400 cursor-not-allowed'}`}
                        disabled={!finalSubmitValid}
                        onClick={handleFinalSubmit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IbisFileCategoryDetailComponent;