import { useEffect, useState } from 'react';
import { cleanActionString } from '@/app/utils/utils';
import Link from 'next/link';

export default function Actions({ congress, billType, billNumber }) {
    const [isLoading, setIsLoading] = useState(true);
    const [actions, setActions] = useState("");

    useEffect(() => {
        const fetchActions = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/show-bill/${congress}/${billType}/${billNumber}/actions`);
                if (!response.ok) {
                    throw new Error(`http error. status: ${response.status}`);
                }
                const data = await response.json();
                setActions(data.actions);
                console.log(data.actions);
            }
            catch (error) {
                console.error(`failed to fetch one bill: ${error}`)
            }
            setIsLoading(false);
        }
        fetchActions()
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!actions || actions.length === 0) {
        return <div>No actions found</div>
    }

    return (
        <>
            <div className="font-bold text-slate-700 pl-8 sm:pl-32 pt-4 pb-2">{actions.length > 1 ? "Actions" : "Action"}</div>
            {actions && actions.map((action, index) => (
                    <div key={index} className="relative pl-8 sm:pl-32 pb-6 pt-4 group">
                        <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                            <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">{action.actionDate}</time>
                        </div>
                        <div className="text-slate-500">{cleanActionString(action.text)}</div>
                    </div>
            ))}
        </>
    );
}
