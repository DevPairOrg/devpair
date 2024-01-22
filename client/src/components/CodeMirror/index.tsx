import { useState, useCallback, MouseEventHandler, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { FetchRoutes, fetchTestResults } from '../../utility/fetchTestResults';
import './index.css';

interface TestResult {
    passOrFail?: boolean;
    success?: boolean;
    error?: string;
}

interface Props {
    problemId: keyof FetchRoutes;
    problemTitle?: string;
    route?: string;
}

function IDE(props: Props) {
    const { problemId, problemTitle } = props;
    const [value, setValue] = useState<string>('# Your Python Code Here');
    const [userResults, setUserResults] = useState<boolean[]>([]);

    const onChange = useCallback((val: string) => {
        console.log('val:', val);
        setValue(val);
    }, []);

    const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();
        const results = await fetchTestResults(value, problemId);
        console.log('Finished Fetching...', results);

        // Handles All Edge Cases if there are errors, then return the state as false for correct rendering of elements
        if (results && results.results[0].error) {
            setUserResults(
                results.results.map((result: TestResult) => {
                    if (result.error) return false;
                })
            );
        }

        // Main Test Case
        if (results && results.results && !results.results[0].error) {
            console.log('😁😁😁 results', results.results);
            setUserResults(results.results.map((result: TestResult) => result.passOrFail));
        }
    };

    useEffect(() => {
        console.log('😁😁😁 state', userResults);
    });

    return (
        <>
            <h1>Problem: {problemId === undefined ? 'Please enter a problem name for props' : `${problemTitle}`}</h1>
            <div id="user-results">
                {userResults && userResults[0] === true ? <div>✔ Test Case 1</div> : <div>❌ Test Case 1</div>}
                {userResults && userResults[1] === true ? <div>✔ Test Case 2</div> : <div>❌ Test Case 2</div>}
                {userResults && userResults[2] === true ? <div>✔ Test Case 3</div> : <div>❌ Test Case 3</div>}
            </div>
            <CodeMirror
                value={value}
                height="400px"
                extensions={[javascript({ jsx: true })]}
                onChange={onChange}
                theme={dracula}
            />
            <button onClick={handleClick}>Submit!</button>
        </>
    );
}
export default IDE;
