import {Suspense} from "react";
import {MailsView} from "@/modules/profile/ui/views/mails-view";

const Page = () => {
    return (
        <Suspense>
            <MailsView/>
        </Suspense>
    );
};

export default Page;