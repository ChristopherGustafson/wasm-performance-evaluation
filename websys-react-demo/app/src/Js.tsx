import { ChangeEvent, useEffect, useState } from "react";
import { name } from "faker/locale/en";
import measureTime from "./lib/measureTime";

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
    const [amount, setAmount] = useState("100");
    const [users, setUsers] = useState(generateUsers(parseInt(amount)));

    const updateUserList = (value: string) => {
        const parsedValue = value === "" ? 0 : parseInt(value);
        const generatedUsers = generateUsers(parsedValue);
        const sortedUsers = measureTime(sortUsers, `[JS] sort ${generatedUsers.length} users`, generatedUsers);
        setUsers(sortedUsers);
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

    return (
        <>
            <button onClick={refresh}>Trigger refresh</button>
            <input min={0} type="number" value={amount} onChange={onAmountChange} />
            <Users users={users} />
        </>
    );
};

export default Js;
