import ToggleDocumentUploadInChats from "@/components/admin/appSettings/ToggleDocumentUploadInChats"
import AuthenticatedUsersLayout from "../layouts/AuthenticatedUsersLayout"
import AdminMedia from "@/components/admin/appSettings/AdminMedia"

const AppSettings = () => {
    return (
        <AuthenticatedUsersLayout>
            <div className='container'>
                <h1 className='text-2xl font-medium mb-10'>App Settings</h1>

                <hr />

                <div className="my-10">
                    <h2 className="text-lg">Allow Document Uplaod</h2>
                    <p className="text-gray-500">Turn this feature on if you want your users to upload their own documents in chats</p>
                    <div className="my-5">
                        <ToggleDocumentUploadInChats />
                    </div>
                </div>

                <hr />

                <div className="my-10">
                    <h2 className="text-lg">System Documents</h2>
                    <p className="text-gray-500">You can see all your douments here, when your users chat with AI they will have the context of these documents.</p>
                    <div className="my-5">
                        <AdminMedia />
                    </div>
                </div>
            </div>
        </AuthenticatedUsersLayout>
    )
}

export default AppSettings