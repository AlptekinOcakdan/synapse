import {AcademicianMailsView} from "@/modules/academician/ui/views/academician-mails-view";
import {Suspense} from "react";

const Page = () => {
    return (
        <Suspense>
            <AcademicianMailsView/>
        </Suspense>
    );
};

export default Page;