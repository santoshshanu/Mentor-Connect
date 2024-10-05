// import { cn } from '@/lib/utils';
// import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
// import React, { useState } from 'react'
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
//   } from "@/components/ui/dropdown-menu"
// import { LayoutList, Users } from 'lucide-react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import EndCallButton from './EndCallButton';
// import Loader from './Loader';
// import WhiteboardCanvas from './whiteboard';

  
// type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

// const MeetingRoom = () => {
//     const searchParams=useSearchParams();
//     const isPersonalRoom= !!searchParams.get('personal');
//     const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
//     const [showParticipants, setShowParticipants] = useState(false);
//     const router=useRouter();

//     const {useCallCallingState}=useCallStateHooks();
//     const callingState=useCallCallingState();

//     if(callingState!==CallingState.JOINED) return <Loader />

//     const CallLayout = () => {
//         switch(layout){
//             case 'grid':
//                 return <PaginatedGridLayout />
//             case 'speaker-right':
//                 return <SpeakerLayout participantsBarPosition="left" />
//             default:
//                 return <SpeakerLayout participantsBarPosition="right" />
           
//         }
//     }

//   return (
//     <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
//         <div className='relative flex size-full items-center justify-center'>
//             <div className='flex size-full max-w-[1000px] items-center'>
//                 <CallLayout />
//             </div>
//             <div className={cn('h-[calc(100vh-86px)] hidden ml-2', {'show-block': showParticipants})}>
//                 <CallParticipantsList onClose={() => setShowParticipants(false)} />
//             </div>
//         </div>

//         <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap'>
//             <CallControls onLeave={() => router.push('/')} />

//             <DropdownMenu>
//                 <div className='flex items-center'>
//                     <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
//                         <LayoutList size={20} className='text-white' />
//                     </DropdownMenuTrigger>
//                 </div>
//                 <DropdownMenuContent className='border-dark-1 bg-cus-1 text-white'>
//                     {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item,index)=>(
//                         <div key={index}>
//                             <DropdownMenuItem 
//                             className='cursor-pointer'
//                             onClick={()=>{
//                                 setLayout(item.toLowerCase() as CallLayoutType)
//                             }}
//                             >
//                                 {item}
//                             </DropdownMenuItem>
//                             <DropdownMenuSeparator className='border-dark-1' />
//                         </div>
//                     ))}
//                 </DropdownMenuContent>
//             </DropdownMenu>

//             <CallStatsButton />
//             <button 
//                 onClick={() => setShowParticipants(
//                     (prev) => !prev)
//                 }>
//                 <div className='cursor-pointer rounded-2xl  bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
//                     <Users size={20} className='text-white' />
//                 </div>
//             </button>

//             {!isPersonalRoom && <EndCallButton />}


//         </div>
//     </section>
//   )
// }

// export default MeetingRoom


import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    CallControls,
    CallingState,
    CallParticipantsList,
    CallStatsButton,
    PaginatedGridLayout,
    SpeakerLayout,
    useCallStateHooks
} from '@stream-io/video-react-sdk';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Users } from 'lucide-react';
import EndCallButton from './EndCallButton';
import Loader from './Loader';
import WhiteboardCanvas from './whiteboard';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
    const searchParams = useSearchParams();
    const isPersonalRoom = !!searchParams.get('personal');
    const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
    const [showParticipants, setShowParticipants] = useState(false);
    const [showWhiteboard, setShowWhiteboard] = useState(false); // State for whiteboard visibility
    const router = useRouter();

    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    if (callingState !== CallingState.JOINED) return <Loader />;

    const CallLayout = () => {
        switch (layout) {
            case 'grid':
                return <PaginatedGridLayout />;
            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition="left" />;
            default:
                return <SpeakerLayout participantsBarPosition="right" />;
        }
    };

    return (
        <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
            <div className='relative flex size-full items-center justify-center'>
                <div className='flex size-full max-w-[1000px] items-center'>
                    <CallLayout />
                </div>
                <div className={cn('h-[calc(100vh-86px)] hidden ml-2', { 'show-block': showParticipants })}>
                    <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>

                {/* Whiteboard Canvas positioned within screen sharing area */}
                {showWhiteboard && (
                    <div className="absolute inset-0 flex justify-center items-center z-50">
                        <div className="relative w-[800px] h-[600px] bg-white border border-gray-300">
                            <WhiteboardCanvas />
                            <button
                                onClick={() => setShowWhiteboard(false)}
                                className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap'>
                <CallControls onLeave={() => router.push('/')} />

                <DropdownMenu>
                    <div className='flex items-center'>
                        <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
                            <LayoutList size={20} className='text-white' />
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent className='border-dark-1 bg-cus-1 text-white'>
                        {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                            <div key={index}>
                                <DropdownMenuItem
                                    className='cursor-pointer'
                                    onClick={() => {
                                        setLayout(item.toLowerCase() as CallLayoutType);
                                    }}
                                >
                                    {item}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className='border-dark-1' />
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <CallStatsButton />
                <button
                    onClick={() => setShowParticipants(prev => !prev)}
                >
                    <div className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
                        <Users size={20} className='text-white' />
                    </div>
                </button>

                {/* Toggle Whiteboard Visibility */}
                <button
                    onClick={() => setShowWhiteboard(prev => !prev)}
                    className='px-4 py-2 bg-green-500 text-white rounded'
                >
                    {showWhiteboard ? 'Hide Whiteboard' : 'Show Whiteboard'}
                </button>

                {!isPersonalRoom && <EndCallButton />}
            </div>
        </section>
    );
};

export default MeetingRoom;
