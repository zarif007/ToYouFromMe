import { LinkPreview } from '@dhaiwat10/react-link-preview';
import React, { useState } from 'react'
import Moment from 'react-moment'
import payloadInterface from '../Interfaces/payload';

const Message: React.FC<{ props: payloadInterface }> = ({ props }) => {

  const {timestamp, sender, text, url} = props;
  const [showMore, setShowMore] = useState<boolean>(false);

  return (
    <>
      <div className="flex justify-between items-center px-1 py-3 bg-[#ADD8E6] text-gray-700 mt-1 rounded-lg text-md font-semibold cursor-pointer"
        onClick={() => setShowMore(!showMore)}>
        <div className="pl-1">
          {sender.slice(0, 6)}...{sender.slice(38, 42)}
        </div>
        <div>
          <Moment toNow ago>
            {timestamp?.toISOString()}
          </Moment>
          <span> ago</span>
        </div>
        <div className="pr-1 cursor-pointer"
        onClick={() => setShowMore(!showMore)}>{showMore ? 'hide☝️' : 'view👇'}</div>
      </div>
      {
        showMore && 
        <div className='bg-[#ADD8E6] text-gray-700 rounded-lg flex sm:flex-row flex-col justify-between items-center'>
          <div className='flex flex-col p-1'>
            <div className='font-bold text-gray-700 uppercase flex flex-col justify-center'>
              <h1 className='md:text-lg text-xs '>{sender}</h1>
              <div className='text-xs'>
                <Moment toNow ago>
                  {timestamp?.toISOString()}
                </Moment>
                <span> ago</span>
                <div className='text-lg rounded-sm mt-2'>
                  {
                    text
                  }
                </div>
              </div>
            </div>
          </div>
          <div className='p-1'>
            <LinkPreview url={url} width='300px' height='300px' backgroundColor='black' borderColor='#0f172a' primaryTextColor='#94a3b8' />
          </div>
        </div>
      }
    </>
  );
}

export default Message
