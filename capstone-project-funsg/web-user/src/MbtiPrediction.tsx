import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/MbtiPrediction.css';
import axiosConfig from "./axiosConfig.tsx";

const fetchWords = async (): Promise<Map<string, string>> => {
    try {
        const response = await axiosConfig.get('/users/MBTITest');
        if (response.status !== 200) {
            throw new Error('Failed to fetch words');
        }
        return new Map(Object.entries(response.data));
    } catch (error) {
        throw new Error('Failed to fetch words');
    }
};

const sendPrediction = async (userInputs: string[]): Promise<void> => {
    try {
        const response = await axiosConfig.post(
            '/users/prediction',
            { userInputs },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status !== 200) {
            throw new Error('Failed to send prediction');
        }
    } catch (error) {
        throw new Error('Failed to send prediction');
    }
};

const MbtiPrediction: React.FC = () => {
    const [wordsMap, setWordsMap] = useState<Map<string, string>>(new Map());
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getWords = async () => {
            try {
                const fetchedWords = await fetchWords();
                setWordsMap(fetchedWords);
            } catch (error) {
                console.error(error);
                alert('Failed to fetch words');
            }
        };

        getWords();
    }, []);

    const handleWordClick = (key: string) => {
        setSelectedKey(key);
    };

    const handleSubmit = async () => {
        if (selectedKey) {
            try {
                await sendPrediction([selectedKey]);
                alert('Prediction sent successfully');
                navigate('/HomePage');
            } catch (error) {
                alert('Failed to send prediction');
                console.error(error);
            }
        } else {
            alert('Please select an option before submitting');
        }
    };

    const handleViewMore = async () => {
        try {
            const fetchedWords = await fetchWords();
            setWordsMap(fetchedWords);
            setSelectedKey(null); // Reset the selected key
        } catch (error) {
            console.error(error);
            alert('Failed to fetch more words');
        }
    };

    const handleSkipTest = () => {
        navigate('/HomePage'); // Exit test and navigate away
    };

    return (
        <div className="mbti-prediction-container">
            <h2 className="mbti-prediction-title">Which sentence vibes you the most?</h2>
            <div className="mbti-prediction-words">
                {[...wordsMap.entries()].map(([key, sentence], index) => (
                    <div
                        key={index}
                        className={`mbti-prediction-word ${selectedKey === key ? 'selected' : ''}`}
                        onClick={() => handleWordClick(key)}
                    >
                        {sentence}
                    </div>
                ))}
            </div>
            <div className="mbti-prediction-buttons">
                <button className="mbti-prediction-submit" onClick={handleSubmit}>
                    Submit
                </button>
                <button className="mbti-prediction-view-more" onClick={handleViewMore}>
                    View More
                </button>
                <button className="mbti-prediction-skip" onClick={handleSkipTest}>
                    Skip Test
                </button>
            </div>
        </div>
    );
};

export default MbtiPrediction;
