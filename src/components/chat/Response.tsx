import ProtectedAxios from "@/api/protectedAxios"
import { UserContext } from "@/context/UserProvider"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type Response = {
    response_id: number,
    message_id: number,
    response: string,
    created_by: number,
}
const Response = ({ message_id }: { message_id: number }) => {
    const { user } = useContext(UserContext)
    const [loadingResponses, setLoadingResponses] = useState(true)
    const [responses, setResponses] = useState<Response[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        getResponses()
    }, [])

    const getResponses = () => {
        setLoadingResponses(true)
        ProtectedAxios.post("/api/user/chat/responses", { message_id, user_id: user.user_id })
            .then(res => {
                setResponses(res.data)

                setLoadingResponses(false)
            })
            .catch(error => {
                console.log(error);
                setLoadingResponses(false)
                alert("Could not get responses at the moment")
                navigate("/")
            })
    }

    const formatGeminiResponse = (responseText: string) => {
        let formattedText = responseText

        // Create bullet list items
        formattedText = formattedText.replace(/^\*\s+(.*)/gm, '<li class="-mb-2">$1</li>');
        
        // Bold certain parts (if needed)
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

        // Wrap links in <a> tags
        formattedText = formattedText.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, '<a href="$&" target="_blank" class="underline transition-all text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:dark:text-blue-500">$&</a>');

        return formattedText;
    };

    return (
        loadingResponses
            ? ""
            :
            <>
                {
                    responses.map((response, i) => (
                        <div className='flex gap-3' key={i}>
                            <span className='w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0'>AI</span>
                            <p className='mt-2 whitespace-pre-line break-all' dangerouslySetInnerHTML={{ __html: formatGeminiResponse(response.response) }} />                        </div>
                    ))
                }
            </>

    )
}

export default Response