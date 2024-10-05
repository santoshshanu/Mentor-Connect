'use client'

import React, { useState } from 'react'
import Homecard from './Homecard'
import MeetingModal from './MeetingModal'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/hooks/use-toast"
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'

const MeetingTypeList = () => {
    const router=useRouter();
    const [MeetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
    
    const {user} = useUser();
    const client = useStreamVideoClient();
    const [values, setvalues] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    });

    const [callDetails, setcallDetails] = useState<Call>();
    
    const { toast } = useToast();
    const createMeeting = async () => {
        if(!client || !user) return;

        try{
            if(!values.dateTime){
                toast({title: "Please select a date and a time"});
                return;
            }
            const id=crypto.randomUUID();
            const call=client.call('default',id);

            if(!call) throw new Error('Failed to create call');

            const startsAt=values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description=values.description || 'Instant Meeting';

            await call.getOrCreate({
                data:{
                    starts_at: startsAt,
                    custom:{
                        description
                    } 
                }
            });

            setcallDetails(call);

            if(!values.description){
                router.push(`/meeting/${call.id}`);
            }

            toast({title: "Meeting Successfully Created"})
        }catch(error){
            console.log(error);
            toast({title: "Failed to create meeting"})
        }
    }

    const meetingLink=`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

    return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <Homecard 
            img="/icons/add-meeting.svg"
            title="New Meeting"
            description="Start an instant meeting"
            handleClick={() => setMeetingState('isInstantMeeting')}
            className="bg-orange-1"
        /> 
        <Homecard 
            img="/icons/join-meeting.svg"
            title="Join Meeting"
            description="Via invitation link"
            handleClick={() => setMeetingState('isJoiningMeeting')}
            className="bg-yellow-1"
        /> 
        <Homecard 
            img="/icons/schedule.svg"
            title="Schedule Meeting"
            description="Plan your meeting"
            handleClick={() => setMeetingState('isScheduleMeeting')}
            className="bg-blue-1"
        /> 
        <Homecard 
            img="/icons/recordings.svg"
            title="View Recordings"
            description="Check out your recordings"
            handleClick={() => router.push('/recordings')}
            className="bg-purple-1"
        /> 

        {!callDetails ? (
            <MeetingModal 
                isOpen={MeetingState==='isScheduleMeeting'}
                onClose = {() => setMeetingState(undefined)}
                title="Create Meeting"
                handleClick={createMeeting}
            >
                <div className='flex flex-col gap-2.5'>
                    <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
                    <Textarea 
                        className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' 
                        onChange={(e)=>{
                            setvalues({...values,description: e.target.value});
                        }}
                    />
                </div>

                <div className='flex w-full flex-col gap-2.5'>
                    <label className='text-base text-normal leading-[22px] text-sky-2'>Select Date and Time</label>
                    <ReactDatePicker 
                        selected={values.dateTime}
                        onChange={(date)=>setvalues({...values,dateTime:date!})}
                        showTimeSelect
                        timeFormat='HH:mm'
                        timeIntervals={15}
                        timeCaption='time'
                        dateFormat='MMMM d, yyyy h:mm aa'
                        className='w-full rounded bg-dark-3 p-2 focus:outline-1'
                    />
                    
                </div>
            </MeetingModal> 
        ): (
            <MeetingModal 
                isOpen={MeetingState==='isScheduleMeeting'}
                onClose = {() => setMeetingState(undefined)}
                title="Meeting Created"
                className="text-center"
                handleClick={() => {
                    navigator.clipboard.writeText(meetingLink);
                    toast({title: "Link Copied!"});
                }}
                image='/icons/checked.svg'
                buttonIcon='/icons/copy.svg'
                buttonText='Copy Meeting Link'
            /> 
        )}

        <MeetingModal 
            isOpen={MeetingState==='isInstantMeeting'}
            onClose = {() => setMeetingState(undefined)}
            title="Start instant meeting"
            className="text-center"
            buttonText="Start Meeting"
            handleClick={createMeeting}
        />

        <MeetingModal 
            isOpen={MeetingState==='isJoiningMeeting'}
            onClose = {() => setMeetingState(undefined)}
            title="Type the link here"
            className="text-center"
            buttonText="Join Meeting"
            handleClick={() => router.push(values.link)}
        >
            <Input 
                placeholder='Meeting Link'
                className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                onChange={(e) => setvalues({...values, link: e.target.value})}
            />
        </MeetingModal>
    </section>
  )
}

export default MeetingTypeList