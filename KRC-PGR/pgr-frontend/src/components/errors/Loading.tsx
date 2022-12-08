import { useEffect, useState } from "react";

function Loading() {
    const [symbols, setSymbols] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setSymbols(symbols.concat(' ;'));
        }, 10);

        // clearing interval
        return () => clearInterval(interval);
    });

    return (
        <>
            Loading{symbols}
        </>
    );
}

export default Loading;