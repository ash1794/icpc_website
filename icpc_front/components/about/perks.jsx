export default function ExclusicePerks(){
    return(
        <div className="flex w-screen justify-center items-center flex-col">
            <p className="text-[3vw]">Exclusive Perks</p>
            <div className="flex justify-center min-w-[80vw]">
                <div className="flex-1 flex items-center flex-col">
                    <div className="min-h-[20vw] min-w-[30vw] bg-gray-500 rounded-[2vw]"></div>
                    <p className="text-[1.5vw] text-center font-semibold">Cybersecurity Career Talk</p>
                    <p className="text-[1.5vw] text-center max-w-[30vw]">Attend a special session featuring India's #1 cybersecurity team, bi0s.</p>
                </div>
                <div className="flex-1 flex items-center flex-col">
                    <div className="min-h-[20vw] min-w-[30vw] bg-gray-500 rounded-[2vw]"></div>
                    <p className="text-[1.5vw] text-center font-semibold">Webinar for Beginners</p>
                    <p className="text-[1.5vw] text-center max-w-[30vw]">Kickstart Your Competitive Programming Journey with an exclusive webinar offered to Amritapuri participants.</p>
                </div>
            </div>
        </div>
    )
}