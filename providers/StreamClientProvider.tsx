'use client';

import { TokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useState } from 'react';

const API_Key = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export const StreamVideoProvider = ({children}: {children: ReactNode}) => {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();
    const {user,isLoaded}=useUser();

    useEffect(()=>{
        if(!isLoaded || !user) return;
        if(!API_Key) throw new Error('Stream API Key Missing');

        const client=new StreamVideoClient({
            apiKey: API_Key,
            user:{
                id: user?.id,
                name: user?.username || user?.id,
                image: user?.imageUrl
            },
            tokenProvider: TokenProvider
        });

        setVideoClient(client);
    },[user,isLoaded]);

    if(!videoClient) return <Loader />;

    return (
        <StreamVideo client={videoClient}>
            {children}
        </StreamVideo>
    );
};

export default StreamVideoProvider