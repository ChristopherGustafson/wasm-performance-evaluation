import { ChangeEvent, useEffect, useState } from "react";
import { name } from "faker/locale/en";
import measureTime from "./lib/measureTime";
import dataToCsv from "./lib/toCsv";
import { ITERATIONS, USER_AMOUNTS } from "./lib/experiment";

type User = {
    id: number;
    firstName: string;
    lastName: string;
};

const generateUser = (index: number): User => {
    return {
        id: index,
        firstName: name.firstName(),
        lastName: name.lastName(),
    };
};

const generateUsers = (amount: number): User[] => {
    return Array.from({ length: amount }, (_value, index) => {
        return generateUser(index);
    });
};

const sortUsers = (users: User[]): User[] => {
    const sorted = users.sort((a, b) => {
        if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) {
            return 1;
        } else if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) {
            return -1;
        }
        return 0;
    });
    return sorted;
};

const Users: React.FC<{ users: User[] }> = ({ users }) => {
    return (
        <ul id="user_list">
            {users.map((user) => (
                <li key={user.id}>
                    <span>{user.firstName}</span>
                    <span>{user.lastName}</span>
                </li>
            ))}
        </ul>
    );
};

const Js = () => {
    const [csvUrl, setCsvUrl] = useState<string>();
    const [amount, setAmount] = useState("100");
    const [users, setUsers] = useState(generateUsers(parseInt(amount)));

    const updateUserList = (value: string): number => {
        const parsedValue = value === "" ? 0 : parseInt(value);
        const generatedUsers = generateUsers(parsedValue);
        const [sortedUsers, sortingTime] = measureTime(
            sortUsers,
            `[JS] sort ${generatedUsers.length} users`,
            generatedUsers
        );
        setUsers(sortedUsers);
        return sortingTime;
    };

    useEffect(() => {
        updateUserList(amount);
    }, [amount]);

    const onAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
    };

    const refresh = () => {
        updateUserList(amount);
    };

    const runExperiments = async () => {
        const results: { [userAmount: number]: number[] } = USER_AMOUNTS.reduce(
            (prevValue, currentValue) => ({ ...prevValue, [currentValue]: [] }),
            {}
        );
        for (const amount of USER_AMOUNTS) {
            for (let iteration = 0; iteration < ITERATIONS; iteration++) {
                const sortingTime = await updateUserList(amount.toString());
                results[amount].push(sortingTime);
            }
        }
        setCsvUrl(dataToCsv(results));
    };

    return (
        <>
            <button onClick={runExperiments}>Run experiments</button>
            <button onClick={refresh}>Trigger refresh</button>
            <input min={0} type="number" value={amount} onChange={onAmountChange} />
            <br />
            {csvUrl && (
                <a href={csvUrl} download={"js-experiment-results.csv"}>
                    Download csv results
                </a>
            )}
            <Users users={users} />
        </>
    );
};

export default Js;
