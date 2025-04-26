import React from 'react'

function Comments() {
    return (
        <div className='w-full'>
            <h3>Commments (45)</h3>
            <div className='flex flex-col w-full pt-10'>

                <div className="commentCard flex flex-col w-full gap-4 pb-5">

                    <div className="avatar flex justify-between items-center">
                        <div className='flex gap-5 justify-between items-center'>
                        <img src="/assets/Avatar 3.png"
                        width={70}
                        height={70}
                        alt="" />
                        <h3 className='text-xl'>Richard Flynn</h3>
                        </div>
                        <img src="/assets/ChatCircleDots.svg" alt="" />

                    </div>

                    <div className="content">
                    Loving this recipe! So many delicious recipes to choose from...
                    </div>

                    <div className="interaction flex gap-3">
                        <img src="/assets/commentHeartFilled.svg" alt="" />
                        <h4 className='text-gray-500 text-sm'>65</h4>
                        <div className="date text-gray-500 text-sm">1 month ago</div>
                    </div>
                    <hr
         className='border-t border-gray-300 my-4'/>
                </div>
                
                    <div className="commentCard flex flex-col w-full gap-4 pb-5">

                    <div className="avatar flex justify-between items-center">
                        <div className='flex gap-5 justify-between items-center'>
                        <img src="/assets/avatar 4.png"
                        width={70}
                        height={70}
                        alt="" />
                        <h3 className='text-xl'>Mitchell Oconnor</h3>
                        </div>
                        <img src="/assets/ChatCircleDots.svg" alt="" />

                    </div>

                    <div className="content">
                    Loving this recipe! So many delicious recipes to choose from...
                    </div>

                    <div className="interaction flex gap-3">
                        <img src="/assets/commentHeartFilled.svg" alt="" />
                        <h4 className='text-gray-500 text-sm'>65</h4>
                        <div className="date text-gray-500 text-sm">1 month ago</div>
                    </div>
                    <hr className='border-t border-gray-300 my-4' />
                    </div>

                    <div className="commentCard flex flex-col w-full gap-4 pb-5">

                    <div className="avatar flex justify-between items-center">
                        <div className='flex gap-5 justify-between items-center'>
                        <img src="/assets/Avatar 8.png"
                        width={70}
                        height={70}
                        alt="" />
                        <h3 className='text-xl'>Finnegan Ortega</h3>
                        </div>
                        <img src="/assets/ChatCircleDots.svg" alt="" />

                    </div>

                    <div className="content">
                    Loving this recipe! So many delicious recipes to choose from...
                    </div>

                    <div className="interaction flex gap-3">
                        <img src="/assets/commentHeartFilled.svg" alt="" />
                        <h4 className='text-gray-500 text-sm'>65</h4>
                        <div className="date text-gray-500 text-sm">1 month ago</div>
                    </div>
                    <hr className='border-t border-gray-300 my-4' />
                    </div>
       
            </div>
        </div>
    )
}
export default Comments;