'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Cosponsors from '@/components/cosponsors'
import Actions from '@/components/actions'
import Text from '@/components/text'
import SaveBillButton from '@/components/saveBillButton'
import { Inter, JetBrains_Mono } from "next/font/google";


export default async function Bill({ params }) {
    const { congress, billType, billNumber } = params;
    const [oneBill, setOneBill] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    useEffect(() => {
        const fetchOneBill = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/show-bill/${congress}/${billType}/${billNumber}`);
                if (!response.ok) {
                    throw new Error(`http error. status: ${response.status}`);
                }
                const data = await response.json();
                setOneBill(data.bill);
                console.log(data.bill);
            }
            catch (error) {
                console.error(`failed to fetch one bill: ${error}`)
            }
            setIsLoading(false);
        }
        fetchOneBill()
    }, [])

    if (isLoading) {
        return (
            <div role="status" className="flex justify-center">
                <svg aria-hidden="true" className="w-8 h-8 text-slate-400 animate-spin dark:text-slate-400 fill-indigo-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    if (!oneBill) {
        return <div>Could not load bill data</div>
    }

    return (
        <>
            <div className="relative pt-6 group">
            <div className="-translate-x-4">

                <div className="ultra font-medium text-xl text-indigo-500 mb-1 sm:mb-0 pb-1">{`${oneBill.type}-${oneBill.number}`}</div>
                <div className="text-slate-500">{oneBill.title}</div>
                <div className="font-bold text-slate-700 pt-4 pb-1">{oneBill.sponsors.length > 1 ? "Sponsors" : "Sponsor"}</div>
                {oneBill.sponsors.map((sponsor, index) => (
                    <Link key={index} href={`/pol/${sponsor.bioguideId}`}>
                        {console.log(sponsor)}
                        <div className="text-slate-500 hover:text-indigo-500 underline-animation w-fit">{sponsor.district ? 'Rep.' : 'Sen.'}{sponsor.fullname && toTitleCase(sponsor.fullname)} {sponsor.lastName && toTitleCase(sponsor.lastName)} [{sponsor.party}-{sponsor.state}{sponsor.district ? `-${sponsor.district}` : ''}]</div>
                    </Link>
                ))}
                {oneBill?.policyArea?.name && (
                    <>
                        <div className="font-bold text-slate-700 pt-4 pb-1">Policy Area</div>
                        <div className="text-slate-500">{oneBill.policyArea.name}</div>
                    </>
                )}
                <div className="w-fit">
                    <Text congress={congress} billType={billType} billNumber={billNumber} />
                </div>
                <Cosponsors congress={congress} billType={billType} billNumber={billNumber} />
                </div>        </div>
            <Actions congress={congress} billType={billType} billNumber={billNumber} />
        </>
    );
}
